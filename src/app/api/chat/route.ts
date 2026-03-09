import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import Anthropic from "@anthropic-ai/sdk"
import type { MessageParam, ContentBlockParam } from "@anthropic-ai/sdk/resources/messages"

import { getActivePrompt, getAgentNameForVertical } from "@/lib/agents/prompt-loader"
import { getRelevantMemories, extractAndSaveBirthData } from "@/lib/agents/memory"
import { trackAgentMetrics, incrementPromptInteractions } from "@/lib/agents/metrics"
import { getToolsForVertical, executeToolCall, TOOL_DISPLAY_INFO } from "@/lib/agents/tools"
import { detectSubAgent, getSubAgentPromptAugment, logDelegation } from "@/lib/agents/delegation"

/* ────────────────────────────────────────────────────
   SUPABASE CLIENT — uses user's auth cookies for RLS
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

/* Fallback admin client for background tasks (metrics, etc.) */
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/* ────────────────────────────────────────────────────
   ANTHROPIC CLIENT
   ──────────────────────────────────────────────────── */
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

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
   SSE HELPERS — Stream events to the client
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
    const body = await req.json()
    const { message, conversation_id, vertical: requestedVertical, user_id } = body

    if (!message || !user_id) {
      return new Response(JSON.stringify({ error: "Missing message or user_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const sb = getSupabaseFromRequest(req)

    // 1. Detect vertical
    const vertical = detectVertical(message, requestedVertical)
    const agentName = getAgentNameForVertical(vertical)

    // 1b. Detect sub-agent within the vertical
    const subAgentRoute = detectSubAgent(vertical, message)
    const activeSubAgent = subAgentRoute?.displayName || null

    // 2. Load system prompt from DB (cached) + memory context + sub-agent augment
    const [systemPrompt, memoryContext, subAgentAugment] = await Promise.all([
      getActivePrompt(vertical),
      getRelevantMemories(user_id, vertical),
      subAgentRoute ? getSubAgentPromptAugment(vertical, subAgentRoute) : Promise.resolve(""),
    ])

    const fullSystemPrompt = systemPrompt + subAgentAugment + memoryContext

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

    // Build messages array
    const messages: MessageParam[] = []
    for (const msg of (history || []).slice(-18)) {
      if (msg.role === "user" || msg.role === "assistant") {
        messages.push({ role: msg.role as "user" | "assistant", content: msg.content })
      }
    }
    // Ensure current message is included
    if (messages.length === 0 || (messages[messages.length - 1] as { content: string }).content !== message) {
      messages.push({ role: "user", content: message })
    }
    // API requires first message to be user
    if (messages.length > 0 && messages[0].role !== "user") {
      messages.shift()
    }

    // 6. Get tools for this vertical
    const tools = getToolsForVertical(vertical)

    // 7. Auto-extract birth data (fire-and-forget)
    extractAndSaveBirthData(user_id, message, vertical).catch(() => {})

    // 8. Increment prompt interactions (fire-and-forget)
    incrementPromptInteractions(agentName).catch(() => {})

    // 9. Create SSE stream
    const encoder = new TextEncoder()
    let fullResponseText = ""
    let toolsExecuted: string[] = []
    let success = true

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata (includes sub-agent if delegated)
          controller.enqueue(
            encoder.encode(
              sseEvent("meta", {
                conversation_id: convId,
                vertical,
                agent_name: agentName,
                sub_agent: activeSubAgent,
              })
            )
          )

          // Log delegation if sub-agent was selected (fire-and-forget)
          if (subAgentRoute) {
            logDelegation(convId, agentName, subAgentRoute.displayName, vertical, message).catch(() => {})
          }

          // Anthropic API call with streaming
          let currentMessages = [...messages]
          let continueLoop = true

          while (continueLoop) {
            const apiParams: {
              model: string
              max_tokens: number
              system: string
              messages: MessageParam[]
              tools?: Anthropic.Messages.Tool[]
            } = {
              model: "claude-sonnet-4-20250514",
              max_tokens: 4096,
              system: fullSystemPrompt,
              messages: currentMessages,
            }

            // Only include tools if the vertical has them
            if (tools.length > 0) {
              apiParams.tools = tools
            }

            const response = await anthropic.messages.create(apiParams)

            // Process content blocks
            for (const block of response.content) {
              if (block.type === "text") {
                // Stream text in chunks for typewriter effect
                const text = block.text
                fullResponseText += text

                // Send in ~50 char chunks for smooth streaming
                const chunkSize = 50
                for (let i = 0; i < text.length; i += chunkSize) {
                  const chunk = text.slice(i, i + chunkSize)
                  controller.enqueue(encoder.encode(sseEvent("text_delta", { text: chunk })))
                }
              } else if (block.type === "tool_use") {
                // Tool use detected — notify client
                const toolInfo = TOOL_DISPLAY_INFO[block.name] || {
                  label: block.name,
                  icon: "⚙️",
                  description: `Executing ${block.name}...`,
                }

                controller.enqueue(
                  encoder.encode(
                    sseEvent("tool_start", {
                      tool_name: block.name,
                      tool_id: block.id,
                      ...toolInfo,
                    })
                  )
                )

                // Execute tool server-side
                const toolResult = await executeToolCall(
                  block.name,
                  block.input as Record<string, unknown>,
                  user_id
                )

                toolsExecuted.push(block.name)

                // Send tool result to client (summary)
                controller.enqueue(
                  encoder.encode(
                    sseEvent("tool_result", {
                      tool_name: block.name,
                      tool_id: block.id,
                      success: !(toolResult as { error?: string }).error,
                    })
                  )
                )

                // Feed tool result back to Claude for continuation
                currentMessages = [
                  ...currentMessages,
                  {
                    role: "assistant" as const,
                    content: response.content as ContentBlockParam[],
                  },
                  {
                    role: "user" as const,
                    content: [
                      {
                        type: "tool_result" as const,
                        tool_use_id: block.id,
                        content: JSON.stringify(toolResult),
                      },
                    ],
                  },
                ]
              }
            }

            // Check if we need to continue (tool_use requires another round)
            if (response.stop_reason === "tool_use") {
              // Continue the loop — Claude needs to process tool results
              continueLoop = true
            } else {
              // end_turn or max_tokens — we're done
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

          // 10. Save assistant response to DB (fire-and-forget style but awaited for reliability)
          try {
            await sb.from("messages").insert({
              conversation_id: convId,
              role: "assistant",
              content: fullResponseText,
              agent_name: agentName,
              metadata: {
                vertical,
                sub_agent: activeSubAgent,
                model: "claude-sonnet-4-20250514",
                tools_used: toolsExecuted,
                response_time_ms: Date.now() - startTime,
              },
            })
          } catch (saveErr) {
            console.warn("Failed to save assistant message:", saveErr)
          }

          // 11. Track metrics (fire-and-forget) — track both head agent and sub-agent
          trackAgentMetrics(agentName, vertical, Date.now() - startTime, success).catch(() => {})
          if (subAgentRoute) {
            trackAgentMetrics(subAgentRoute.displayName, vertical, Date.now() - startTime, success).catch(() => {})
          }

          controller.close()
        } catch (err) {
          success = false
          console.error("Stream error:", err)

          // Send error event
          controller.enqueue(
            encoder.encode(
              sseEvent("error", {
                message: "An error occurred while generating the response. Please try again.",
              })
            )
          )

          // Track failed metric
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
