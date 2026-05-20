import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../hooks/useTheme'
import { Button, Input, Select, Card, Tabs, Alert, Modal } from '../components/ui'
import { MapPin, Upload, Smartphone, CheckCircle, X } from 'lucide-react'
import AgriMap from '../components/map/AgriMap'
import { useAuthStore, getDashboardPathForRole } from '../store/authStore'
import { ROLES } from '../config/roles'
import { authProfileService, userService } from '../services'

export default function FarmerOnboarding() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const setRole = useAuthStore((s) => s.setRole)
  const setAuth = useAuthStore((s) => s.setAuth)
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const handleCompleteOnboarding = async () => {
    setLoading(true)
    try {
      await authProfileService.updateRole('farmer').catch(() => {})
      setRole(ROLES.FARMER)
      if (user) {
        setAuth({ user: { ...user, role: 'farmer' }, role: ROLES.FARMER })
      }
      toast.success('Profile completed successfully!')
      navigate(getDashboardPathForRole(ROLES.FARMER))
    } catch (err) {
      setRole(ROLES.FARMER)
      toast.success('Welcome to AgriPool!')
      navigate(getDashboardPathForRole(ROLES.FARMER))
    } finally {
      setLoading(false)
    }
  }
  const [formData, setFormData] = useState({
    farmName: '',
    state: '',
    district: '',
    area: '',
    cropType: '',
    profileImage: null,
  })
  const [completedSteps, setCompletedSteps] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }))
    }
  }

  const handleStepComplete = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const steps = [
    {
      title: 'Farm Details',
      description: 'Tell us about your farm',
      icon: '🌾',
      content: (
        <div className="space-y-4">
          <Input
            label="Farm Name"
            name="farmName"
            value={formData.farmName}
            onChange={handleInputChange}
            placeholder="e.g., Green Valley Farm"
            required
          />

          <Select
            label="State"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            options={[
              { label: 'Select State', value: '' },
              { label: 'Punjab', value: 'punjab' },
              { label: 'Haryana', value: 'haryana' },
              { label: 'Uttar Pradesh', value: 'uttar-pradesh' },
              { label: 'Rajasthan', value: 'rajasthan' },
            ]}
            required
          />

          <Select
            label="District"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            options={[
              { label: 'Select District', value: '' },
              { label: 'Ludhiana', value: 'ludhiana' },
              { label: 'Amritsar', value: 'amritsar' },
              { label: 'Patiala', value: 'patiala' },
            ]}
            required
          />

          <Input
            label="Farm Area (in acres)"
            name="area"
            type="number"
            value={formData.area}
            onChange={handleInputChange}
            placeholder="e.g., 25"
            required
          />
        </div>
      ),
    },
    {
      title: 'Crop Type',
      description: 'What do you grow?',
      icon: '🌱',
      content: (
        <div className="space-y-4">
          <Select
            label="Primary Crop"
            name="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
            options={[
              { label: 'Select Crop', value: '' },
              { label: 'Wheat', value: 'wheat' },
              { label: 'Rice', value: 'rice' },
              { label: 'Cotton', value: 'cotton' },
              { label: 'Sugarcane', value: 'sugarcane' },
              { label: 'Corn', value: 'corn' },
              { label: 'Vegetables', value: 'vegetables' },
            ]}
            required
          />

          <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <p className={`text-sm ${isDark ? 'text-primary-300' : 'text-primary-800'}`}>
              💡 Knowing your crop type helps us recommend the right equipment and connect you with suitable buyers.
            </p>
          </Card>
        </div>
      ),
    },
    {
      title: 'Location Verification',
      description: 'Verify your farm location',
      icon: '📍',
      content: (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-dark-border shadow-md" style={{ height: '400px' }}>
            <AgriMap 
              height="100%" 
              markers={selectedLocation ? [{ position: selectedLocation, popup: '<b>Your Farm</b>' }] : []} 
              zoom={12}
              onLocationClick={setSelectedLocation}
            />
          </div>
          <Button variant="primary" size="md" fullWidth onClick={() => setShowMapModal(true)}>
            Open Fullscreen Map
          </Button>
          {selectedLocation && (
            <Card className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                <CheckCircle size={18} />
                Location selected: {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      title: 'Profile Photo',
      description: 'Add your photo',
      icon: '📸',
      content: (
        <div className="space-y-4">
          <Card className="p-6 border-2 border-dashed border-neutral-300 dark:border-dark-border">
            <label className="cursor-pointer">
              <div className="text-center">
                <Upload size={48} className={`mx-auto mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                <p className={`font-semibold mb-1 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                  Click to upload your photo
                </p>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  PNG, JPG up to 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profileImage')}
                className="hidden"
              />
            </label>
          </Card>

          {formData.profileImage && (
            <Card className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                <CheckCircle size={18} />
                {formData.profileImage.name}
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      title: 'Complete!',
      description: 'All set',
      icon: '✅',
      content: (
        <div className="text-center space-y-6 py-8">
          <div className="text-6xl">🎉</div>
          <div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
              Welcome to AgriPool!
            </h3>
            <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Your profile is ready. Let's start exploring opportunities!
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCompleteOnboarding}
            loading={loading}
          >
            Go to Dashboard
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-dark-bg' : 'bg-neutral-50'}`}>
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
            Complete Your Profile
          </h1>
          <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Step {activeStep + 1} of {steps.length}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            {steps.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  idx <= activeStep
                    ? 'bg-primary-600 dark:bg-primary-400'
                    : isDark
                    ? 'bg-dark-border'
                    : 'bg-neutral-200'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <Card className="p-8">
            {/* Step Icon and Title */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{steps[activeStep].icon}</div>
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                {steps[activeStep].title}
              </h2>
              <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {steps[activeStep].description}
              </p>
            </div>

            {/* Step Content */}
            {steps[activeStep].content}
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        {activeStep < steps.length - 1 && (
          <div className="flex gap-4">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              disabled={activeStep === 0}
              onClick={() => setActiveStep(activeStep - 1)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => handleStepComplete(activeStep)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Fullscreen Map Modal */}
        {showMapModal && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border p-4 flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
                Select Your Farm Location
              </h2>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-dark-border rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              <div className="absolute inset-0">
                <AgriMap 
                  height="100%" 
                  markers={selectedLocation ? [{ position: selectedLocation, popup: '<b>Your Farm</b>' }] : []} 
                  zoom={11}
                  onLocationClick={setSelectedLocation}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-dark-card border-t border-neutral-200 dark:border-dark-border p-4 flex gap-4">
              <Button variant="secondary" size="lg" fullWidth onClick={() => setShowMapModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                disabled={!selectedLocation}
                onClick={() => setShowMapModal(false)}
              >
                Confirm Location
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
