import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2, ArrowLeft, ExternalLink } from 'lucide-react'
import PageHeader from '../components/shared/PageHeader'
import EmptyState from '../components/shared/EmptyState'
import { Card, Button } from '../components/ui'
import toast from 'react-hot-toast'

export default function SavedPage() {
  const [saved, setSaved] = useState([])

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('agripool_favorites') || '[]')
    setSaved(list)
  }, [])

  const handleRemove = (e, id, type) => {
    e.preventDefault()
    e.stopPropagation()
    const next = saved.filter(f => !(f.id === id && f.type === type))
    setSaved(next)
    localStorage.setItem('agripool_favorites', JSON.stringify(next))
    toast.success('Removed from saved items')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 text-agri-blue hover:text-agri-cyan hover:translate-x-[-4px]"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <PageHeader title="Saved Items" subtitle="Manage your bookmarked equipment and marketplace crops" />

      {saved.length === 0 ? (
        <EmptyState 
          icon={Heart} 
          title="Nothing saved yet" 
          description="Browse the marketplace or equipment page and click the heart icon to save items." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {saved.map((item) => {
              const detailUrl = item.type === 'Equipment' ? `/equipment/${item.id}` : `/marketplace/${item.id}`
              return (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <Link to={detailUrl} className="block h-full">
                    <Card hoverable className="p-5 flex flex-col justify-between h-full relative group">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                            {item.type}
                          </span>
                          <button
                            onClick={(e) => handleRemove(e, item.id, item.type)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                            title="Remove from saved"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <h3 className="font-bold text-lg mt-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex items-center gap-1.5">
                          {item.title}
                          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" />
                        </h3>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-dark-border">
                        <span className="text-lg font-extrabold text-neutral-800 dark:text-neutral-200">
                          {item.price}
                        </span>
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:underline">
                          View details
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
