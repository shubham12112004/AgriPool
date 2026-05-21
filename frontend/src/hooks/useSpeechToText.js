import { useState, useRef, useCallback } from 'react'
import { useLanguage } from './useLanguage'
import toast from 'react-hot-toast'

const SPEECH_LANGS = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
}

export function useSpeechToText(onTranscript) {
  const [isListening, setIsListening] = useState(false)
  const { language } = useLanguage()
  const recognitionRef = useRef(null)

  const toggleListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser.')
      return
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = SPEECH_LANGS[language] || 'en-IN'
      recognition.interimResults = false
      recognition.continuous = false

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript || ''
        if (transcript && onTranscript) {
          onTranscript(transcript)
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (event.error !== 'aborted') {
          toast.error(`Mic error: ${event.error}`)
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
      setIsListening(true)
    } catch (err) {
      console.error('Failed to start speech recognition:', err)
      toast.error('Could not start voice recognition.')
      setIsListening(false)
    }
  }, [isListening, language, onTranscript])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  return {
    isListening,
    toggleListening,
    stopListening,
  }
}
