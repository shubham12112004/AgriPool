import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'
import AgriMap from '../components/map/AgriMap'
import { Card } from '../components/ui'
import { bookingService } from '../services'

export default function MapPage() {
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    bookingService
      .getMapMarkers()
      .then((res) => setMarkers(res.data || []))
      .catch(() =>
        setMarkers([
          { position: [30.91, 75.85], popup: '<b>Driver</b><br/>2 km · Available' },
          { position: [30.88, 75.82], popup: '<b>Tractor</b><br/>₹800/day' },
          { position: [30.93, 75.79], popup: '<b>Farm pickup</b><br/>Active booking' },
        ])
      )
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Live fleet map"
        subtitle="OpenStreetMap + Leaflet — drivers, equipment, and active bookings"
      />
      <Card className="p-2 overflow-hidden">
        <AgriMap height="min(70vh, 560px)" markers={markers} zoom={12} />
      </Card>
    </motion.div>
  )
}
