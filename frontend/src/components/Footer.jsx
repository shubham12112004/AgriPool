import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { Share2, MessageCircle, Globe, Link2, Mail, Phone, MapPin } from 'lucide-react'
import AgriPoolLogo from './ui/AgriPoolLogo'

export default function Footer() {
  const { t } = useLanguage()
  const { isDark } = useTheme()

  const footerLinks = {
    product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Security', href: '/security' },
      { label: 'Status', href: '/status' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Licenses', href: '/licenses' },
    ],
  }

  const socialLinks = [
    { icon: Share2, href: 'https://facebook.com', label: 'Facebook' },
    { icon: MessageCircle, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Globe, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Link2, href: 'https://linkedin.com', label: 'LinkedIn' },
  ]

  return (
    <footer className={`transition-colors duration-300 ${
      isDark
        ? 'bg-dark-bg border-t border-dark-border'
        : 'bg-neutral-50 border-t border-neutral-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className={`flex items-center gap-2 font-bold text-xl mb-4 ${
                isDark ? 'text-primary-400' : 'text-primary-600'
              }`}
            >
              <AgriPoolLogo className="w-8 h-8" iconSizeMultiplier={0.8} />
              AgriPool
            </Link>
            <p className={`mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Connecting farmers with equipment rental, transportation, and market opportunities.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'bg-dark-card hover:bg-primary-900 text-neutral-400 hover:text-primary-400'
                        : 'bg-white hover:bg-primary-50 text-neutral-600 hover:text-primary-600 border border-neutral-200'
                    }`}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className={`font-semibold mb-4 capitalize ${
                isDark ? 'text-neutral-50' : 'text-neutral-900'
              }`}>
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={`text-sm transition-colors ${
                        isDark
                          ? 'text-neutral-400 hover:text-primary-400'
                          : 'text-neutral-600 hover:text-primary-600'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={`h-px mb-8 ${isDark ? 'bg-dark-border' : 'bg-neutral-200'}`} />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Copyright */}
          <p className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
            &copy; 2026 AgriPool. All rights reserved.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-6 text-sm">
            <a
              href="mailto:raoshubham192@gmail.com"
              className={`flex items-center gap-2 transition-colors ${
                isDark
                  ? 'text-neutral-400 hover:text-primary-400'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              <Mail size={16} />
              raoshubham192@gmail.com
            </a>
            <a
              href="tel:+911234567890"
              className={`flex items-center gap-2 transition-colors ${
                isDark
                  ? 'text-neutral-400 hover:text-primary-400'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              <Phone size={16} />
              +91 123-456-7890
            </a>
            <div className={`flex items-center gap-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              <MapPin size={16} />
              India
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
