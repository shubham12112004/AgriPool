import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
]

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false)
  const { isDark } = useTheme()
  const { language, setLanguage } = useLanguage()
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode)
    setOpen(false)
  }

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 ${
          isDark ? 'hover:bg-dark-border text-neutral-300' : 'hover:bg-neutral-100 text-slate-700'
        }`}
        aria-label="Select Language"
        title="Select Language"
      >
        <Globe size={20} />
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide">
          {currentLang.code}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border py-2 z-50 overflow-hidden ${
              isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200'
            }`}
          >
            <div className={`px-4 py-2 border-b mb-1 ${isDark ? 'border-dark-border' : 'border-neutral-100'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Language
              </p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const isActive = language === lang.code
                return (
                  <motion.button
                    key={lang.code}
                    type="button"
                    whileHover={{ x: 2 }}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${
                      isActive
                        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                        : isDark
                          ? 'text-neutral-300 hover:bg-dark-border hover:text-white'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                    }`}
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{lang.native}</div>
                      <div className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {lang.name}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-primary-500"
                      >
                        <Check size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
