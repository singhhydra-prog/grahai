/**
 * Shared timezone utility — converts IANA timezone strings to numeric UTC offsets.
 *
 * The BirthData type stores timezone as a string (IANA like "Asia/Kolkata"),
 * but the ephemeris engine expects numeric UTC offsets (e.g. 5.5).
 * This utility bridges the gap.
 */

const COMMON_TZ: Record<string, number> = {
  // India
  "Asia/Kolkata": 5.5, "Asia/Calcutta": 5.5, "Asia/Mumbai": 5.5,
  "Asia/Delhi": 5.5, "Asia/Colombo": 5.5,
  // Americas
  "America/New_York": -5, "America/Chicago": -6, "America/Denver": -7,
  "America/Los_Angeles": -8, "America/Anchorage": -9, "Pacific/Honolulu": -10,
  "America/Toronto": -5, "America/Vancouver": -8, "America/Mexico_City": -6,
  "America/Sao_Paulo": -3, "America/Argentina/Buenos_Aires": -3,
  "America/Bogota": -5, "America/Lima": -5,
  // Europe
  "Europe/London": 0, "Europe/Paris": 1, "Europe/Berlin": 1,
  "Europe/Moscow": 3, "Europe/Istanbul": 3, "Europe/Rome": 1,
  "Europe/Madrid": 1, "Europe/Amsterdam": 1, "Europe/Zurich": 1,
  // Middle East / Africa
  "Asia/Dubai": 4, "Asia/Riyadh": 3, "Asia/Tehran": 3.5,
  "Africa/Cairo": 2, "Africa/Johannesburg": 2, "Africa/Lagos": 1,
  // Asia-Pacific
  "Asia/Singapore": 8, "Asia/Hong_Kong": 8, "Asia/Shanghai": 8,
  "Asia/Tokyo": 9, "Asia/Seoul": 9, "Asia/Bangkok": 7,
  "Asia/Jakarta": 7, "Asia/Kuala_Lumpur": 8, "Asia/Karachi": 5,
  "Asia/Dhaka": 6, "Asia/Kathmandu": 5.75, "Asia/Yangon": 6.5,
  // Oceania
  "Australia/Sydney": 11, "Australia/Melbourne": 11, "Australia/Perth": 8,
  "Pacific/Auckland": 13, "Pacific/Fiji": 12,
}

/**
 * Resolve a timezone value (IANA string, numeric string, or number) to a numeric UTC offset.
 *
 * @param tz - The timezone value (can be IANA string, numeric string, or number)
 * @param birthDate - Optional birth date string for DST-aware conversion
 * @returns Numeric UTC offset in hours (e.g. 5.5 for IST, -5 for EST)
 */
export function resolveTimezoneOffset(tz: unknown, birthDate?: string): number {
  if (tz === null || tz === undefined) return 5.5 // Default IST

  // Already a number
  if (typeof tz === "number" && !isNaN(tz)) return tz

  const tzStr = String(tz).trim()
  if (!tzStr) return 5.5

  // Try parsing as a plain number first (e.g. "5.5", "-8")
  const asNum = parseFloat(tzStr)
  if (!isNaN(asNum) && /^-?\d+(\.\d+)?$/.test(tzStr)) return asNum

  // IANA timezone string → compute offset using date math
  try {
    const refDate = birthDate ? new Date(birthDate + "T12:00:00") : new Date()
    const utcStr = refDate.toLocaleString("en-US", { timeZone: "UTC" })
    const localStr = refDate.toLocaleString("en-US", { timeZone: tzStr })
    const diffMs = new Date(localStr).getTime() - new Date(utcStr).getTime()
    const hours = diffMs / (1000 * 60 * 60)
    if (!isNaN(hours)) return hours
  } catch {
    // Not a valid IANA timezone — fall through to lookup
  }

  // Fallback: common IANA → offset lookup
  if (COMMON_TZ[tzStr] !== undefined) return COMMON_TZ[tzStr]

  return 5.5 // Default to IST if nothing works
}
