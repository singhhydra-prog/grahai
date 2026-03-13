"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Target, Search, CheckCircle2, AlertTriangle, Clock, BookOpen, Share2 } from "lucide-react"
import ShlokaCard from "./ShlokaCard"
import PlanetCard from "./PlanetCard"
import RemedyCard from "./RemedyCard"
import ShareCardGenerator from "./ShareCardGenerator"

interface ParsedBlock {
  type: "directAnswer" | "why" | "action" | "caution" | "timing" | "source" | "shloka" | "planets" | "remedy" | "text"
  content: string
  data?: Record<string, unknown>
}

// Parse AI response into structured 6-block format + existing special blocks
function parseResponse(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = []
  const lines = text.split("\n")
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const lower = line.toLowerCase()
    const trimmed = line.trim()

    // BLOCK 1: Direct Answer
    if (
      trimmed.startsWith("## 🎯") ||
      trimmed.startsWith("## Direct Answer") ||
      trimmed.startsWith("**Direct Answer**")
    ) {
      const content = gatherBlockContent(lines, i, ["## 🔍", "## Why", "## ✅", "## What To Do", "## ⚠️", "## What To Avoid", "## ⏰", "## Timing", "## 📖", "## Source"])
      if (content.text) {
        blocks.push({ type: "directAnswer", content: content.text })
      }
      i = content.endIndex
      continue
    }

    // BLOCK 2: Why This Is Happening
    if (
      trimmed.startsWith("## 🔍") ||
      trimmed.startsWith("## Why") ||
      trimmed.startsWith("**Why This Is Happening**")
    ) {
      const content = gatherBlockContent(lines, i, ["## ✅", "## What To Do", "## ⚠️", "## What To Avoid", "## ⏰", "## Timing", "## 📖", "## Source"])
      if (content.text) {
        blocks.push({ type: "why", content: content.text })
      }
      i = content.endIndex
      continue
    }

    // BLOCK 3: What To Do
    if (
      trimmed.startsWith("## ✅") ||
      trimmed.startsWith("## What To Do") ||
      trimmed.startsWith("**What To Do**")
    ) {
      const content = gatherBlockContent(lines, i, ["## ⚠️", "## What To Avoid", "## ⏰", "## Timing", "## 📖", "## Source"])
      if (content.text) {
        blocks.push({ type: "action", content: content.text })
      }
      i = content.endIndex
      continue
    }

    // BLOCK 4: What To Avoid
    if (
      trimmed.startsWith("## ⚠️") ||
      trimmed.startsWith("## What To Avoid") ||
      trimmed.startsWith("**What To Avoid**")
    ) {
      const content = gatherBlockContent(lines, i, ["## ⏰", "## Timing", "## 📖", "## Source"])
      if (content.text) {
        blocks.push({ type: "caution", content: content.text })
      }
      i = content.endIndex
      continue
    }

    // BLOCK 5: Timing
    if (
      trimmed.startsWith("## ⏰") ||
      trimmed.startsWith("## Timing") ||
      trimmed.startsWith("**Timing**")
    ) {
      const content = gatherBlockContent(lines, i, ["## 📖", "## Source"])
      if (content.text) {
        blocks.push({ type: "timing", content: content.text })
      }
      i = content.endIndex
      continue
    }

    // BLOCK 6: Source
    if (
      trimmed.startsWith("## 📖") ||
      trimmed.startsWith("## Source") ||
      trimmed.startsWith("**Source**")
    ) {
      const content = gatherBlockContent(lines, i, ["## 🎯", "## Direct Answer", "## 🔍", "## Why", "## ✅", "## What To Do", "## ⚠️", "## What To Avoid", "## ⏰", "## Timing"])
      if (content.text) {
        // Try to parse as shloka first
        const sourceData = parseShloka(content.text)
        if (sourceData) {
          blocks.push({ type: "source", content: content.text, data: sourceData })
        } else {
          blocks.push({ type: "source", content: content.text })
        }
      }
      i = content.endIndex
      continue
    }

    // Detect shloka/verse citation patterns (existing)
    if (
      lower.includes("📖") ||
      (lower.includes("source:") && (lower.includes("bphs") || lower.includes("parashara") || lower.includes("jataka") || lower.includes("phaladeepika") || lower.includes("saravali"))) ||
      (lower.includes("verse:") && lower.includes("chapter:"))
    ) {
      const sourceData = parseShloka(line)
      if (sourceData) {
        blocks.push({ type: "shloka", content: line, data: sourceData })
        i++
        continue
      }
    }

    // Detect planetary position tables (existing)
    if (
      (lower.includes("planet") && lower.includes("sign") && (lower.includes("house") || lower.includes("position"))) ||
      lower.match(/^\|?\s*(sun|moon|mars|mercury|jupiter|venus|saturn|rahu|ketu)\s*\|/i)
    ) {
      const planets: { planet: string; sign: string; house?: string; nakshatra?: string; dignity?: string }[] = []
      let j = i
      for (; j < Math.min(i + 15, lines.length); j++) {
        const row = lines[j]
        const planetMatch = row.match(/(?:^|\|)\s*(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s*(?:\||[-–:])\s*(.+)/i)
        if (planetMatch) {
          const parts = planetMatch[2].split(/\||[-–,]/).map(p => p.trim()).filter(Boolean)
          planets.push({
            planet: planetMatch[1],
            sign: parts[0] || "",
            house: parts[1] || undefined,
            nakshatra: parts[2] || undefined,
            dignity: parts[3] || undefined,
          })
        } else if (row.trim() && !row.match(/^\|?\s*[-─]+\|/)) {
          break
        }
      }

      if (planets.length > 0) {
        blocks.push({ type: "planets", content: "", data: { planets } })
        i = j
        continue
      }
    }

    // Detect remedy blocks (existing)
    if (
      lower.includes("remedy:") || lower.includes("🔮 remedy") || lower.includes("💎 remedy") ||
      lower.includes("recommended remedy") || lower.includes("upaya:")
    ) {
      const name = line.replace(/^[🔮💎🙏*_#\s]+|(?:recommended\s+)?(?:remedy|upaya):\s*/gi, "").trim()
      let details = ""
      let planet = ""
      let type = "General"
      let classicalRef = ""
      let j = i + 1

      for (; j < Math.min(i + 6, lines.length); j++) {
        const next = lines[j].trim()
        if (!next || next.startsWith("#")) break
        if (next.toLowerCase().startsWith("planet:")) planet = next.replace(/planet:\s*/i, "")
        else if (next.toLowerCase().startsWith("type:")) type = next.replace(/type:\s*/i, "")
        else if (next.toLowerCase().includes("source:") || next.includes("📖")) classicalRef = next.replace(/^[📖\s]+|source:\s*/gi, "")
        else details += (details ? " " : "") + next
      }

      blocks.push({
        type: "remedy",
        content: line,
        data: { name: name || "Vedic Remedy", type, planet, details, classicalRef },
      })
      i = j
      continue
    }

    // Accumulate text blocks
    if (trimmed) {
      blocks.push({ type: "text", content: line })
    }
    i++
  }

  return blocks
}

// Helper: gather content until next block marker
function gatherBlockContent(
  lines: string[],
  startIndex: number,
  blockMarkers: string[]
): { text: string; endIndex: number } {
  let content: string[] = []
  let i = startIndex + 1

  for (; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Check if this line starts a new block
    if (blockMarkers.some(marker => trimmed.startsWith(marker))) {
      break
    }

    // Skip empty lines between blocks, but include content
    if (trimmed) {
      content.push(line)
    } else if (content.length > 0) {
      content.push(line)
    }
  }

  return {
    text: content.map(l => l.trim()).filter((l, idx, arr) => l || idx < arr.length - 1).join("\n"),
    endIndex: i,
  }
}

// Helper: parse shloka from a line
function parseShloka(line: string) {
  const sourceMatch = line.match(/(?:source|📖)[:\s]*(.+?)(?:,\s*(ch\.?\s*\d+.*)|verse:.*)?$/i)
  if (!sourceMatch) return null

  return {
    source: sourceMatch[1]?.trim() || line.replace(/^[📖*_\s]+|source:\s*/gi, "").trim(),
    reference: sourceMatch[2]?.trim() || "",
    sanskrit: "",
    translation: "",
    insight: "",
  }
}

// Block components
function DirectAnswerBlock({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0 }}
      className="mt-3 text-sm leading-relaxed text-white/80"
    >
      {content}
    </motion.div>
  )
}

function WhyBlock({ content, index }: { content: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-indigo-400/20 bg-indigo-500/5 p-4 mt-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Why This Is Happening</span>
      </div>
      <div className="text-sm text-white/70 leading-relaxed space-y-1">
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </motion.div>
  )
}

function ActionBlock({ content, index }: { content: string; index: number }) {
  const actions = content.split("\n").filter(l => l.trim())
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4 mt-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">What To Do</span>
      </div>
      <div className="space-y-2">
        {actions.map((action, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-emerald-400 text-sm mt-0.5">✅</span>
            <p className="text-sm text-white/70 leading-relaxed flex-1">{action.replace(/^[-•*✅]\s*/, "").trim()}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function CautionBlock({ content, index }: { content: string; index: number }) {
  const cautions = content.split("\n").filter(l => l.trim())
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mt-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide">What To Avoid</span>
      </div>
      <div className="space-y-2">
        {cautions.map((caution, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
            <p className="text-sm text-white/70 leading-relaxed flex-1">{caution.replace(/^[-•*⚠️]\s*/, "").trim()}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function TimingBlock({ content, index }: { content: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-sky-400/20 bg-sky-500/5 p-4 mt-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-sky-400" />
        <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">Timing Window</span>
      </div>
      <div className="text-sm text-white/70 leading-relaxed">
        {content}
      </div>
    </motion.div>
  )
}

function SourceBlock({ content, data, index }: { content: string; data?: Record<string, unknown>; index: number }) {
  // If we have proper shloka data, use ShlokaCard
  if (data?.source) {
    return (
      <ShlokaCard
        key={index}
        source={(data.source as string) || ""}
        reference={(data.reference as string) || ""}
        sanskrit={(data.sanskrit as string) || ""}
        translation={(data.translation as string) || ""}
        insight={(data.insight as string) || ""}
      />
    )
  }

  // Otherwise render as styled source reference
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mt-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Source</span>
      </div>
      <div className="text-sm text-white/70 leading-relaxed">
        {content}
      </div>
    </motion.div>
  )
}

function renderMarkdownText(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-bold text-white/80 mt-3 mb-1">{line.slice(4)}</h4>
    if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-bold text-amber-400/80 mt-3 mb-1">{line.slice(3)}</h3>
    let content: React.ReactNode = line
    if (line.includes("**")) {
      const parts = line.split(/\*\*(.+?)\*\*/g)
      content = parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white/80 font-semibold">{part}</strong> : part)
    }
    if (!line.trim()) return <div key={i} className="h-2" />
    if (line.match(/^\s*[-•*]\s/)) return <li key={i} className="text-xs text-white/60 leading-relaxed ml-3">{line.replace(/^\s*[-•*]\s/, "")}</li>
    return <p key={i} className="text-xs text-white/60 leading-relaxed">{content}</p>
  })
}

interface ChatResponseParserProps {
  content: string
  vertical?: string
}

export default function ChatResponseParser({
  content,
  vertical = "astrology",
}: ChatResponseParserProps) {
  const blocks = useMemo(() => parseResponse(content), [content])
  const [shareOpen, setShareOpen] = useState(false)

  // Extract a summary of the response for sharing
  const extractShareText = () => {
    const firstBlock = blocks.find((b) => b.type === "directAnswer")
    if (firstBlock?.content) {
      const text = firstBlock.content
      return text.length > 280 ? text.slice(0, 277) + "..." : text
    }
    // Fallback to first text block
    const textBlock = blocks.find((b) => b.type === "text")
    if (textBlock?.content) {
      return textBlock.content.length > 280
        ? textBlock.content.slice(0, 277) + "..."
        : textBlock.content
    }
    // Last resort: clean full content
    const cleaned = content
      .replace(/[#*_~`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim()
    return cleaned.length > 280 ? cleaned.slice(0, 277) + "..." : cleaned
  }

  return (
    <>
      <div className="space-y-0">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "directAnswer":
              return <DirectAnswerBlock key={i} content={block.content} />
            case "why":
              return <WhyBlock key={i} content={block.content} index={i} />
            case "action":
              return <ActionBlock key={i} content={block.content} index={i} />
            case "caution":
              return <CautionBlock key={i} content={block.content} index={i} />
            case "timing":
              return <TimingBlock key={i} content={block.content} index={i} />
            case "source":
              return (
                <SourceBlock
                  key={i}
                  content={block.content}
                  data={block.data}
                  index={i}
                />
              )
            case "shloka":
              return (
                <ShlokaCard
                  key={i}
                  source={(block.data?.source as string) || ""}
                  reference={(block.data?.reference as string) || ""}
                  sanskrit={block.data?.sanskrit as string}
                  translation={block.data?.translation as string}
                  insight={block.data?.insight as string}
                />
              )
            case "planets":
              return (
                <PlanetCard
                  key={i}
                  planets={
                    (block.data?.planets as {
                      planet: string
                      sign: string
                      house?: string
                      nakshatra?: string
                      dignity?: string
                    }[]) || []
                  }
                />
              )
            case "remedy":
              return (
                <RemedyCard
                  key={i}
                  type={(block.data?.type as string) || "General"}
                  planet={(block.data?.planet as string) || ""}
                  name={(block.data?.name as string) || "Remedy"}
                  details={(block.data?.details as string) || ""}
                  classicalRef={block.data?.classicalRef as string}
                />
              )
            case "text":
              return (
                <div key={i} className="mt-2">
                  {renderMarkdownText(block.content)}
                </div>
              )
            default:
              return null
          }
        })}

        {/* Share Button */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: blocks.length * 0.1 }}
          onClick={() => setShareOpen(true)}
          className="mt-4 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/15 transition-colors text-xs font-medium group"
        >
          <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          Share Insight
        </motion.button>
      </div>

      {/* Share Card Generator Modal */}
      <ShareCardGenerator
        text={extractShareText()}
        vertical={vertical}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  )
}
