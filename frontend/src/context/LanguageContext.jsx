import React, { createContext, useState, useEffect } from 'react'
import translations from '../locales/index'

export const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')

  useEffect(() => {
    localStorage.setItem('language', language)
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = language
  }, [language])

  const changeLanguage = (code) => setLanguage(code)

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language] || translations.en
    for (const k of keys) value = value?.[k]
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
