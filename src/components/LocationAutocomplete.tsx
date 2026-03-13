"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MapPin, ChevronDown } from "lucide-react"
import { searchCities, type CityEntry } from "@/lib/data/city-database"

export interface LocationSelection {
  city: string
  state?: string
  country: string
  lat: number
  lng: number
  tz: number
  tzName: string
  displayLabel: string   // "City, State, Country" or "City, Country"
}

interface Props {
  value: string
  onChange: (text: string) => void
  onSelect: (location: LocationSelection) => void
  placeholder?: string
  /** Extra tailwind classes for the outer wrapper */
  className?: string
  /** Input field class overrides */
  inputClassName?: string
  /** Show the MapPin icon */
  showIcon?: boolean
  /** Label text (rendered above input) */
  label?: string
  /** Label class overrides */
  labelClassName?: string
}

export default function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "e.g. Mumbai, Delhi, New York",
  className = "",
  inputClassName = "",
  showIcon = true,
  label,
  labelClassName = "",
}: Props) {
  const [suggestions, setSuggestions] = useState<CityEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Search as user types
  const handleInput = useCallback(
    (text: string) => {
      onChange(text)
      const results = searchCities(text, 8)
      setSuggestions(results)
      setIsOpen(results.length > 0)
      setHighlightIndex(-1)
    },
    [onChange],
  )

  // Select a city from dropdown
  const selectCity = useCallback(
    (city: CityEntry) => {
      const displayLabel = city.state
        ? `${city.city}, ${city.state}, ${city.country}`
        : `${city.city}, ${city.country}`

      onChange(displayLabel)
      onSelect({
        city: city.city,
        state: city.state,
        country: city.country,
        lat: city.lat,
        lng: city.lng,
        tz: city.tz,
        tzName: city.tzName,
        displayLabel,
      })
      setIsOpen(false)
      setSuggestions([])
    },
    [onChange, onSelect],
  )

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1))
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault()
      selectCity(suggestions[highlightIndex])
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const defaultInputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none transition-colors"

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {label && (
        <label
          className={
            labelClassName ||
            "block text-xs text-white/40 mb-1.5 uppercase tracking-wider"
          }
        >
          {showIcon && <MapPin className="inline w-3 h-3 mr-1" />}
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (value.length >= 2) {
              const results = searchCities(value, 8)
              setSuggestions(results)
              setIsOpen(results.length > 0)
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClassName || defaultInputClass}
        />
        {isOpen && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-white/[0.1] bg-[#0C1224] shadow-2xl shadow-black/50 backdrop-blur-xl">
          {suggestions.map((city, idx) => {
            const label = city.state
              ? `${city.city}, ${city.state}`
              : city.city
            const isHighlighted = idx === highlightIndex

            return (
              <button
                key={`${city.city}-${city.state}-${city.country}-${idx}`}
                type="button"
                onClick={() => selectCity(city)}
                onMouseEnter={() => setHighlightIndex(idx)}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-colors ${
                  isHighlighted
                    ? "bg-amber-500/10 text-amber-300"
                    : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-500/50" />
                  <span className="truncate font-medium">{label}</span>
                </span>
                <span className="shrink-0 text-[11px] text-white/30">
                  {city.country}
                </span>
              </button>
            )
          })}
          <div className="px-4 py-1.5 text-[10px] text-white/20 border-t border-white/[0.05]">
            {suggestions.length} result{suggestions.length !== 1 ? "s" : ""} — type more to refine
          </div>
        </div>
      )}
    </div>
  )
}
