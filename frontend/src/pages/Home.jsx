import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import TestimonialsCarousel from '../components/home/TestimonialsCarousel'
import { Button, Card, Accordion } from '../components/ui'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { useAuthStore, getDashboardPathForRole } from '../store/authStore'
import { assistantService } from '../services'
import { 
  Truck, Tractor, ShoppingBag, Users, ArrowRight, Check, 
  Star, TrendingUp, MapPin, Clock, DollarSign, Shield,
  Play, Calendar, Search, Map, Leaf, MessageSquare, Activity,
  FlaskConical, Crosshair, ChevronRight, MessageCircle, Bot
} from 'lucide-react'

export default function Home() {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const { user, role } = useAuthStore()
  const [activeTab, setActiveTab] = useState('Machinery')
  const [isHydrated, setIsHydrated] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', body: 'Hello! I can help you with crop choices, disease resolution, weather updates, and much more.' }
  ])
  const [aiLoading, setAiLoading] = useState(false)

  const handleAiSubmit = async (e) => {
    e.preventDefault()
    const prompt = aiInput.trim()
    if (!prompt) return

    setAiMessages(prev => [...prev, { role: 'user', body: prompt }])
    setAiInput('')
    setAiLoading(true)

    try {
      const res = await assistantService.chat(prompt, { role })
      const reply = res?.data?.reply || 'I am here to guide you with any agricultural support questions.'
      setAiMessages(prev => [...prev, { role: 'assistant', body: reply }])
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', body: 'Failed to connect. Please try again later.' }])
    } finally {
      setAiLoading(false)
    }
  }
  
  React.useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  const dashboardPath = user ? getDashboardPathForRole(role) : '/register'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const services = [
    {
      icon: Tractor,
      title: 'Machinery Rentals',
      description: 'Rent tractors, harvesters, and more from verified owners.',
      color: 'text-primary-600',
      bg: 'bg-primary-50'
    },
    {
      icon: Truck,
      title: 'Transport Logistics',
      description: 'Book trucks and vans for product delivery nationwide.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Bot,
      title: 'AI Crop Advisory',
      description: 'Get AI-powered insights for crop health and yield.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      icon: Crosshair,
      title: 'Drone Spraying',
      description: 'Precision drone spraying for efficient crop protection.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: Activity,
      title: 'Soil Health Insights',
      description: 'Test soil health and get customized improvement plans.',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      icon: FlaskConical,
      title: 'Precision Fertilizer Planner',
      description: 'AI-assisted fertilizer recommendations for maximum yield.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ]

  const popularMachinery = [
    {
      name: 'Mahindra 575 DI XP Plus',
      type: 'Tractor - 47 HP',
      price: '₹ 400',
      unit: '/ hr',
      image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=800',
      tag: 'Available',
    },
    {
      name: 'Swaraj 855 FE',
      type: 'Tractor - 52 HP',
      price: '₹ 450',
      unit: '/ hr',
      image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
      tag: 'Available',
    },
    {
      name: 'John Deere W70 Harvester',
      type: 'Harvester - 100 HP',
      price: '₹ 1,200',
      unit: '/ hr',
      tag: 'Available',
      image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      name: 'Heavy Duty Rotavator',
      type: 'Implement - 6 Feet',
      price: '₹ 300',
      unit: '/ hr',
      tag: 'Available',
      image: 'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Choose Service',
      description: 'Select the service you need—machinery, transport, or advisory.',
    },
    {
      step: 2,
      title: 'Book Instantly',
      description: 'Check availability and book instantly with secure payments.',
    },
    {
      step: 3,
      title: 'Track & Grow',
      description: 'Track your service in real-time and boost your farm\'s productivity.',
    },
  ]

  const testimonials = [
    {
      name: 'Ramesh Yadav',
      role: 'Farmer, UP',
      image: '👨‍🌾',
      text: '"AgriPool has made renting machinery so easy and affordable. Highly recommended for every farmer!"',
      rating: 5,
    },
    {
      name: 'Priya Singh',
      role: 'Equipment Owner, Punjab',
      image: '👩‍💼',
      text: '"My tractor is now generating passive income. Great platform for business growth."',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      role: 'Driver, Gujarat',
      image: '👨‍💻',
      text: '"Consistent bookings and fair payments. AgriPool is changing transportation in agriculture."',
      rating: 5,
    },
  ]

  const faqItems = [
    {
      title: 'How do I get started?',
      content: 'Sign up with your email or Google account, select your role, complete your profile with necessary documents, and you\'re ready to go!',
    },
    {
      title: 'Is AgriPool safe?',
      content: 'Yes! We verify all users, secure all transactions with encryption, and have 24/7 customer support to ensure safety.',
    },
    {
      title: 'What are the payment methods?',
      content: 'We support all major payment methods including credit cards, debit cards, UPI, and bank transfers for maximum convenience.',
    },
    {
      title: 'Are there any hidden charges?',
      content: 'No! All charges are transparent and shown upfront. You\'ll see the complete breakdown before confirming any transaction.',
    },
  ]

  return (
    <div className={`transition-colors duration-300 ${isDark ? 'bg-dark-bg text-white' : 'bg-white text-neutral-900'}`}>
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden bg-gradient-to-br from-[#0c2018] to-[#123124]">
        {/* Subtle background overlay map / dots (simulated with CSS pattern) */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-800/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 pt-10">
          <div className="grid lg:grid-cols-[1fr_450px] gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="z-10"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <span className="text-xs font-bold text-primary-400 tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                  India's Most Trusted Agri Platform
                </span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                {t('home.hero.title')}
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-base md:text-lg mb-10 max-w-xl text-neutral-300 leading-relaxed">
                {t('home.hero.subtitle')}
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-14">
                <Link to="/register" className="px-6 py-3 rounded-md font-bold bg-primary-600 text-white hover:bg-primary-500 transition-colors flex items-center justify-center shadow-lg shadow-primary-600/30">
                  {t('home.hero.cta')} <ChevronRight size={18} className="ml-1" />
                </Link>
                <a href="#how-it-works" className="px-6 py-3 rounded-md font-bold border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center backdrop-blur-sm">
                  {t('home.hero.learnMore')}
                </a>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">2M+</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Farmers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">50K+</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Equipment Listings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">100K+</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Deliveries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Secure Transactions</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Booking Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-6 relative z-20"
            >
              {/* Tabs */}
              <div className="flex border-b border-neutral-200 mb-6 gap-2">
                {['Machinery', 'Transport', 'Advisory'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                      activeTab === tab 
                        ? 'text-primary-600 border-primary-600' 
                        : 'text-neutral-500 border-transparent hover:text-neutral-700'
                    }`}
                  >
                    {tab === 'Machinery' && <Tractor size={16} />}
                    {tab === 'Transport' && <Truck size={16} />}
                    {tab === 'Advisory' && <Leaf size={16} />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form Grid */}
              {activeTab === 'Machinery' && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <select className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-medium text-neutral-800 shadow-sm">
                          <option>New Delhi, India</option>
                          <option>Punjab, India</option>
                          <option>Haryana, India</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Equipment Type</label>
                      <div className="relative">
                        <select className="w-full pl-3 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-medium text-neutral-800 shadow-sm">
                          <option>Tractor</option>
                          <option>Harvester</option>
                          <option>Seeder</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Power / HP</label>
                      <div className="relative">
                        <select className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-medium text-neutral-800 shadow-sm">
                          <option>50+ HP</option>
                          <option>30-50 HP</option>
                          <option>Below 30 HP</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Rental Duration</label>
                      <div className="relative">
                        <select className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-medium text-neutral-800 shadow-sm">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Start Date</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="date" defaultValue="2026-05-18" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none font-medium text-neutral-800 shadow-sm" />
                      </div>
                    </div>
                  </div>
                  <Link to="/register">
                    <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                      <Search size={18} /> Check Availability
                    </button>
                  </Link>
                </>
              )}

              {activeTab === 'Transport' && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Pickup Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="text" placeholder="Enter pickup city or zip" className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none font-medium text-neutral-800 shadow-sm" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Dropoff Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="text" placeholder="Enter dropoff city or zip" className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none font-medium text-neutral-800 shadow-sm" />
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Vehicle Type</label>
                      <div className="relative">
                        <select className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-medium text-neutral-800 shadow-sm">
                          <option>Pickup Truck</option>
                          <option>Heavy Lorry</option>
                          <option>Refrigerated Van</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Date</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="date" defaultValue="2026-05-18" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 outline-none font-medium text-neutral-800 shadow-sm" />
                      </div>
                    </div>
                  </div>
                  <Link to="/register">
                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                      <Search size={18} /> Find Transporters
                    </button>
                  </Link>
                </>
              )}

              {activeTab === 'Advisory' && (
                <div className="flex flex-col h-[320px]">
                  <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4 flex flex-col overflow-hidden relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <Bot size={16} />
                      </div>
                      <div className="font-bold text-sm text-neutral-700">AgriAI Assistant</div>
                    </div>
                    
                    <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm border border-neutral-100 text-sm text-neutral-600 mb-3 max-w-[85%]">
                      Hello! I can help you analyze soil data, predict crop yields, or identify plant diseases. How can I assist you today?
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent pointer-events-none" />
                  </div>
                  
                  <Link to="/register">
                    <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                      <MessageSquare size={18} /> Start Free Consultation
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className={`py-10 border-b ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-neutral-50 border-neutral-200'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Trusted By
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            {['IFFCO', 'KRIBHCO', 'CORTEVA', 'Mahindra', 'NCDEX'].map(brand => (
              <span key={brand} className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Carousel */}
      <section className="py-12 bg-neutral-900 overflow-hidden relative border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 mb-8">
           <h3 className="text-white font-bold text-lg flex items-center gap-3">
             <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
             Live Platform Activity
           </h3>
        </div>
        <div className="relative w-full h-[280px]">
          <div className="absolute top-0 bottom-0 flex gap-6 items-center px-4 w-[200%]" style={{
            animation: 'scroll 30s linear infinite',
          }} onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'} onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}>
            
            {/* Mock agriculture images */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="w-64 h-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 hover:-translate-y-2 transition-transform duration-300">
                  <img src="https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover" alt="Tractor" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                    <div className="text-primary-400 text-[10px] font-bold tracking-widest mb-1">AVAILABLE NOW</div>
                    <div className="text-white font-semibold">John Deere 8R</div>
                  </div>
                </div>
                <div className="w-64 h-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 hover:-translate-y-2 transition-transform duration-300">
                  <img src="https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover" alt="Harvester" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                    <div className="text-blue-400 text-[10px] font-bold tracking-widest mb-1">EN ROUTE</div>
                    <div className="text-white font-semibold">Wheat Harvester</div>
                  </div>
                </div>
                <div className="w-64 h-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 hover:-translate-y-2 transition-transform duration-300">
                  <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover" alt="Truck" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                    <div className="text-emerald-400 text-[10px] font-bold tracking-widest mb-1">COMPLETED</div>
                    <div className="text-white font-semibold">Crop Delivery</div>
                  </div>
                </div>
                <div className="w-64 h-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 hover:-translate-y-2 transition-transform duration-300">
                  <img src="https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover" alt="Agriculture" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                    <div className="text-amber-400 text-[10px] font-bold tracking-widest mb-1">ADVISORY</div>
                    <div className="text-white font-semibold">Soil Inspection</div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Our Services</h2>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Everything you need to grow better, smarter and faster.</p>
            </div>
            <Link to="/services" className="text-primary-600 font-semibold text-sm hover:underline flex items-center gap-1 hidden sm:flex">
              View All Services <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon
              return (
                <div key={idx} className={`p-6 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${service.bg} ${service.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Machinery */}
      <section className={`py-20 px-4 ${isDark ? 'bg-dark-card/50' : 'bg-neutral-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Machinery Rentals</h2>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Top-rated equipment currently available in your area.</p>
            </div>
            <Link to="/equipment" className="text-primary-600 font-semibold text-sm hover:underline flex items-center gap-1 hidden sm:flex">
              View All Machinery <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularMachinery.map((item, idx) => (
              <div key={idx} className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200'}`}>
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-bold text-primary-600 uppercase tracking-wide">
                    {item.tag}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 truncate">{item.name}</h3>
                  <p className={`text-xs mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{item.type}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg">{item.price}</span>
                      <span className={`text-xs ml-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{item.unit}</span>
                    </div>
                    <Link to="/register">
                      <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg transition-colors">
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Advisory Banner */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-[#0c2018] overflow-hidden flex flex-col md:flex-row relative shadow-xl">
            {/* Left Decor */}
            <div className="w-full md:w-1/3 bg-primary-900/40 p-10 flex flex-col justify-center border-r border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
               <h3 className="text-white font-bold text-2xl mb-6 relative z-10">AI Advisory</h3>
               <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-3 text-primary-200">
                   <div className="w-8 h-8 rounded bg-primary-800/50 flex items-center justify-center"><Check size={16} className="text-primary-400" /></div>
                   <span className="text-sm font-medium">Crop Disease Detection</span>
                 </div>
                 <div className="flex items-center gap-3 text-primary-200">
                   <div className="w-8 h-8 rounded bg-primary-800/50 flex items-center justify-center"><Check size={16} className="text-primary-400" /></div>
                   <span className="text-sm font-medium">Yield Prediction Models</span>
                 </div>
                 <div className="flex items-center gap-3 text-primary-200">
                   <div className="w-8 h-8 rounded bg-primary-800/50 flex items-center justify-center"><Check size={16} className="text-primary-400" /></div>
                   <span className="text-sm font-medium">Weather Integrations</span>
                 </div>
                 <div className="flex items-center gap-3 text-primary-200">
                   <div className="w-8 h-8 rounded bg-primary-800/50 flex items-center justify-center"><Check size={16} className="text-primary-400" /></div>
                   <span className="text-sm font-medium">Soil Recommendations</span>
                 </div>
               </div>
            </div>
            
            <div className="w-full md:w-2/3 p-10 flex flex-col justify-between relative min-h-[380px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/30">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1">Ask AgriAi</h4>
                  <p className="text-primary-200 text-sm">Your virtual farming assistant.</p>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto max-h-[220px] mb-4 space-y-3 pr-2 scrollbar-thin">
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-xl p-3 max-w-[85%] text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-[#122e22] text-primary-100 border border-primary-800/50 rounded-tl-none'
                    }`}>
                      {msg.body}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl p-3 bg-[#122e22] text-primary-100/60 text-sm border border-primary-800/50 rounded-tl-none animate-pulse">
                      AgriAi is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAiSubmit} className="relative max-w-lg">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask anything about farming..." 
                  disabled={aiLoading}
                  className="w-full bg-[#0a1913] border border-primary-900/50 rounded-xl py-3.5 pl-4 pr-12 text-white placeholder-primary-700/50 focus:outline-none focus:border-primary-500 transition-colors text-sm"
                />
                <button 
                  type="submit" 
                  disabled={aiLoading || !aiInput.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center hover:bg-primary-500 transition-colors disabled:opacity-50"
                >
                  <ArrowRight size={16} className="text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & What Farmers Say */}
      <section id="how-it-works" className={`py-20 px-4 border-t ${isDark ? 'border-dark-border bg-dark-bg' : 'border-neutral-200 bg-neutral-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Left: How It Works */}
            <div>
              <h2 className="text-3xl font-bold mb-2">How It Works</h2>
              <p className={`text-sm mb-12 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Simple steps to get started with AgriPool.</p>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                {howItWorks.map((item, idx) => (
                  <div key={idx} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary-100 text-primary-600 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {item.step}
                    </div>
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200 shadow-sm'}`}>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: What Farmers Say */}
            <div>
              <h2 className="text-3xl font-bold mb-2">What Farmers Say</h2>
              <p className={`text-sm mb-12 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Read success stories from our community.</p>
              
              <div className="grid gap-6">
                {testimonials.slice(0,2).map((item, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl shrink-0">
                        {item.image}
                      </div>
                      <div>
                        <h4 className="font-bold text-base">{item.name}</h4>
                        <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{item.role}</p>
                      </div>
                      <div className="ml-auto flex text-amber-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className={`text-sm italic ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center sm:text-left">
                <Link to="/register" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:underline">
                  View all reviews <ChevronRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-20 px-4 border-t ${isDark ? 'border-dark-border bg-dark-bg' : 'border-neutral-200 bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Have questions about AgriPool? We have answers.</p>
          </div>
          <div className="mt-8">
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
