import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Card } from '../ui'
import { useTheme } from '../../hooks/useTheme'

export default function TestimonialsCarousel({ testimonials }) {
  const { isDark } = useTheme()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const t = testimonials[index]

  return (
    <div className="relative max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35 }}
        >
          <Card variant="glass" className="p-8 md:p-10 text-center shadow-premium">
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className={`text-lg md:text-xl leading-relaxed mb-8 ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">{t.image}</span>
              <div className="text-left">
                <p className="font-semibold text-lg">{t.name}</p>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.role}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
          className={`p-2 rounded-full border transition-colors ${
            isDark ? 'border-dark-border hover:bg-dark-card' : 'border-neutral-200 hover:bg-white shadow-sm'
          }`}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-primary-500' : 'w-2 bg-neutral-300 dark:bg-neutral-600'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
          className={`p-2 rounded-full border transition-colors ${
            isDark ? 'border-dark-border hover:bg-dark-card' : 'border-neutral-200 hover:bg-white shadow-sm'
          }`}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
