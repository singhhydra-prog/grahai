"use client"

import { useMemo } from "react"

/* ────────────────────────────────────────────────────
   MARKDOWN RENDERER — Lightweight markdown for agent responses
   Supports: bold, italic, headers, lists, code blocks
   No external dependencies — regex-based parsing
   ──────────────────────────────────────────────────── */

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const rendered = useMemo(() => sanitizeOutput(renderMarkdown(content)), [content])

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}

function renderMarkdown(text: string): string {
  if (!text) return ""

  let html = escapeHtml(text)

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    return `<pre class="md-code-block"><code class="lang-${lang}">${code.trim()}</code></pre>`
  })

  // Inline code (`...`)
  html = html.replace(/`([^`\n]+)`/g, '<code class="md-inline-code">$1</code>')

  // Headers (## to ####)
  html = html.replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')

  // Bold + Italic (***text***)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>')
  // Italic (*text*)
  html = html.replace(/\*(.+?)\*/g, '<em class="md-italic">$1</em>')

  // Horizontal rule (---)
  html = html.replace(/^---$/gm, '<hr class="md-hr" />')

  // Numbered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="md-li-num" value="$1">$2</li>')

  // Bullet lists (- or *)
  html = html.replace(/^[-*] (.+)$/gm, '<li class="md-li">$1</li>')

  // Wrap consecutive <li> in <ul>/<ol>
  html = html.replace(/((?:<li class="md-li">.*<\/li>\n?)+)/g, '<ul class="md-ul">$1</ul>')
  html = html.replace(/((?:<li class="md-li-num".*<\/li>\n?)+)/g, '<ol class="md-ol">$1</ol>')

  // Line breaks → paragraphs for non-special lines
  // First, split by double newlines for paragraphs
  const blocks = html.split(/\n{2,}/)
  html = blocks
    .map((block) => {
      block = block.trim()
      if (!block) return ""
      // Don't wrap already-wrapped elements
      if (
        block.startsWith("<h") ||
        block.startsWith("<pre") ||
        block.startsWith("<ul") ||
        block.startsWith("<ol") ||
        block.startsWith("<hr") ||
        block.startsWith("<li")
      ) {
        return block
      }
      // Convert single newlines to <br> within paragraphs
      return `<p class="md-p">${block.replace(/\n/g, "<br/>")}</p>`
    })
    .join("")

  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Post-sanitize: strip any tags that escaped our markdown rendering.
 * This acts as a second defense layer after escapeHtml.
 */
function sanitizeOutput(html: string): string {
  // Remove any script/iframe/object/embed tags that might have snuck through
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>.*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript\s*:/gi, "")
}
