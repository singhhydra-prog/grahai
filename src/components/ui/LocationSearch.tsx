"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MapPin, Search, X } from "lucide-react"

export interface CityData {
  name: string
  state?: string
  country: string
  lat: number
  lng: number
  tz: string // IANA timezone
}

// Major Indian cities + key world cities with lat/lng/tz
const CITIES: CityData[] = [
  // ─── Top Indian Cities ───
  { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.076, lng: 72.8777, tz: "Asia/Kolkata" },
  { name: "Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.209, tz: "Asia/Kolkata" },
  { name: "Bangalore", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946, tz: "Asia/Kolkata" },
  { name: "Hyderabad", state: "Telangana", country: "India", lat: 17.385, lng: 78.4867, tz: "Asia/Kolkata" },
  { name: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lng: 80.2707, tz: "Asia/Kolkata" },
  { name: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lng: 88.3639, tz: "Asia/Kolkata" },
  { name: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lng: 73.8567, tz: "Asia/Kolkata" },
  { name: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.0225, lng: 72.5714, tz: "Asia/Kolkata" },
  { name: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lng: 75.7873, tz: "Asia/Kolkata" },
  { name: "Lucknow", state: "Uttar Pradesh", country: "India", lat: 26.8467, lng: 80.9462, tz: "Asia/Kolkata" },
  { name: "Surat", state: "Gujarat", country: "India", lat: 21.1702, lng: 72.8311, tz: "Asia/Kolkata" },
  { name: "Kanpur", state: "Uttar Pradesh", country: "India", lat: 26.4499, lng: 80.3319, tz: "Asia/Kolkata" },
  { name: "Nagpur", state: "Maharashtra", country: "India", lat: 21.1458, lng: 79.0882, tz: "Asia/Kolkata" },
  { name: "Indore", state: "Madhya Pradesh", country: "India", lat: 22.7196, lng: 75.8577, tz: "Asia/Kolkata" },
  { name: "Bhopal", state: "Madhya Pradesh", country: "India", lat: 23.2599, lng: 77.4126, tz: "Asia/Kolkata" },
  { name: "Patna", state: "Bihar", country: "India", lat: 25.6093, lng: 85.1376, tz: "Asia/Kolkata" },
  { name: "Vadodara", state: "Gujarat", country: "India", lat: 22.3072, lng: 73.1812, tz: "Asia/Kolkata" },
  { name: "Ludhiana", state: "Punjab", country: "India", lat: 30.901, lng: 75.8573, tz: "Asia/Kolkata" },
  { name: "Agra", state: "Uttar Pradesh", country: "India", lat: 27.1767, lng: 78.0081, tz: "Asia/Kolkata" },
  { name: "Varanasi", state: "Uttar Pradesh", country: "India", lat: 25.3176, lng: 82.9739, tz: "Asia/Kolkata" },
  { name: "Chandigarh", state: "Chandigarh", country: "India", lat: 30.7333, lng: 76.7794, tz: "Asia/Kolkata" },
  { name: "Coimbatore", state: "Tamil Nadu", country: "India", lat: 11.0168, lng: 76.9558, tz: "Asia/Kolkata" },
  { name: "Madurai", state: "Tamil Nadu", country: "India", lat: 9.9252, lng: 78.1198, tz: "Asia/Kolkata" },
  { name: "Visakhapatnam", state: "Andhra Pradesh", country: "India", lat: 17.6868, lng: 83.2185, tz: "Asia/Kolkata" },
  { name: "Kochi", state: "Kerala", country: "India", lat: 9.9312, lng: 76.2673, tz: "Asia/Kolkata" },
  { name: "Thiruvananthapuram", state: "Kerala", country: "India", lat: 8.5241, lng: 76.9366, tz: "Asia/Kolkata" },
  { name: "Guwahati", state: "Assam", country: "India", lat: 26.1445, lng: 91.7362, tz: "Asia/Kolkata" },
  { name: "Ranchi", state: "Jharkhand", country: "India", lat: 23.3441, lng: 85.3096, tz: "Asia/Kolkata" },
  { name: "Dehradun", state: "Uttarakhand", country: "India", lat: 30.3165, lng: 78.0322, tz: "Asia/Kolkata" },
  { name: "Goa", state: "Goa", country: "India", lat: 15.2993, lng: 74.124, tz: "Asia/Kolkata" },
  { name: "Noida", state: "Uttar Pradesh", country: "India", lat: 28.5355, lng: 77.391, tz: "Asia/Kolkata" },
  { name: "Gurgaon", state: "Haryana", country: "India", lat: 28.4595, lng: 77.0266, tz: "Asia/Kolkata" },
  { name: "Faridabad", state: "Haryana", country: "India", lat: 28.4089, lng: 77.3178, tz: "Asia/Kolkata" },
  { name: "Mysore", state: "Karnataka", country: "India", lat: 12.2958, lng: 76.6394, tz: "Asia/Kolkata" },
  { name: "Mangalore", state: "Karnataka", country: "India", lat: 12.9141, lng: 74.856, tz: "Asia/Kolkata" },
  { name: "Jodhpur", state: "Rajasthan", country: "India", lat: 26.2389, lng: 73.0243, tz: "Asia/Kolkata" },
  { name: "Udaipur", state: "Rajasthan", country: "India", lat: 24.5854, lng: 73.7125, tz: "Asia/Kolkata" },
  { name: "Amritsar", state: "Punjab", country: "India", lat: 31.634, lng: 74.8723, tz: "Asia/Kolkata" },
  { name: "Nashik", state: "Maharashtra", country: "India", lat: 19.9975, lng: 73.7898, tz: "Asia/Kolkata" },
  { name: "Rajkot", state: "Gujarat", country: "India", lat: 22.3039, lng: 70.8022, tz: "Asia/Kolkata" },
  { name: "Raipur", state: "Chhattisgarh", country: "India", lat: 21.2514, lng: 81.6296, tz: "Asia/Kolkata" },
  { name: "Bhubaneswar", state: "Odisha", country: "India", lat: 20.2961, lng: 85.8245, tz: "Asia/Kolkata" },
  { name: "Shimla", state: "Himachal Pradesh", country: "India", lat: 31.1048, lng: 77.1734, tz: "Asia/Kolkata" },
  { name: "Srinagar", state: "J&K", country: "India", lat: 34.0837, lng: 74.7973, tz: "Asia/Kolkata" },
  { name: "Jammu", state: "J&K", country: "India", lat: 32.7266, lng: 74.857, tz: "Asia/Kolkata" },
  { name: "Allahabad", state: "Uttar Pradesh", country: "India", lat: 25.4358, lng: 81.8463, tz: "Asia/Kolkata" },
  { name: "Meerut", state: "Uttar Pradesh", country: "India", lat: 28.9845, lng: 77.7064, tz: "Asia/Kolkata" },
  { name: "Aurangabad", state: "Maharashtra", country: "India", lat: 19.8762, lng: 75.3433, tz: "Asia/Kolkata" },
  { name: "Thane", state: "Maharashtra", country: "India", lat: 19.2183, lng: 72.9781, tz: "Asia/Kolkata" },
  { name: "Navi Mumbai", state: "Maharashtra", country: "India", lat: 19.033, lng: 73.0297, tz: "Asia/Kolkata" },

  // ─── Major World Cities ───
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006, tz: "America/New_York" },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, tz: "America/Los_Angeles" },
  { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298, tz: "America/Chicago" },
  { name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194, tz: "America/Los_Angeles" },
  { name: "Houston", country: "USA", lat: 29.7604, lng: -95.3698, tz: "America/Chicago" },
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, tz: "Europe/London" },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, tz: "Asia/Dubai" },
  { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773, tz: "Asia/Dubai" },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, tz: "Asia/Singapore" },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, tz: "America/Toronto" },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, tz: "Australia/Sydney" },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, tz: "Australia/Melbourne" },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869, tz: "Asia/Kuala_Lumpur" },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, tz: "Asia/Bangkok" },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, tz: "Asia/Tokyo" },
  { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694, tz: "Asia/Hong_Kong" },
  { name: "Kathmandu", country: "Nepal", lat: 27.7172, lng: 85.324, tz: "Asia/Kathmandu" },
  { name: "Colombo", country: "Sri Lanka", lat: 6.9271, lng: 79.8612, tz: "Asia/Colombo" },
  { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125, tz: "Asia/Dhaka" },
  { name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, tz: "Asia/Karachi" },
  { name: "Lahore", country: "Pakistan", lat: 31.5204, lng: 74.3587, tz: "Asia/Karachi" },
  { name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531, tz: "Asia/Qatar" },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, tz: "Asia/Riyadh" },
  { name: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829, tz: "Asia/Muscat" },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, tz: "Europe/Berlin" },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, tz: "Europe/Paris" },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, tz: "Europe/Amsterdam" },
  { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, tz: "Africa/Nairobi" },
]

interface LocationSearchProps {
  value: string
  onChange: (value: string, city?: CityData) => void
  placeholder?: string
}

export default function LocationSearch({ value, onChange, placeholder = "Search city..." }: LocationSearchProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<CityData[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Search logic
  const search = useCallback((q: string) => {
    if (q.length < 1) {
      setResults([])
      return
    }
    const lower = q.toLowerCase()
    const matched = CITIES.filter(
      (c) =>
        c.name.toLowerCase().startsWith(lower) ||
        c.name.toLowerCase().includes(lower) ||
        (c.state && c.state.toLowerCase().includes(lower)) ||
        c.country.toLowerCase().includes(lower)
    ).slice(0, 8)
    setResults(matched)
    setHighlighted(-1)
  }, [])

  useEffect(() => {
    search(query)
  }, [query, search])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selectCity = (city: CityData) => {
    const display = city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`
    setQuery(display)
    onChange(display, city)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlighted((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlighted((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && highlighted >= 0 && results[highlighted]) {
      e.preventDefault()
      selectCity(results[highlighted])
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6478]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            onChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            if (query.length >= 1) search(query)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[#0D1220] border border-[#1E293B] rounded-xl pl-10 pr-9 py-3
            text-[#F1F0F5] text-sm placeholder:text-[#5A6478]/50
            focus:border-[#D4A054]/40 focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              onChange("")
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
              bg-[#1E293B] flex items-center justify-center hover:bg-[#2A3450] transition-colors"
          >
            <X className="w-3 h-3 text-[#5A6478]" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1.5 bg-[#111827] border border-[#1E293B]
          rounded-xl overflow-hidden shadow-xl shadow-black/40 max-h-56 overflow-y-auto">
          {results.map((city, i) => (
            <button
              key={`${city.name}-${city.state || city.country}`}
              onClick={() => selectCity(city)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                ${i === highlighted ? "bg-[#D4A054]/10" : "hover:bg-white/[0.03]"}
                ${i > 0 ? "border-t border-[#1E293B]/50" : ""}`}
            >
              <MapPin className={`w-4 h-4 shrink-0 ${i === highlighted ? "text-[#D4A054]" : "text-[#5A6478]"}`} />
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${i === highlighted ? "text-[#D4A054]" : "text-[#F1F0F5]"}`}>
                  {city.name}
                </p>
                <p className="text-[11px] text-[#5A6478] truncate">
                  {city.state ? `${city.state}, ${city.country}` : city.country}
                </p>
              </div>
              <span className="ml-auto text-[10px] text-[#5A6478]/60 shrink-0">
                {city.lat.toFixed(1)}°, {city.lng.toFixed(1)}°
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No results hint */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1.5 bg-[#111827] border border-[#1E293B]
          rounded-xl px-4 py-3 shadow-xl shadow-black/40">
          <p className="text-xs text-[#5A6478] text-center">
            No match found. Type a city name manually.
          </p>
        </div>
      )}
    </div>
  )
}
