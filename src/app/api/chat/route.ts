/* ════════════════════════════════════════════════════════════════
   GrahAI — Chat API Route (MiniMax-powered)

   POST /api/chat  →  SSE stream

   Uses MiniMax M2.5 (OpenAI-compatible) for all chat responses.
   Retains: vertical routing, sub-agent delegation, memory,
   tool-use loop, usage limits, metrics, Supabase persistence.

   Voice & tone rules encoded from:
   - OUTPUT_VOICE_RULES.md
   - PRODUCT_PHILOSOPHY.md
   - PERSONALIZATION_RULES.md
   ════════════════════════════════════════════════════════════════ */

import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"

import { getActivePrompt, getAgentNameForVertical } from "@/lib/agents/prompt-loader"
import { getRelevantMemories, extractAndSaveBirthData } from "@/lib/agents/memory"
import { trackAgentMetrics, incrementPromptInteractions } from "@/lib/agents/metrics"
import { getToolsForVertical, executeToolCall, TOOL_DISPLAY_INFO } from "@/lib/agents/tools"
import { detectSubAgent, getSubAgentPromptAugment, logDelegation } from "@/lib/agents/delegation"
import { checkUsage, incrementUsage } from "@/lib/agents/usage-limiter"

/* ────────────────────────────────────────────────────
   SUPABASE CLIENTS
   ──────────────────────────────────────────────────── */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabaseFromRequest(request: NextRequest) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll() { /* API route — no cookie writes needed */ },
    },
  })
}

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   MINIMAX CONFIG
   ──────────────────────────────────────────────────── */
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const MINIMAX_BASE_URL = "https://api.minimax.io/v1"
const MINIMAX_MODEL = "MiniMax-M1"

if (!MINIMAX_API_KEY) {
  console.error("CRITICAL: MINIMAX_API_KEY not configured — chat will not work")
}

/* ────────────────────────────────────────────────────
   GRAHAI TONE & WORD-LIMIT RULES
   (Derived from OUTPUT_VOICE_RULES.md, PRODUCT_PHILOSOPHY.md,
    PERSONALIZATION_RULES.md)
   ──────────────────────────────────────────────────── */

/** Word limits by chat context */
const CHAT_CONSTRAINTS: Record<string, { min: number; max: number; label: string }> = {
  short:        { min: 100, max: 200, label: "Quick chat reply / daily insight" },
  medium:       { min: 300, max: 500, label: "Standard chat response / weekly guidance" },
  daily:        { min: 250, max: 400, label: "Daily horoscope insight" },
  compatibility:{ min: 400, max: 600, label: "Compatibility reading" },
  report:       { min: 500, max: 800, label: "Report section" },
}

/** Tone rules injected into every system prompt */
const GRAHAI_TONE_RULES = `

## GrahAI Voice & Tone Rules (MANDATORY)

You are GrahAI — a calm, wise, personal Vedic astrology guide.

### Voice Attributes
- Calm intelligence, never dramatic or fear-inducing
- Personal: every response must feel written for THIS person with THIS chart
- Transparent: always cite which planet, house, dasha, or transit drives your guidance
- Grounded: practical takeaways, never fatalistic predictions
- Like a wise friend who understands their birth chart deeply

### Four-Layer Structure (scale to length)
1. **Simple Summary** — What this means for you, in plain language
2. **Explanation** — Why this is happening, with chart context
3. **Source/Reference** — Which chart factors and principles this draws from
4. **Practical Takeaway** — What to understand, notice, or do

### Anti-Patterns (NEVER do these)
- Never use generic horoscope language ("the stars say…", "the universe wants…")
- Never make fear-based statements about death, serious illness, or catastrophe
- Never give financial/medical/legal advice — frame as "your chart suggests awareness around…"
- Never output content that could apply to anyone — always personalize with chart specifics
- Never say "I don't have your chart" — you always have access to tools to compute it
- Never pad responses with filler — every sentence must carry meaning

### Personalization Rules
- Always reference the user's specific dasha period (Mahadasha/Antardasha)
- Always reference relevant transits for the current date
- Use the user's name naturally (not in every sentence)
- Connect current guidance to their larger life narrative/chapter
- Minimum personalization: 1 dasha reference + 1 transit reference + 1 house/sign reference per response
`

/** Build a word-limit guide for the detected vertical */
function getWordGuide(vertical: string): string {
  // Map vertical → typical response length
  const mapping: Record<string, string> = {
    astrology: "medium",
    numerology: "medium",
    tarot: "medium",
    vastu: "medium",
    general: "short",
  }
  const key = mapping[vertical] || "medium"
  const c = CHAT_CONSTRAINTS[key]
  return `\n\n## Word Limit: Aim for ${c.min}–${c.max} words (${c.label}). Be concise but thorough. Never pad.\n`
}

/* ────────────────────────────────────────────────────
   VERTICAL ROUTING — CEO Orchestrator logic
   ──────────────────────────────────────────────────── */
function detectVertical(message: string, requestedVertical: string): string {
  if (requestedVertical && requestedVertical !== "general") return requestedVertical

  const lower = message.toLowerCase()

  if (/\b(kundli|kundali|horoscope|planet|transit|dasha|nakshatra|rashi|zodiac|birth chart|ascendant|lagna|graha|mahadasha|antardasha|yoga|dosha|mangal|saturn|jupiter|rahu|ketu|sun sign|moon sign)\b/.test(lower))
    return "astrology"

  if (/\b(numerology|life path|destiny number|soul urge|karmic|name number|lucky number|pythagorean|chaldean|vibration|birth number)\b/.test(lower))
    return "numerology"

  if (/\b(tarot|card reading|spread|major arcana|minor arcana|celtic cross|three card|tower card|fool card|magician card|empress card|wands|cups|swords|pentacles)\b/.test(lower))
    return "tarot"

  if (/\b(vastu|direction|entrance.*facing|bedroom placement|kitchen vastu|office placement|five elements|pancha bhuta|space harmony)\b/.test(lower))
    return "vastu"

  return "general"
}

/* ────────────────────────────────────────────────────
   TOOL FORMAT CONVERSION — Anthropic → OpenAI function-calling
   ──────────────────────────────────────────────────── */
interface AnthropicTool {
  name: string
  description?: string
  input_schema?: Record<string, unknown>
}

interface OpenAIFunction {
  type: "function"
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

function convertToolsToOpenAI(tools: AnthropicTool[]): OpenAIFunction[] {
  return tools.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description || "",
      parameters: t.input_schema || { type: "object", properties: {} },
    },
  }))
}

/* ────────────────────────────────────────────────────
   MINIMAX API HELPERS
   ──────────────────────────────────────────────────── */

interface MiniMaxMessage {
  role: "system" | "user" | "assistant" | "tool"
  content?: string
  tool_calls?: Array<{
    id: string
    type: "function"
    function: { name: string; arguments: string }
  }>
  tool_call_id?: string
  name?: string
}

/** Non-streaming call — used for tool-use rounds */
async function callMiniMaxSync(
  messages: MiniMaxMessage[],
  tools?: OpenAIFunction[],
): Promise<{
  content: string | null
  tool_calls: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }> | null
  finish_reason: string
}> {
  const body: Record<string, unknown> = {
    model: MINIMAX_MODEL,
    max_tokens: 4096,
    messages,
  }
  if (tools && tools.length > 0) {
    body.tools = tools
    body.tool_choice = "auto"
  }

  const res = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`MiniMax API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const choice = data.choices?.[0]
  return {
    content: choice?.message?.content || null,
    tool_calls: choice?.message?.tool_calls || null,
    finish_reason: choice?.finish_reason || "stop",
  }
}

/* ────────────────────────────────────────────────────
   SSE HELPERS
   ──────────────────────────────────────────────────── */
function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

/* ────────────────────────────────────────────────────
   STREAMING CHAT API — Tool-use + Memory + Metrics
   ──────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    if (!MINIMAX_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured. Please contact support." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    }

    const body = await req.json()
    const { message, conversation_id, vertical: requestedVertical, user_id: bodyUserId } = body

    if (!message) {
      return new Response(JSON.stringify({ error: "Missing message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const sb = getSupabaseFromRequest(req)

    // SECURITY: Verify auth session — don't trust user_id from body
    let user_id = bodyUserId
    try {
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        user_id = user.id // Use verified user ID from session
      }
    } catch {}
    // Allow anonymous-onboarding and body user_id as fallback for unauthenticated users
    if (!user_id) user_id = "anonymous"

    // 1. Detect vertical
    const vertical = detectVertical(message, requestedVertical)
    const agentName = getAgentNameForVertical(vertical)

    // 1a. Anonymous onboarding check
    const isAnonymous = user_id === "anonymous-onboarding"

    // 1b. Usage limit check
    let usageCheck: { allowed: boolean; shouldTruncate?: boolean; truncateMessage?: string; message?: string; tier?: string; limit?: number } = { allowed: true }
    if (!isAnonymous) {
      usageCheck = await checkUsage(user_id, vertical)
      if (!usageCheck.allowed) {
        return new Response(JSON.stringify({
          error: "daily_limit_reached",
          message: usageCheck.message,
          tier: usageCheck.tier,
          limit: usageCheck.limit,
          upgradeNeeded: true,
        }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    // 1c. Detect sub-agent
    const subAgentRoute = detectSubAgent(vertical, message)
    const activeSubAgent = subAgentRoute?.displayName || null

    // 2. Load system prompt + memory + sub-agent augment
    const [systemPrompt, memoryContext, subAgentAugment] = await Promise.all([
      getActivePrompt(vertical),
      getRelevantMemories(user_id, vertical),
      subAgentRoute ? getSubAgentPromptAugment(vertical, subAgentRoute) : Promise.resolve(""),
    ])

    const wordGuide = getWordGuide(vertical)
    const fullSystemPrompt = systemPrompt + subAgentAugment + GRAHAI_TONE_RULES + wordGuide + memoryContext

    // 3. Create or get conversation
    let convId = conversation_id
    if (!convId) {
      const { data: conv, error: convErr } = await sb
        .from("conversations")
        .insert({
          user_id,
          agent_name: "ceo_orchestrator",
          department: vertical,
          vertical,
          status: "active",
          metadata: { started_at: new Date().toISOString() },
        })
        .select("id")
        .single()

      if (convErr) {
        console.error("Conv create error:", convErr)
        return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      }
      convId = conv.id
    }

    // 4. Save user message
    await sb.from("messages").insert({
      conversation_id: convId,
      role: "user",
      content: message,
      agent_name: null,
      metadata: { vertical },
    })

    // 5. Fetch conversation history
    const { data: history } = await sb
      .from("messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(20)

    // Build MiniMax message array (OpenAI format)
    const chatMessages: MiniMaxMessage[] = [
      { role: "system", content: fullSystemPrompt },
    ]

    for (const msg of (history || []).slice(-18)) {
      if (msg.role === "user" || msg.role === "assistant") {
        chatMessages.push({ role: msg.role as "user" | "assistant", content: msg.content })
      }
    }
    // Ensure current message is included
    const lastMsg = chatMessages[chatMessages.length - 1]
    if (!lastMsg || lastMsg.role !== "user" || lastMsg.content !== message) {
      chatMessages.push({ role: "user", content: message })
    }

    // 6. Get tools for this vertical (convert to OpenAI format)
    const anthropicTools = getToolsForVertical(vertical)
    const openaiTools = convertToolsToOpenAI(anthropicTools)

    // 7. Auto-extract birth data (fire-and-forget)
    extractAndSaveBirthData(user_id, message, vertical).catch(() => {})

    // 8. Increment prompt interactions (fire-and-forget)
    incrementPromptInteractions(agentName).catch(() => {})

    // 9. Create SSE stream
    const encoder = new TextEncoder()
    let fullResponseText = ""
    const toolsExecuted: string[] = []
    let success = true
    const shouldTruncate = usageCheck.shouldTruncate || false
    const TRUNCATE_LIMIT = 800

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata
          controller.enqueue(
            encoder.encode(
              sseEvent("meta", {
                conversation_id: convId,
                vertical,
                agent_name: agentName,
                sub_agent: activeSubAgent,
                shouldTruncate: usageCheck.shouldTruncate,
                truncateMessage: usageCheck.truncateMessage,
              })
            )
          )

          // Log delegation if sub-agent was selected
          if (subAgentRoute) {
            logDelegation(convId, agentName, subAgentRoute.displayName, vertical, message).catch(() => {})
          }

          // ─── Tool-use loop ─────────────────────────────────
          let currentMessages = [...chatMessages]
          let continueLoop = true
          const MAX_TOOL_ROUNDS = 5

          for (let round = 0; round < MAX_TOOL_ROUNDS && continueLoop; round++) {
            // Use sync call (handles both text and tool_calls)
            const result = await callMiniMaxSync(
              currentMessages,
              openaiTools.length > 0 ? openaiTools : undefined,
            )

            // Handle tool calls
            if (result.tool_calls && result.tool_calls.length > 0) {
              // Append assistant message with tool_calls to history
              currentMessages.push({
                role: "assistant",
                content: result.content || "",
                tool_calls: result.tool_calls,
              })

              // Execute each tool call
              for (const tc of result.tool_calls) {
                const toolName = tc.function.name
                let toolArgs: Record<string, unknown> = {}
                try {
                  toolArgs = JSON.parse(tc.function.arguments || "{}")
                } catch {
                  toolArgs = {}
                }

                // Notify client
                const toolInfo = TOOL_DISPLAY_INFO[toolName] || {
                  label: toolName,
                  icon: "⚙️",
                  description: `Executing ${toolName}...`,
                }
                controller.enqueue(
                  encoder.encode(sseEvent("tool_start", { tool_name: toolName, tool_id: tc.id, ...toolInfo }))
                )

                // Execute tool server-side
                const toolResult = await executeToolCall(toolName, toolArgs, user_id)
                toolsExecuted.push(toolName)

                controller.enqueue(
                  encoder.encode(
                    sseEvent("tool_result", {
                      tool_name: toolName,
                      tool_id: tc.id,
                      success: !(toolResult as { error?: string }).error,
                    })
                  )
                )

                // Feed tool result back (OpenAI format)
                currentMessages.push({
                  role: "tool",
                  tool_call_id: tc.id,
                  name: toolName,
                  content: JSON.stringify(toolResult),
                })
              }

              // Continue loop — model needs to process tool results
              continueLoop = true
            } else {
              // Pure text response — stream it to the client
              let text = result.content || ""

              // Apply truncation if needed
              if (shouldTruncate && fullResponseText.length + text.length > TRUNCATE_LIMIT) {
                const remaining = Math.max(0, TRUNCATE_LIMIT - fullResponseText.length)
                text = text.slice(0, remaining)
              }

              fullResponseText += text

              // Stream in ~50 char chunks for typewriter effect
              const chunkSize = 50
              for (let i = 0; i < text.length; i += chunkSize) {
                const chunk = text.slice(i, i + chunkSize)
                controller.enqueue(encoder.encode(sseEvent("text_delta", { text: chunk })))
              }

              // If truncated, append upgrade notice
              if (shouldTruncate && fullResponseText.length >= TRUNCATE_LIMIT) {
                const notice = `\n\n✨ *Upgrade to see the full analysis...*`
                fullResponseText += notice
                for (let i = 0; i < notice.length; i += chunkSize) {
                  const chunk = notice.slice(i, i + chunkSize)
                  controller.enqueue(encoder.encode(sseEvent("text_delta", { text: chunk })))
                }
              }

              continueLoop = false
            }
          }

          // Send completion event
          controller.enqueue(
            encoder.encode(
              sseEvent("message_stop", {
                conversation_id: convId,
                agent_name: agentName,
                sub_agent: activeSubAgent,
                vertical,
                tools_used: toolsExecuted,
              })
            )
          )

          // 10. Save assistant response to DB
          try {
            await sb.from("messages").insert({
              conversation_id: convId,
              role: "assistant",
              content: fullResponseText,
              agent_name: agentName,
              metadata: {
                vertical,
                sub_agent: activeSubAgent,
                model: MINIMAX_MODEL,
                tools_used: toolsExecuted,
                response_time_ms: Date.now() - startTime,
              },
            })
          } catch (saveErr) {
            console.warn("Failed to save assistant message:", saveErr)
          }

          // 11. Track metrics (fire-and-forget)
          trackAgentMetrics(agentName, vertical, Date.now() - startTime, success).catch(() => {})
          if (subAgentRoute) {
            trackAgentMetrics(subAgentRoute.displayName, vertical, Date.now() - startTime, success).catch(() => {})
          }

          // 12. Increment daily usage counter (skip anonymous)
          if (!isAnonymous) {
            incrementUsage(user_id, vertical).catch(() => {})
          }

          controller.close()
        } catch (err) {
          success = false
          console.error("Stream error:", err)

          controller.enqueue(
            encoder.encode(
              sseEvent("error", {
                message: "An error occurred while generating the response. Please try again.",
              })
            )
          )

          trackAgentMetrics(agentName, vertical, Date.now() - startTime, false).catch(() => {})
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Agent-Name": agentName,
        "X-Vertical": vertical,
      },
    })
  } catch (err) {
    console.error("Chat API error:", err)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
