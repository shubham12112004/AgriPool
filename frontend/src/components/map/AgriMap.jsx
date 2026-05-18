import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../../hooks/useTheme'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const defaultCenter = [30.9, 75.8]

export default function AgriMap({
  center = defaultCenter,
  zoom = 11,
  height = '400px',
  markers = [],
  className = '',
  onLocationClick = null,
}) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { zoomControl: true }).setView(center, zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    // Add click handler for location selection
    if (onLocationClick) {
      map.on('click', (e) => {
        onLocationClick([e.latlng.lat, e.latlng.lng])
      })
      if (containerRef.current) {
        containerRef.current.style.cursor = 'crosshair'
      }
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [onLocationClick])

  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer)
    })
    markers.forEach((m) => {
      const marker = L.marker(m.position).addTo(map)
      if (m.popup) marker.bindPopup(m.popup)
    })
    if (markers.length) {
      const group = L.featureGroup(markers.map((m) => L.marker(m.position)))
      map.fitBounds(group.getBounds().pad(0.2))
    }
  }, [markers])

  return (
    <div
      className={`rounded-2xl overflow-hidden border shadow-md ${
        isDark ? 'border-dark-border' : 'border-neutral-200'
      } ${className}`}
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full z-0" />
    </div>
  )
}
