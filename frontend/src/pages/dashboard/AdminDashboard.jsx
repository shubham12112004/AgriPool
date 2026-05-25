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
  Award,
  HelpCircle,
  CheckCircle,
  Inbox
} from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import PageHeader from '../../components/shared/PageHeader'
import { Card, Button, Input, Badge, Spinner } from '../../components/ui'
import { adminService, analyticsService, supportService } from '../../services'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [crops, setCrops] = useState([])
  const [aiAdvice, setAiAdvice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [supportRequests, setSupportRequests] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null)
  const [hoveredSlice, setHoveredSlice] = useState(null)
  const [resolvingId, setResolvingId] = useState(null)

  const fetchData = async (showToast = false) => {
    try {
      setLoading(true)
      const res = await adminService.getDashboardData()
      if (res?.success) {
        setStats(res.stats)
        setCrops(res.crops || [])
        setSupportRequests(res.support_requests || [])
      }

      try {
        const revRes = await analyticsService.getRevenueChart(30)
        setRevenueData(revRes || [])
      } catch (err) {
        console.error('Failed to load revenue chart data:', err)
      }

      if (showToast) {
        toast.success('Dashboard metrics refreshed')
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

  const handleResolveSupport = async (id) => {
    try {
      setResolvingId(id)
      const res = await supportService.resolveRequest(id)
      if (res?.success) {
        toast.success('Support request resolved successfully')
        setSupportRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: 'resolved' } : req))
        )
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to resolve support request')
    } finally {
      setResolvingId(null)
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

      {/* Interactive Live Reports Section */}
      {(() => {
        const getFallbackRevenueData = () => {
          const data = []
          for (let i = 29; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            data.push({
              date: d.toISOString().split('T')[0],
              revenue: 0,
              bookings: 0
            })
          }
          return data
        }

        const activeRevenueData = revenueData.length > 0 ? revenueData : getFallbackRevenueData()
        const maxRevenue = Math.max(...activeRevenueData.map(d => d.revenue), 1000)
        
        const chartWidth = 600
        const chartHeight = 200
        const padding = { top: 20, right: 20, bottom: 30, left: 50 }

        const points = activeRevenueData.map((d, index) => {
          const x = padding.left + (index * (chartWidth - padding.left - padding.right)) / Math.max(activeRevenueData.length - 1, 1)
          const y = chartHeight - padding.bottom - (d.revenue / maxRevenue) * (chartHeight - padding.top - padding.bottom)
          return { x, y, data: d }
        })

        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
        const areaPath = points.length > 0
          ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`
          : ''

        const farmersCount = stats?.farmers || 0
        const driversCount = stats?.drivers || 0
        const ownersCount = stats?.equipment_owners || 0
        const buyersCount = stats?.buyers || 0

        const userSegments = [
          { label: 'Farmers', count: farmersCount, color: '#10b981', hoverColor: '#059669' },
          { label: 'Drivers', count: driversCount, color: '#f59e0b', hoverColor: '#d97706' },
          { label: 'Equipment Owners', count: ownersCount, color: '#3b82f6', hoverColor: '#2563eb' },
          { label: 'Buyers', count: buyersCount, color: '#8b5cf6', hoverColor: '#7c3aed' },
        ].filter(s => s.count > 0)

        const activeTotal = userSegments.reduce((sum, s) => sum + s.count, 0) || 1

        let accumulatedAngle = 0
        const pieSlices = userSegments.map((seg) => {
          const percentage = ((seg.count / activeTotal) * 100).toFixed(1)
          const angle = (seg.count / activeTotal) * 360
          
          const r = 70
          const cx = 100
          const cy = 100
          
          const startRad = (accumulatedAngle - 90) * Math.PI / 180
          const endRad = (accumulatedAngle + angle - 90) * Math.PI / 180
          
          const x1 = cx + r * Math.cos(startRad)
          const y1 = cy + r * Math.sin(startRad)
          const x2 = cx + r * Math.cos(endRad)
          const y2 = cy + r * Math.sin(endRad)
          
          const largeArcFlag = angle > 180 ? 1 : 0
          
          const pathData = angle >= 359.9
            ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
            : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
          
          const sliceInfo = {
            ...seg,
            pathData,
            percentage,
            startAngle: accumulatedAngle,
            endAngle: accumulatedAngle + angle
          }
          
          accumulatedAngle += angle
          return sliceInfo
        })

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Line Chart */}
            <Card className="p-6 lg:col-span-2 space-y-4 relative overflow-visible">
              <div>
                <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-500" />
                  Live Platform Revenue (Past 30 Days)
                </h3>
                <p className="text-xs text-neutral-500">Live successful payments timeline updated in real-time</p>
              </div>

              <div className="relative h-60 w-full mt-4" onMouseLeave={() => setHoveredDataPoint(null)}>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                  onMouseMove={(e) => {
                    if (!points.length) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const svgX = (x / rect.width) * chartWidth
                    
                    let closest = points[0]
                    let minDiff = Math.abs(points[0].x - svgX)
                    for (let i = 1; i < points.length; i++) {
                      const diff = Math.abs(points[i].x - svgX)
                      if (diff < minDiff) {
                        minDiff = diff
                        closest = points[i]
                      }
                    }
                    setHoveredDataPoint(closest)
                  }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom)
                    const val = Math.round(maxRevenue - ratio * maxRevenue)
                    return (
                      <g key={ratio} className="opacity-40">
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={chartWidth - padding.right}
                          y2={y}
                          stroke="currentColor"
                          strokeWidth={1}
                          strokeDasharray="4,4"
                          className="text-neutral-200 dark:text-dark-border"
                        />
                        <text
                          x={padding.left - 10}
                          y={y + 4}
                          textAnchor="end"
                          className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 fill-current"
                        >
                          ₹{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                        </text>
                      </g>
                    )
                  })}

                  {/* Chart Line and Area */}
                  {points.length > 1 && (
                    <>
                      <path d={areaPath} fill="url(#chartGradient)" />
                      <path d={linePath} fill="none" stroke="#10b981" strokeWidth={3} strokeLinecap="round" />
                    </>
                  )}

                  {/* Circles */}
                  {points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={hoveredDataPoint?.data?.date === p.data.date ? 6 : 3}
                      fill={hoveredDataPoint?.data?.date === p.data.date ? '#10b981' : '#34d399'}
                      stroke={hoveredDataPoint?.data?.date === p.data.date ? '#ffffff' : 'none'}
                      strokeWidth={2}
                      className="transition-all duration-150"
                    />
                  ))}

                  {/* Guide vertical line */}
                  {hoveredDataPoint && (
                    <line
                      x1={hoveredDataPoint.x}
                      y1={padding.top}
                      x2={hoveredDataPoint.x}
                      y2={chartHeight - padding.bottom}
                      stroke="#10b981"
                      strokeWidth={1.5}
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* X Axis Label */}
                  {points.filter((_, idx) => idx % Math.max(Math.round(points.length / 5), 1) === 0).map((p, i) => (
                    <text
                      key={i}
                      x={p.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 fill-current"
                    >
                      {p.data.date.split('-').slice(1).join('/')}
                    </text>
                  ))}
                </svg>

                {/* Tooltip */}
                {hoveredDataPoint && (
                  <div
                    className="absolute bg-white/95 dark:bg-dark-card/95 border border-neutral-200 dark:border-dark-border p-3 rounded-2xl shadow-xl z-20 pointer-events-none text-xs space-y-1.5 backdrop-blur-md"
                    style={{
                      left: `${(hoveredDataPoint.x / chartWidth) * 100}%`,
                      top: `${(hoveredDataPoint.y / chartHeight) * 100 - 35}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <p className="font-bold text-neutral-800 dark:text-white border-b border-neutral-100 dark:border-dark-border pb-1">
                      {new Date(hoveredDataPoint.data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="flex items-center gap-4 justify-between">
                      <span className="text-neutral-500">Revenue:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{hoveredDataPoint.data.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4 justify-between">
                      <span className="text-neutral-500">Bookings:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">{hoveredDataPoint.data.bookings} runs</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Pie Chart: User Base breakdown */}
            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                  <Users size={18} className="text-primary-500" />
                  User base Distribution
                </h3>
                <p className="text-xs text-neutral-500">Live platform accounts role breakdown</p>
              </div>

              <div className="relative flex-1 flex flex-col items-center justify-center my-4">
                <svg viewBox="0 0 200 200" className="w-40 h-40 overflow-visible">
                  {pieSlices.map((slice, i) => {
                    const isHovered = hoveredSlice?.label === slice.label
                    return (
                      <path
                        key={i}
                        d={slice.pathData}
                        fill={isHovered ? slice.hoverColor : slice.color}
                        className="transition-all duration-300 origin-[100px_100px] cursor-pointer"
                        style={{
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onMouseEnter={() => setHoveredSlice(slice)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    )
                  })}
                </svg>

                {hoveredSlice && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-dark-card/95 border border-neutral-150 dark:border-dark-border py-2 px-3.5 rounded-2xl shadow-xl z-20 pointer-events-none text-center backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">{hoveredSlice.label}</p>
                    <p className="text-lg font-black mt-0.5 text-neutral-800 dark:text-white">{hoveredSlice.count}</p>
                    <p className="text-xs text-primary-500 font-semibold">{hoveredSlice.percentage}%</p>
                  </div>
                )}
              </div>

              {/* Legends */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {pieSlices.map((slice, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border border-transparent transition-all ${
                      hoveredSlice?.label === slice.label
                        ? 'bg-neutral-100 dark:bg-dark-border/40 border-neutral-200 dark:border-dark-border'
                        : ''
                    }`}
                    onMouseEnter={() => setHoveredSlice(slice)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-700 dark:text-neutral-300 truncate">{slice.label}</p>
                      <p className="text-[10px] text-neutral-400">{slice.count} ({slice.percentage}%)</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )
      })()}

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

      {/* Support Requests Management Desk */}
      <Card className="p-6 mt-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <HelpCircle size={20} className="text-primary-500" />
            Support Help Desk Tickets
          </h3>
          <p className="text-xs text-neutral-500">Live requests from farmers, drivers, and other users submitted via support desk</p>
        </div>

        <div className="overflow-x-auto border border-neutral-150 dark:border-dark-border rounded-xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-dark-card border-b border-neutral-150 dark:border-dark-border text-neutral-500 font-semibold">
                <th className="p-3">User Details</th>
                <th className="p-3">Category</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Message</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150 dark:divide-dark-border text-neutral-700 dark:text-neutral-300">
              {supportRequests.length > 0 ? (
                supportRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50/50 dark:hover:bg-dark-border/20 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-neutral-900 dark:text-white">{req.name}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{req.email}</p>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-dark-border text-neutral-600 dark:text-neutral-300 text-xs font-medium">
                        {req.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-neutral-800 dark:text-neutral-100">
                      {req.subject}
                    </td>
                    <td className="p-3 text-xs max-w-xs break-words whitespace-pre-wrap text-neutral-500 dark:text-neutral-400">
                      {req.message}
                    </td>
                    <td className="p-3 text-xs text-neutral-400 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant={req.status === 'resolved' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {req.status === 'pending' ? (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleResolveSupport(req.id)}
                          disabled={resolvingId === req.id}
                          className="px-2 py-1 flex items-center gap-1 mx-auto hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500"
                        >
                          {resolvingId === req.id ? (
                            <Spinner size="xs" />
                          ) : (
                            <>
                              <CheckCircle size={12} />
                              Resolve
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-emerald-500 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle size={12} />
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-neutral-400 dark:text-neutral-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox size={28} className="text-neutral-300" />
                      <p className="text-sm">No support requests or help tickets found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}
