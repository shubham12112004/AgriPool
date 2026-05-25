import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Shield,
  Tractor,
  BarChart3,
  AlertTriangle,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  Search,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Button, Input, Badge, Spinner } from '../../components/ui'
import { adminService } from '../../services'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [crops, setCrops] = useState([])
  const [aiAdvice, setAiAdvice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = async (showToast = false) => {
    try {
      setLoading(true)
      const res = await adminService.getDashboardData()
      if (res?.success) {
        setStats(res.stats)
        setCrops(res.crops || [])
        if (showToast) {
          toast.success('Dashboard metrics refreshed')
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  const fetchAiAdvice = async () => {
    try {
      setAiLoading(true)
      const res = await adminService.getAiAdvice()
      if (res?.success) {
        setAiAdvice(res.advice)
        toast.success('AgriAI strategy updated')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to retrieve AgriAI suggestions')
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    fetchAiAdvice()
  }, [])

  const handleExportCSV = () => {
    if (!stats) return
    let csvContent = 'data:text/csv;charset=utf-8,'
    
    csvContent += 'AgriPool Admin Dashboard Platform Report\n'
    csvContent += `Generated At,${new Date().toLocaleString()}\n\n`
    
    csvContent += 'PLATFORM STATISTICS\n'
    csvContent += 'Metric,Value\n'
    csvContent += `Total Platform Users,${stats.total_users}\n`
    csvContent += `Farmers,${stats.farmers}\n`
    csvContent += `Drivers,${stats.drivers}\n`
    csvContent += `Equipment Owners,${stats.equipment_owners}\n`
    csvContent += `Buyers,${stats.buyers}\n`
    csvContent += `Monthly Active Users,${stats.mau}\n`
    csvContent += `User Retention Rate,${stats.retention}%\n`
    csvContent += `Total Bookings,${stats.total_bookings}\n`
    csvContent += `Total Platform Revenue,INR ${stats.total_revenue}\n\n`
    
    csvContent += 'CROPS & PRODUCTS CURRENTLY BEING SOLD\n'
    csvContent += 'Crop Name,Quantity,Unit,Total Weight (kg),Farmer Name,Delivery Status,Date Listed\n'
    
    crops.forEach((c) => {
      csvContent += `"${c.crop_name}",${c.quantity},"${c.unit}",${c.weight_kg},"${c.farmer_name}","${c.status}","${c.created_at}"\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `agripool_platform_report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('CSV Report downloaded successfully')
  }

  const handleExportPDF = () => {
    window.print()
  }

  const filteredCrops = crops.filter(
    (c) =>
      c.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.farmer_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const parseBold = (text) => {
    const parts = text.split('**')
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-bold text-neutral-900 dark:text-white">
          {part}
        </strong>
      ) : (
        part
      )
    )
  }

  const renderMarkdown = (text) => {
    if (!text) return null
    const lines = text.split('\n')
    return (
      <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="text-lg font-bold mt-5 mb-2 text-primary-600 dark:text-primary-400 border-b border-neutral-100 dark:border-dark-border pb-1"
              >
                {line.replace('### ', '')}
              </h3>
            )
          }
          if (line.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-base font-semibold mt-4 mb-1 text-neutral-900 dark:text-neutral-100">
                {line.replace('#### ', '')}
              </h4>
            )
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const clean = line.replace(/^[-*]\s+/, '')
            return (
              <li key={idx} className="ml-5 list-disc text-sm py-0.5 leading-relaxed">
                {parseBold(clean)}
              </li>
            )
          }
          if (line.match(/^\d+\.\s+/)) {
            const clean = line.replace(/^\d+\.\s+/, '')
            return (
              <li key={idx} className="ml-5 list-decimal text-sm py-0.5 leading-relaxed">
                {parseBold(clean)}
              </li>
            )
          }
          if (line.trim() === '') return <div key={idx} className="h-1" />
          return (
            <p key={idx} className="text-sm leading-relaxed">
              {parseBold(line)}
            </p>
          )
        })}
      </div>
    )
  }

  if (loading && !stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-neutral-500 dark:text-neutral-400 animate-pulse text-sm">
          Loading platform metrics...
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-7xl mx-auto px-1 print:p-0"
      id="admin-print-area"
    >
      {/* Styles for print hiding everything else */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          /* Hide sidebar, navbar, buttons during print */
          header, nav, aside, footer, button, .no-print, input {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          main, #admin-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .card {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            background: white !important;
          }
        }
      `}</style>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200/60 dark:border-dark-border pb-6">
        <PageHeader
          title="Admin Control Center"
          subtitle="Real-time Platform Growth, Agricultural Supply and AI Insights"
        />

        <div className="flex flex-wrap items-center gap-3 no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <Download size={14} />
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportPDF}
            className="flex items-center gap-2"
          >
            <Printer size={14} />
            Print Report
          </Button>
        </div>
      </div>

      {/* Primary Key Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Registered Users"
          value={stats?.total_users || 0}
          icon={Users}
          trend={`MAU: ${stats?.mau || 0}`}
          trendVariant="primary"
        />
        <StatCard
          label="Farmers (Sellers)"
          value={stats?.farmers || 0}
          icon={Award}
          trend={`${Math.round(((stats?.farmers || 0) / (stats?.total_users || 1)) * 100)}% of base`}
          trendVariant="success"
        />
        <StatCard
          label="Active Drivers"
          value={stats?.drivers || 0}
          icon={Tractor}
          trend={`Ratio 1:${Math.max(Math.round((stats?.farmers || 0) / (stats?.drivers || 1)), 1)} Farmers`}
          trendVariant="warning"
        />
        <StatCard
          label="Pending Verifications"
          value={stats?.pending_verification || 0}
          icon={Shield}
          trend={stats?.pending_verification > 0 ? 'Requires Action' : 'Cleared'}
          trendVariant={stats?.pending_verification > 0 ? 'error' : 'success'}
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="glass" className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              User Retention Rate
            </p>
            <p className="text-2xl font-bold mt-1 text-primary-600 dark:text-primary-400">
              {stats?.retention || 85}%
            </p>
          </div>
          <p className="text-xs text-neutral-500 mt-2">Weighted average month-over-month</p>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Platform Gross Bookings
            </p>
            <p className="text-2xl font-bold mt-1 text-neutral-800 dark:text-neutral-100">
              {stats?.total_bookings || 0}
            </p>
          </div>
          <p className="text-xs text-neutral-500 mt-2">Logistics & rental runs combined</p>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Gross Merchandise Value
            </p>
            <p className="text-2xl font-bold mt-1 text-neutral-800 dark:text-neutral-100">
              ₹{stats?.total_revenue?.toLocaleString() || '0'}
            </p>
          </div>
          <p className="text-xs text-neutral-500 mt-2">Successful payment transactions</p>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Other Roles (Owners & Buyers)
            </p>
            <p className="text-2xl font-bold mt-1 text-neutral-800 dark:text-neutral-100">
              {(stats?.equipment_owners || 0) + (stats?.buyers || 0)}
            </p>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            {stats?.equipment_owners || 0} Owners | {stats?.buyers || 0} Buyers
          </p>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: What Farmers are Selling */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">
                What Farmers are Selling
              </h3>
              <p className="text-xs text-neutral-500">Live crops and active delivery batches</p>
            </div>

            <div className="relative w-full sm:w-60 no-print">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
              <Input
                placeholder="Search crops or farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 py-1 text-sm h-8"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-150 dark:border-dark-border rounded-xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-dark-card border-b border-neutral-150 dark:border-dark-border text-neutral-500 font-semibold">
                  <th className="p-3">Crop Name</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150 dark:divide-dark-border text-neutral-700 dark:text-neutral-300">
                {filteredCrops.length > 0 ? (
                  filteredCrops.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-dark-border/20 transition-colors">
                      <td className="p-3 font-medium text-neutral-900 dark:text-white">
                        {item.crop_name}
                      </td>
                      <td className="p-3 text-right">
                        {item.quantity} <span className="text-xs text-neutral-400">{item.unit}</span>
                      </td>
                      <td className="p-3 text-neutral-500">
                        {item.weight_kg ? `${item.weight_kg.toLocaleString()} kg` : 'N/A'}
                      </td>
                      <td className="p-3 text-sm font-semibold">{item.farmer_name}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            item.status === 'completed'
                              ? 'success'
                              : item.status === 'in_transit'
                              ? 'primary'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {item.status?.replace('_', ' ') || 'pending'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-neutral-400 dark:text-neutral-500">
                      No active listings or crop details found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: AI Insights & Advisors */}
        <Card variant="glass" className="p-6 space-y-5 border-primary-500/25 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-primary-500 pointer-events-none">
            <Sparkles size={160} />
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-dark-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-bold text-md text-neutral-800 dark:text-neutral-100">
                  AgriAI Strategic Guidance
                </h3>
                <p className="text-[10px] text-neutral-400">Powered by Gemini Large Language Model</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={fetchAiAdvice}
              disabled={aiLoading}
              className="p-1.5 h-8 w-8 rounded-lg no-print"
            >
              <RefreshCw size={14} className={aiLoading ? 'animate-spin' : ''} />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {aiLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center space-y-3"
              >
                <Spinner size="md" />
                <p className="text-xs text-neutral-400 animate-pulse">Running economic growth algorithms...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-h-[380px] overflow-y-auto pr-1"
              >
                {aiAdvice ? (
                  renderMarkdown(aiAdvice)
                ) : (
                  <p className="text-sm text-neutral-400 text-center py-10">
                    No strategic guidance computed yet. Click the refresh icon to compute insights.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </motion.div>
  )
}
