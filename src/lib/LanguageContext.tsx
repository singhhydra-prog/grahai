"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { type Language, type Translations, getTranslations, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from "./i18n"

interface LanguageContextValue {
  lang: Language
  t: Translations
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANGUAGE,
  t: getTranslations(DEFAULT_LANGUAGE),
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANGUAGE)
  const [t, setT] = useState<Translations>(getTranslations(DEFAULT_LANGUAGE))

  // Load saved language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null
      if (saved) {
        setLangState(saved)
        setT(getTranslations(saved))
      }
    } catch {}
  }, [])

  const setLanguage = useCallback((newLang: Language) => {
    setLangState(newLang)
    setT(getTranslations(newLang))
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang)
    } catch {}
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
