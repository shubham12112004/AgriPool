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

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const OAuthCallback = lazy(() => import('./pages/auth/OAuthCallback'))
const RoleSelection = lazy(() => import('./pages/RoleSelection'))
const FarmerOnboarding = lazy(() => import('./pages/FarmerOnboarding'))
const DriverOnboarding = lazy(() => import('./pages/onboarding/DriverOnboarding'))
const EquipmentOwnerOnboarding = lazy(() => import('./pages/onboarding/EquipmentOwnerOnboarding'))
const BuyerOnboarding = lazy(() => import('./pages/onboarding/BuyerOnboarding'))
const BrowseEquipment = lazy(() => import('./pages/BrowseEquipment'))
const EquipmentDetail = lazy(() => import('./pages/EquipmentDetail'))
const DashboardRouter = lazy(() => import('./pages/dashboard/DashboardRouter'))
const FarmerDashboard = lazy(() => import('./pages/dashboard/FarmerDashboard'))
const DriverDashboard = lazy(() => import('./pages/dashboard/DriverDashboard'))
const EquipmentOwnerDashboard = lazy(() => import('./pages/dashboard/EquipmentOwnerDashboard'))
const BuyerDashboard = lazy(() => import('./pages/dashboard/BuyerDashboard'))
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'))
const BookingsList = lazy(() => import('./pages/bookings/BookingsList'))
const BookingDetail = lazy(() => import('./pages/bookings/BookingDetail'))
const CreateBooking = lazy(() => import('./pages/bookings/CreateBooking'))
const PaymentCheckout = lazy(() => import('./pages/payments/PaymentCheckout'))
const PaymentSuccess = lazy(() => import('./pages/payments/PaymentSuccess'))
const PaymentFailed = lazy(() => import('./pages/payments/PaymentFailed'))
const PaymentHistory = lazy(() => import('./pages/payments/PaymentHistory'))
const MapPage = lazy(() => import('./pages/MapPage'))
const Messages = lazy(() => import('./pages/Messages'))
const Settings = lazy(() => import('./pages/settings/Settings'))
const SavedPage = lazy(() => import('./pages/SavedPage'))
const BrowseProducts = lazy(() => import('./pages/marketplace/BrowseProducts'))
const ProductDetail = lazy(() => import('./pages/marketplace/ProductDetail'))
const ManageEquipment = lazy(() => import('./pages/equipment/ManageEquipment'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminVerification = lazy(() => import('./pages/admin/AdminVerification'))
const AdminModeration = lazy(() => import('./pages/admin/AdminModeration'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'))

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
              <Route path="/equipment" element={<BrowseEquipment />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />
              <Route path="/role-selection" element={<RoleSelection />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
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
