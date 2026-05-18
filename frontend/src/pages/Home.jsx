import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import TestimonialsCarousel from '../components/home/TestimonialsCarousel'
import { Button, Card, Accordion } from '../components/ui'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { 
  Truck, Tractor, ShoppingBag, Users, ArrowRight, Check, 
  Star, TrendingUp, MapPin, Clock, DollarSign, Shield,
} from 'lucide-react'

export default function Home() {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const features = [
    {
      icon: Tractor,
      title: 'Equipment Rental',
      description: 'Access a wide range of farming equipment for rent at affordable prices',
    },
    {
      icon: Truck,
      title: 'Transportation Services',
      description: 'Reliable and efficient agricultural product transportation',
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Buy and sell agricultural products directly to consumers',
    },
    {
      icon: Users,
      title: 'Community Network',
      description: 'Connect with farmers, drivers, and equipment owners',
    },
  ]

  const stats = [
    { number: '50K+', label: 'Active Farmers', icon: Users },
    { number: '10K+', label: 'Equipment Available', icon: Tractor },
    { number: '2M+', label: 'Transactions', icon: TrendingUp },
    { number: '100K+', label: 'Customers', icon: ShoppingBag },
  ]

  const roles = [
    {
      title: 'Farmers',
      icon: Tractor,
      benefits: [
        'Rent equipment affordably',
        'Get transportation services',
        'Sell directly to buyers',
        'Track earnings',
      ],
    },
    {
      title: 'Drivers',
      icon: Truck,
      benefits: [
        'Find consistent work',
        'Build reputation',
        'Easy booking system',
        'Quick payments',
      ],
    },
    {
      title: 'Equipment Owners',
      icon: Shield,
      benefits: [
        'Monetize equipment',
        'Reach more farmers',
        'Manage inventory',
        'Track usage',
      ],
    },
    {
      title: 'Buyers',
      icon: ShoppingBag,
      benefits: [
        'Fresh products',
        'Direct from farms',
        'Fair prices',
        'Quality assurance',
      ],
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Sign Up',
      description: 'Create your account in seconds with email or Google',
    },
    {
      step: 2,
      title: 'Choose Your Role',
      description: 'Select your role: Farmer, Driver, Owner, or Buyer',
    },
    {
      step: 3,
      title: 'Complete Profile',
      description: 'Add your details, location, and verification documents',
    },
    {
      step: 4,
      title: 'Start Earning',
      description: 'Begin connecting with opportunities in your area',
    },
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Farmer from Punjab',
      image: '👨‍🌾',
      text: 'AgriPool helped me save 40% on equipment costs. The rental process is so simple!',
      rating: 5,
    },
    {
      name: 'Priya Singh',
      role: 'Equipment Owner',
      image: '👩‍💼',
      text: 'My equipment is now generating passive income. Great platform for business growth.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      role: 'Driver',
      image: '👨‍💻',
      text: 'Consistent bookings and fair payments. AgriPool is changing transportation in agriculture.',
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
      title: 'How are disputes resolved?',
      content: 'Our dedicated support team reviews all disputes and ensures fair resolution for both parties with detailed transaction records.',
    },
    {
      title: 'Can I cancel a booking?',
      content: 'Yes, you can cancel bookings before 24 hours with full refund. After 24 hours, a cancellation fee may apply.',
    },
    {
      title: 'Are there any hidden charges?',
      content: 'No! All charges are transparent and shown upfront. You\'ll see the complete breakdown before confirming any transaction.',
    },
  ]

  return (
    <div className={`transition-colors duration-300 ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 px-4 overflow-hidden">
        {/* Aurora Background */}
        <div 
          className="absolute inset-[-30%] -z-10 animate-aurora opacity-50 blur-[90px] pointer-events-none" 
          style={{ background: 'conic-gradient(from 30deg at 40% 30%, rgba(58,124,255,0), rgba(58,124,255,0.25), rgba(36,208,255,0), rgba(16,200,166,0.25), rgba(58,124,255,0))' }}
        />
        <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-agri-blue/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-agri-green/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="z-10"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agri-cyan/30 bg-agri-cyan/10 mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse shadow-[0_0_10px_#10c8a6]" />
                <span className="text-sm font-medium text-agri-cyan">Now powered by Realtime Tech</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Next-gen <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-green via-agri-cyan to-agri-blue animate-pulse-soft">
                  Agriculture
                </span> <br/>
                Logistics.
              </motion.h1>
              
              <motion.p variants={itemVariants} className={`text-lg mb-10 max-w-xl leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                Connect farmers, drivers, and heavy machinery instantly. Built for scale with role-based dashboards, and seamless delivery tracking.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-4 rounded-xl font-bold bg-white text-[#02060f] hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300">
                  Start Platform
                </Link>
                <a href="#how-it-works" className="px-8 py-4 rounded-xl font-bold border border-agri-blue/30 bg-[#0c121e]/50 backdrop-blur-md text-white hover:bg-agri-blue/20 transition-all duration-300 flex items-center gap-2 group">
                  See how it works 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </motion.div>

            {/* Right: Visual Container (Infinite Scroll) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] w-full rounded-3xl border border-agri-blue/20 bg-[#080c14]/40 backdrop-blur-xl overflow-hidden shadow-[0_28px_60px_rgba(2,6,18,0.8)] group"
            >
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20" />
              
              {/* Floating Icons in bg */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 z-10 opacity-60"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-agri-green/20 to-transparent border border-agri-green/40 flex items-center justify-center backdrop-blur-md">
                  <Tractor size={32} className="text-agri-green" />
                </div>
              </motion.div>

              {/* Infinite Carousel */}
              <div className="absolute top-0 bottom-0 flex gap-4 items-center px-4 w-[200%] animate-scroll group-hover:[animation-play-state:paused]">
                {/* Mock agriculture images */}
                <div className="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src="https://images.unsplash.com/photo-1592982537447-6f2334208f34?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Tractor" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="text-agri-green text-xs font-bold mb-1">AVAILABLE NOW</div>
                    <div className="text-white font-semibold">John Deere 8R</div>
                  </div>
                </div>
                <div className="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src="https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Harvester" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="text-agri-cyan text-xs font-bold mb-1">EN ROUTE</div>
                    <div className="text-white font-semibold">Wheat Harvester</div>
                  </div>
                </div>
                <div className="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Farm" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="text-agri-green text-xs font-bold mb-1">COMPLETED</div>
                    <div className="text-white font-semibold">Crop Delivery</div>
                  </div>
                </div>
                {/* Duplicates for seamless loop */}
                <div className="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src="https://images.unsplash.com/photo-1592982537447-6f2334208f34?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Tractor" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="text-agri-green text-xs font-bold mb-1">AVAILABLE NOW</div>
                    <div className="text-white font-semibold">John Deere 8R</div>
                  </div>
                </div>
                <div className="w-[280px] h-[360px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src="https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Harvester" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="text-agri-cyan text-xs font-bold mb-1">EN ROUTE</div>
                    <div className="text-white font-semibold">Wheat Harvester</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className={`py-16 ${isDark ? 'bg-dark-card border-y border-dark-border' : 'bg-neutral-50 border-y border-neutral-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="text-center"
                >
                  <Icon className={`mx-auto mb-3 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} size={32} />
                  <p className={`text-3xl md:text-4xl font-bold mb-1 ${
                    isDark ? 'text-neutral-50' : 'text-neutral-900'
                  }`}>
                    {stat.number}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {stat.label}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}>
              Powerful Features
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Everything you need to succeed in modern agriculture
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card hoverable className="h-full p-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      isDark
                        ? 'bg-primary-900/30 text-primary-400'
                        : 'bg-primary-100 text-primary-600'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDark ? 'text-neutral-50' : 'text-neutral-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Roles Section */}
      <section className={`py-20 px-4 ${isDark ? 'bg-dark-card border-y border-dark-border' : 'bg-neutral-50 border-y border-neutral-200'}`}>
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}>
              For Everyone
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              AgriPool serves all participants in the agricultural ecosystem
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {roles.map((role, idx) => {
              const Icon = role.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card hoverable className="h-full p-6">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
                      isDark
                        ? 'bg-primary-900/30 text-primary-400'
                        : 'bg-primary-100 text-primary-600'
                    }`}>
                      <Icon size={28} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-4 ${
                      isDark ? 'text-neutral-50' : 'text-neutral-900'
                    }`}>
                      {role.title}
                    </h3>
                    <ul className="space-y-3">
                      {role.benefits.map((benefit, bidx) => (
                        <li key={bidx} className="flex items-start gap-2">
                          <Check size={18} className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                          <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}>
              How It Works
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Get started in just 4 simple steps
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {howItWorks.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <Card className="p-6 h-full">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 ${
                    isDark
                      ? 'bg-primary-900/30 text-primary-400'
                      : 'bg-primary-100 text-primary-600'
                  }`}>
                    {item.step}
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDark ? 'text-neutral-50' : 'text-neutral-900'
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {item.description}
                  </p>
                </Card>

                {idx < howItWorks.length - 1 && (
                  <div className={`hidden lg:flex absolute top-1/2 -right-3 items-center justify-center w-6 h-6 ${
                    isDark ? 'text-primary-400' : 'text-primary-600'
                  }`}>
                    <ArrowRight size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 px-4 ${isDark ? 'bg-dark-card border-y border-dark-border' : 'bg-neutral-50 border-y border-neutral-200'}`}>
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}>
              Loved by Users
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Hear from farmers and partners who are transforming their business
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <TestimonialsCarousel testimonials={testimonials} />
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Find answers to common questions
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Accordion items={faqItems.map(item => ({
              title: item.title,
              content: item.content,
            }))} />
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 ${isDark ? 'bg-dark-card border-y border-dark-border' : 'bg-neutral-50 border-y border-neutral-200'}`}>
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-neutral-50' : 'text-neutral-900'
          }`}>
            Ready to transform your agricultural business?
          </motion.h2>

          <motion.p variants={itemVariants} className={`text-lg mb-8 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Join thousands of farmers, drivers, and equipment owners already using AgriPool
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/register">
              <Button variant="primary" size="lg" className="gap-2">
                Get Started Now <ArrowRight size={20} />
              </Button>
            </a>
            <a href="mailto:support@agripool.com">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
