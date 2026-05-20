import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Map, ExternalLink } from 'lucide-react'
import PageHeader from '../components/shared/PageHeader'
import AgriMap from '../components/map/AgriMap'
import { Card, Button } from '../components/ui'
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
      
      <div className="flex justify-center pt-2">
        <Button
          onClick={() => window.open('https://www.google.com/maps/dir/?api=1', '_blank', 'noopener,noreferrer')}
          variant="primary"
          className="shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <Map size={18} />
          View in Google Maps
          <ExternalLink size={16} className="opacity-70" />
        </Button>
      </div>
    </motion.div>
  )
}

