/* ═══════════════════════════════════════════════════════
   GrahAI Service Worker — Cosmic Cache Engine
   Offline-first strategy for Tier 2 India market
   ═══════════════════════════════════════════════════════ */

const CACHE_NAME = 'grahai-v1'
const STATIC_CACHE = 'grahai-static-v1'
const DYNAMIC_CACHE = 'grahai-dynamic-v1'
const IMAGE_CACHE = 'grahai-images-v1'

// Core shell — always cached
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.svg',
  '/offline',
]

// ─── INSTALL ─────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// ─── ACTIVATE ────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
          .map((key) => {
            console.log('[SW] Removing old cache:', key)
            return caches.delete(key)
          })
      )
    )
  )
  self.clients.claim()
})

// ─── FETCH STRATEGY ──────────────────────────────────
// Network-first for API calls, Cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return
  if (url.protocol === 'chrome-extension:') return

  // API calls → Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    return
  }

  // Images → Cache first (stale-while-revalidate)
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE))
    return
  }

  // Fonts → Cache first (long-lived)
  if (
    request.destination === 'font' ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Everything else → Stale while revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
})

// ─── STRATEGIES ──────────────────────────────────────

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch {
    const cached = await caches.match(request)
    return cached || offlineFallback()
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch {
    return offlineFallback()
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(cacheName)
        cache.then((c) => c.put(request, networkResponse.clone()))
      }
      return networkResponse
    })
    .catch(() => cached || offlineFallback())

  return cached || fetchPromise
}

function offlineFallback() {
  return caches.match('/offline') || new Response('Offline — कृपया इंटरनेट कनेक्ट करें', {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

// ─── BACKGROUND SYNC ─────────────────────────────────
// Queue failed requests for retry when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-readings') {
    event.waitUntil(syncReadings())
  }
})

async function syncReadings() {
  // Retry any queued reading requests
  console.log('[SW] Syncing queued readings...')
}

// ─── PUSH NOTIFICATIONS ─────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const options = {
    body: data.body || 'आज के ग्रह आपके पक्ष में हैं ✨',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Open Reading' },
      { action: 'dismiss', title: 'Later' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'GrahAI · ग्रह AI', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'dismiss') return

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})

// ─── CACHE SIZE MANAGEMENT ───────────────────────────
// Limit dynamic cache to 50 entries for low-storage devices
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length > maxItems) {
    await cache.delete(keys[0])
    return trimCache(cacheName, maxItems)
  }
}

// Trim caches periodically
self.addEventListener('message', (event) => {
  if (event.data === 'trimCaches') {
    trimCache(DYNAMIC_CACHE, 50)
    trimCache(IMAGE_CACHE, 30)
  }
})
