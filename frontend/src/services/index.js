import apiClient from './api'

export const authService = {
  login: (email, password, turnstileToken) =>
    apiClient.post('/auth/login', {
      email,
      password,
      turnstile_token: turnstileToken,
    }),

  register: (data) =>
    apiClient.post('/auth/register', {
      ...data,
      turnstile_token: data.turnstile_token,
    }),

  verifyTurnstile: (turnstileToken) =>
    apiClient.post('/auth/turnstile-verify', { turnstile_token: turnstileToken }),

  exchangeOAuthCode: (code) =>
    apiClient.post('/auth/oauth/exchange', { code }),
  
  forgotPassword: (email) => 
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, password) => 
    apiClient.post('/auth/reset-password', { token, password }),
  
  verifyEmail: (token) => 
    apiClient.post('/auth/verify-email', { token }),
  
  googleAuth: (token) => 
    apiClient.post('/auth/google', { token }),
  
  logout: () => {
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user')
  },
  
  getCurrentUser: () => 
    apiClient.get('/auth/me'),
}

export const userService = {
  getProfile: (userId) => 
    apiClient.get(`/users/${userId}`),
  
  updateProfile: (userId, data) => 
    apiClient.put(`/users/${userId}`, data),
  
  uploadAvatar: (userId, formData) => 
    apiClient.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  completeOnboarding: (userId, data) => 
    apiClient.post(`/users/${userId}/onboarding`, data),
  
  updateSettings: (userId, settings) => 
    apiClient.put(`/users/${userId}/settings`, settings),
}

export const bookingService = {
  getBookings: (params) => 
    apiClient.get('/bookings', { params }),
  
  getBooking: (bookingId) => 
    apiClient.get(`/bookings/${bookingId}`),
  
  createBooking: (data) => 
    apiClient.post('/bookings', data),
  
  updateBooking: (bookingId, data) => 
    apiClient.put(`/bookings/${bookingId}`, data),
  
  cancelBooking: (bookingId) => 
    apiClient.post(`/bookings/${bookingId}/cancel`),
  
  acceptBooking: (bookingId) => 
    apiClient.post(`/bookings/${bookingId}/accept`),
  
  rejectBooking: (bookingId) => 
    apiClient.post(`/bookings/${bookingId}/reject`),

  getMapMarkers: () =>
    apiClient.get('/bookings/map-markers'),
  
  updateStatus: (bookingId, status, extraData = {}) => 
    apiClient.put(`/bookings/${bookingId}/status`, { status, ...extraData }),
}

export const chatService = {
  getBookingConversation: (bookingId) =>
    apiClient.get(`/bookings/${bookingId}/conversation`),

  sendConversationMessage: (conversationId, data) =>
    apiClient.post(`/conversations/${conversationId}/messages`, data),
}

export const assistantService = {
  chat: (message, context = {}) =>
    apiClient.post('/assistant/chat', { message, context }),
}

export const equipmentService = {
  getEquipment: (params) => 
    apiClient.get('/equipment', { params }),
  
  getEquipmentById: (equipmentId) => 
    apiClient.get(`/equipment/${equipmentId}`),
  
  createEquipment: (data) => 
    apiClient.post('/equipment', data),
  
  updateEquipment: (equipmentId, data) => 
    apiClient.put(`/equipment/${equipmentId}`, data),
  
  deleteEquipment: (equipmentId) => 
    apiClient.delete(`/equipment/${equipmentId}`),
  
  uploadImage: (equipmentId, formData) => 
    apiClient.post(`/equipment/${equipmentId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const paymentService = {
  createOrder: (data) => 
    apiClient.post('/payments/create-order', data),
  
  demoComplete: (data) =>
    apiClient.post('/payments/demo-complete', data),

  verifyPayment: (data) => 
    apiClient.post('/payments/verify', data),
  
  getPaymentHistory: (params) => 
    apiClient.get('/payments/history', { params }),

  getPayment: (paymentId) =>
    apiClient.get(`/payments/${paymentId}`),
  
  getInvoice: (paymentId) => 
    apiClient.get(`/payments/${paymentId}/receipt`),
}

export const vehicleService = {
  getVehicle: () => apiClient.get('/vehicle'),
  registerVehicle: (data) => apiClient.post('/vehicle', data),
  updateVehicle: (data) => apiClient.put('/vehicle', data),
}

export const dashboardService = {
  getStats: () => apiClient.get('/dashboard'),
}

export const adminService = {
  getDashboardData: () => apiClient.get('/admin/dashboard-data'),
  getAiAdvice: () => apiClient.get('/admin/ai-advice'),
  broadcastNotification: (data) => apiClient.post('/admin/broadcast-notification', data),
}

export const authProfileService = {
  updateRole: (role) => apiClient.patch('/user/role', { role }),
}

export const notificationService = {
  getNotifications: (params) => 
    apiClient.get('/notifications', { params }),
  
  markAsRead: (notificationId) => 
    apiClient.put(`/notifications/${notificationId}/read`),
  
  markAllAsRead: () => 
    apiClient.post('/notifications/mark-all-read'),
  
  deleteNotification: (notificationId) => 
    apiClient.delete(`/notifications/${notificationId}`),
}
