import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const Accordion = ({ items = [], allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState([0])
  
  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenItems(prev => 
        prev.includes(index) 
          ? []
          : [index]
      )
    }
  }
  
  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        const isOpen = openItems.includes(idx)
        
        return (
          <div 
            key={idx}
            className="border border-neutral-200 dark:border-dark-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(idx)}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-dark-card/50 transition-colors text-left"
            >
              <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                {item.title}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={20} className="text-neutral-500" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-neutral-200 dark:border-dark-border"
                >
                  <div className="p-4 text-neutral-600 dark:text-neutral-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
