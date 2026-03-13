/* ════════════════════════════════════════════════════════
   GrahAI — Web Push Sender Utility

   Handles actual push notification delivery via web-push library.
   Manages subscription validation, expired subscription cleanup,
   and batch sending with concurrency control.
   ════════════════════════════════════════════════════════ */

import webpush from "web-push"
import { createClient } from "@supabase/supabase-js"

// ─── Types ──────────────────────────────────────────────

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface PushPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  url?: string
  tag?: string
}

export interface SendResult {
  sent: number
  failed: number
  expired: number
  errors: Array<{ endpoint: string; error: string }>
}

// ─── Configure web-push ─────────────────────────────────

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const email = process.env.VAPID_EMAIL || "admin@grahai.vercel.app"

  if (!publicKey || !privateKey) {
    console.warn("VAPID keys not configured — push notifications disabled")
    return false
  }

  try {
    webpush.setVapidDetails(email, publicKey, privateKey)
    return true
  } catch (err) {
    console.error("Failed to configure web-push:", err)
    return false
  }
}

// ─── Initialize on module load ──────────────────────────

const webPushConfigured = configureWebPush()

// ─── Send Single Push ───────────────────────────────────

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushPayload
): Promise<boolean> {
  if (!webPushConfigured) {
    console.warn("Web push not configured — skipping send")
    return false
  }

  try {
    const notificationPayload = {
      title: payload.title,
      body: payload.body,
      icon: payload.icon || "/icon-192x192.png",
      badge: payload.badge || "/badge-72x72.png",
      tag: payload.tag || "grahai",
      data: {
        url: payload.url || "/app",
      },
    }

    await webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
    return true
  } catch (error: any) {
    // Check if subscription is expired (410 Gone)
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log(`Subscription expired: ${subscription.endpoint}`)
      // Will be cleaned up by caller
      return false
    }

    console.error(`Push send error for ${subscription.endpoint}:`, error.message)
    return false
  }
}

// ─── Send Batch with Concurrency Control ────────────────

export async function sendBatchPush(
  subscriptions: Array<{ id?: string; endpoint: string; keys: { p256dh: string; auth: string }; user_id?: string }>,
  payload: PushPayload,
  options: {
    concurrency?: number
    onProgress?: (sent: number, failed: number, total: number) => void
    removeExpired?: boolean
  } = {}
): Promise<SendResult> {
  const { concurrency = 5, onProgress, removeExpired = true } = options

  if (!webPushConfigured) {
    console.warn("Web push not configured — batch send skipped")
    return { sent: 0, failed: 0, expired: 0, errors: [] }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let sent = 0
  let failed = 0
  let expired = 0
  const expiredEndpoints: string[] = []
  const errors: Array<{ endpoint: string; error: string }> = []

  // Process in batches with concurrency limit
  for (let i = 0; i < subscriptions.length; i += concurrency) {
    const batch = subscriptions.slice(i, i + concurrency)

    const promises = batch.map(async (sub) => {
      try {
        const notificationPayload = {
          title: payload.title,
          body: payload.body,
          icon: payload.icon || "/icon-192x192.png",
          badge: payload.badge || "/badge-72x72.png",
          tag: payload.tag || "grahai",
          data: {
            url: payload.url || "/app",
          },
        }

        await webpush.sendNotification(sub, JSON.stringify(notificationPayload))
        sent++
      } catch (error: any) {
        // Check for expired subscription
        if (error.statusCode === 410 || error.statusCode === 404) {
          expired++
          expiredEndpoints.push(sub.endpoint)
        } else {
          failed++
          errors.push({
            endpoint: sub.endpoint,
            error: error.message || String(error),
          })
        }
      }
    })

    await Promise.all(promises)
    onProgress?.(sent, failed, subscriptions.length)
  }

  // Clean up expired subscriptions
  if (removeExpired && expiredEndpoints.length > 0) {
    try {
      await supabase
        .from("push_subscriptions")
        .delete()
        .in("endpoint", expiredEndpoints)
    } catch (err) {
      console.error("Failed to clean up expired subscriptions:", err)
    }
  }

  return { sent, failed, expired, errors }
}

// ─── Get Supabase Admin Client ──────────────────────────

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
