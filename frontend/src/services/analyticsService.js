import apiClient from './api'

export const analyticsService = {
  async getRevenueChart(period = 30) {
    try {
      const response = await apiClient.get('/analytics/revenue-chart', {
        params: { period }
      })
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch revenue chart:', error)
      throw error
    }
  },

  async getStats() {
    try {
      const response = await apiClient.get('/analytics/stats')
      return response.stats || {}
    } catch (error) {
      console.error('Failed to fetch analytics stats:', error)
      throw error
    }
  }
}

export default analyticsService
