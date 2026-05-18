import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../../components/shared/PageHeader'
import StatCard from '../../components/shared/StatCard'
import { Card, Select } from '../../components/ui'
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react'
import toast from 'react-hot-toast'
import analyticsService from '../../services/analyticsService'

export default function AdminAnalytics() {
    const [period, setPeriod] = useState('30')
    const [chartData, setChartData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      loadAnalytics()
    }, [period])

    const loadAnalytics = async () => {
      setLoading(true)
      try {
        const data = await analyticsService.getRevenueChart(period)
        
        // Format data for display
        const formattedData = data.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: item.revenue,
          bookings: item.bookings,
        }))
        
        setChartData(formattedData)
      } catch (err) {
        console.error('Analytics error:', err)
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    const maxRevenue = chartData ? Math.max(...chartData.map(d => d.revenue)) : 50000
    const chartHeight = 200
    const chartWidth = 500
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const innerWidth = chartWidth - padding.left - padding.right
    const innerHeight = chartHeight - padding.top - padding.bottom
    const pointSpacing = innerWidth / Math.max(chartData?.length - 1 || 1, 1)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Platform analytics" subtitle="Revenue, growth, and activity" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="MAU" value="12.4K" icon={Users} trend="+8%" />
        <StatCard label="GMV" value="₹2.4M" icon={DollarSign} trend="+22%" />
        <StatCard label="Bookings" value="8,420" icon={Activity} trend="+15%" />
        <StatCard label="Retention" value="68%" icon={TrendingUp} />
      </div>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Trends</h3>
            <Select
              options={[
                { label: 'Last 7 days', value: '7' },
                { label: 'Last 30 days', value: '30' },
                { label: 'Last 90 days', value: '90' },
                { label: 'Last year', value: '365' },
              ]}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </div>
          {loading || !chartData ? (
            <div className="h-64 flex items-center justify-center text-neutral-400">
              Loading chart...
            </div>
          ) : (
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full border-b border-neutral-200 dark:border-dark-border">
              {/* Y-axis */}
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} stroke="currentColor" strokeWidth="2" opacity="0.2" />
              {/* X-axis */}
              <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} stroke="currentColor" strokeWidth="2" opacity="0.2" />
            
              {/* Grid lines and labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const y = chartHeight - padding.bottom - innerHeight * pct
                const value = Math.round(maxRevenue * pct / 1000) + 'K'
                return (
                  <g key={i}>
                    <line x1={padding.left - 5} y1={y} x2={padding.left} y2={y} stroke="currentColor" opacity="0.3" />
                    <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="12" fill="currentColor" opacity="0.6">{value}</text>
                  </g>
                )
              })}
            
              {/* Line chart */}
              {chartData && (
                <>
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = padding.left + i * pointSpacing
                      const y = chartHeight - padding.bottom - (d.revenue / maxRevenue) * innerHeight
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                
                  {/* Data points */}
                  {chartData.map((d, i) => {
                    const x = padding.left + i * pointSpacing
                    const y = chartHeight - padding.bottom - (d.revenue / maxRevenue) * innerHeight
                    return (
                      <circle key={i} cx={x} cy={y} r="4" fill="rgb(34, 197, 94)" opacity="0.8" />
                    )
                  })}
                
                  {/* X-axis labels */}
                  {chartData.map((d, i) => {
                    const x = padding.left + i * pointSpacing
                    return (
                      <text key={i} x={x} y={chartHeight - padding.bottom + 20} textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.6">{d.date}</text>
                    )
                  })}
                </>
              )}
            </svg>
          )}
        </Card>
    </motion.div>
  )
}
