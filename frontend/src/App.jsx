import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import OnboardingLayout from './layouts/OnboardingLayout'
import ProtectedRoute from './components/routing/ProtectedRoute'
import { Spinner } from './components/ui'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import OAuthCallback from './pages/auth/OAuthCallback'
import RoleSelection from './pages/RoleSelection'
import FarmerOnboarding from './pages/FarmerOnboarding'
import DriverOnboarding from './pages/onboarding/DriverOnboarding'
import EquipmentOwnerOnboarding from './pages/onboarding/EquipmentOwnerOnboarding'
import BuyerOnboarding from './pages/onboarding/BuyerOnboarding'
import BrowseEquipment from './pages/BrowseEquipment'
import EquipmentDetail from './pages/EquipmentDetail'
import DashboardRouter from './pages/dashboard/DashboardRouter'
import FarmerDashboard from './pages/dashboard/FarmerDashboard'
import DriverDashboard from './pages/dashboard/DriverDashboard'
import EquipmentOwnerDashboard from './pages/dashboard/EquipmentOwnerDashboard'
import BuyerDashboard from './pages/dashboard/BuyerDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import BookingsList from './pages/bookings/BookingsList'
import BookingDetail from './pages/bookings/BookingDetail'
import CreateBooking from './pages/bookings/CreateBooking'
import PaymentCheckout from './pages/payments/PaymentCheckout'
import PaymentSuccess from './pages/payments/PaymentSuccess'
import PaymentFailed from './pages/payments/PaymentFailed'
import PaymentHistory from './pages/payments/PaymentHistory'
import MapPage from './pages/MapPage'
import Messages from './pages/Messages'
import Settings from './pages/settings/Settings'
import Profile from './pages/Profile'
import SavedPage from './pages/SavedPage'
import BrowseProducts from './pages/marketplace/BrowseProducts'
import ProductDetail from './pages/marketplace/ProductDetail'
import ManageEquipment from './pages/equipment/ManageEquipment'
import AdminUsers from './pages/admin/AdminUsers'
import AdminVerification from './pages/admin/AdminVerification'
import AdminModeration from './pages/admin/AdminModeration'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminNotifications from './pages/admin/AdminNotifications'

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/role-selection" element={<RoleSelection />} />
            </Route>

            <Route path="/equipment" element={<BrowseEquipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/oauth/callback" element={<OAuthCallback />} />
            </Route>

            <Route element={<OnboardingLayout />}>
              <Route path="/onboarding/farmer" element={<FarmerOnboarding />} />
              <Route path="/farmer/onboarding" element={<Navigate to="/onboarding/farmer" replace />} />
              <Route path="/onboarding/driver" element={<DriverOnboarding />} />
              <Route path="/onboarding/equipment-owner" element={<EquipmentOwnerOnboarding />} />
              <Route path="/onboarding/buyer" element={<BuyerOnboarding />} />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
              <Route path="/dashboard/driver" element={<DriverDashboard />} />
              <Route path="/dashboard/equipment-owner" element={<EquipmentOwnerDashboard />} />
              <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/bookings" element={<BookingsList />} />
              <Route path="/bookings/new" element={<CreateBooking />} />
              <Route path="/bookings/:id" element={<BookingDetail />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/marketplace" element={<BrowseProducts />} />
              <Route path="/marketplace/:id" element={<ProductDetail />} />
              <Route path="/equipment/manage" element={<ManageEquipment />} />
              <Route path="/payments/checkout" element={<PaymentCheckout />} />
              <Route path="/payments/success" element={<PaymentSuccess />} />
              <Route path="/payments/failed" element={<PaymentFailed />} />
              <Route path="/payments/history" element={<PaymentHistory />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/verification" element={<AdminVerification />} />
              <Route path="/admin/moderation" element={<AdminModeration />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  )
}
