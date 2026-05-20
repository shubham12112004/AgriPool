import React, { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' }
]

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false)
  const { isDark } = useTheme()
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
    const selectEl = document.querySelector('.goog-te-combo')
    if (selectEl) {
      selectEl.value = langCode
      selectEl.dispatchEvent(new Event('change', { bubbles: true }))
    }
    setOpen(false)
  }

  return (
    <div className="relative notranslate" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-xl transition-colors flex items-center justify-center ${
          isDark ? 'hover:bg-dark-border text-neutral-300' : 'hover:bg-neutral-100 text-slate-700'
        }`}
        aria-label="Select Language"
        title="Select Language"
      >
        <Globe size={20} />
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-2 z-50 animate-in fade-in slide-in-from-top-2 ${
            isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200'
          }`}
        >
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {INDIAN_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  isDark
                    ? 'text-neutral-300 hover:bg-dark-border hover:text-white'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
