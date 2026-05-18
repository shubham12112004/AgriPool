import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Tabs = ({ defaultTab = 0, tabs = [], children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  return (
    <div>
      <div className="flex border-b border-neutral-200 dark:border-dark-border gap-2 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-3 font-medium text-sm transition-all relative whitespace-nowrap ${
              activeTab === idx
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            {tab.label}
            {activeTab === idx && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
              />
            )}
          </button>
        ))}
      </div>
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-4"
      >
        {tabs[activeTab]?.content}
      </motion.div>
    </div>
  )
}

export default Tabs
