import {
  LayoutDashboard,
  Calendar,
  Map,
  Tractor,
  Truck,
  ShoppingBag,
  CreditCard,
  Settings,
  Bell,
  Users,
  BarChart3,
  Package,
  History,
  Heart,
  Shield,
} from 'lucide-react'
import { ROLES } from './roles'

const icon = (Icon) => Icon

export const publicNavLinks = [
  { label: 'nav.home', href: '/' },
  { label: 'nav.features', href: '/#features' },
  { label: 'nav.howItWorks', href: '/#how-it-works' },
  { label: 'nav.faq', href: '/#faq' },
]

export const dashboardNavByRole = {
  [ROLES.FARMER]: [
    { label: 'nav.overview', path: '/dashboard/farmer', icon: icon(LayoutDashboard) },
    { label: 'nav.bookings', path: '/bookings', icon: icon(Calendar) },
    { label: 'nav.map', path: '/map', icon: icon(Map) },
    { label: 'nav.equipment', path: '/equipment', icon: icon(Tractor) },
    { label: 'nav.payments', path: '/payments/history', icon: icon(CreditCard) },
    { label: 'nav.saved', path: '/saved', icon: icon(Heart) },
    { label: 'nav.settings', path: '/settings', icon: icon(Settings) },
  ],
  [ROLES.DRIVER]: [
    { label: 'nav.overview', path: '/dashboard/driver', icon: icon(LayoutDashboard) },
    { label: 'nav.requests', path: '/bookings?tab=requests', icon: icon(Truck) },
    { label: 'nav.map', path: '/map', icon: icon(Map) },
    { label: 'nav.vehicle', path: '/settings?tab=vehicle', icon: icon(Truck) },
    { label: 'nav.earnings', path: '/payments/history', icon: icon(CreditCard) },
    { label: 'nav.settings', path: '/settings', icon: icon(Settings) },
  ],
  [ROLES.EQUIPMENT_OWNER]: [
    { label: 'nav.overview', path: '/dashboard/equipment-owner', icon: icon(LayoutDashboard) },
    { label: 'nav.myEquipment', path: '/equipment/manage', icon: icon(Tractor) },
    { label: 'nav.rentals', path: '/bookings', icon: icon(Calendar) },
    { label: 'nav.earnings', path: '/payments/history', icon: icon(BarChart3) },
    { label: 'nav.settings', path: '/settings', icon: icon(Settings) },
  ],
  [ROLES.BUYER]: [
    { label: 'nav.overview', path: '/dashboard/buyer', icon: icon(LayoutDashboard) },
    { label: 'nav.marketplace', path: '/marketplace', icon: icon(ShoppingBag) },
    { label: 'nav.orders', path: '/bookings', icon: icon(Package) },
    { label: 'nav.saved', path: '/saved', icon: icon(Heart) },
    { label: 'nav.payments', path: '/payments/history', icon: icon(CreditCard) },
    { label: 'nav.settings', path: '/settings', icon: icon(Settings) },
  ],
  [ROLES.ADMIN]: [
    { label: 'nav.overview', path: '/dashboard/admin', icon: icon(LayoutDashboard) },
    { label: 'nav.users', path: '/admin/users', icon: icon(Users) },
    { label: 'nav.verification', path: '/admin/verification', icon: icon(Shield) },
    { label: 'nav.moderation', path: '/admin/moderation', icon: icon(Tractor) },
    { label: 'nav.analytics', path: '/admin/analytics', icon: icon(BarChart3) },
    { label: 'nav.notifications', path: '/admin/notifications', icon: icon(Bell) },
    { label: 'nav.settings', path: '/settings', icon: icon(Settings) },
  ],
}

export function getDashboardNav(role) {
  return dashboardNavByRole[role] || dashboardNavByRole[ROLES.FARMER]
}
