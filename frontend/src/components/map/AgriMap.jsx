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
    // Use OpenStreetMap tiles by default (more reliable without API keys)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
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

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          map.invalidateSize({ animate: false })
        })
      : null

    if (resizeObserver) {
      resizeObserver.observe(containerRef.current)
    }

    const onWindowResize = () => map.invalidateSize({ animate: false })
    window.addEventListener('resize', onWindowResize)

    const timeouts = [
      setTimeout(() => map.invalidateSize({ animate: false }), 100),
      setTimeout(() => map.invalidateSize({ animate: false }), 300),
      setTimeout(() => map.invalidateSize({ animate: false }), 700),
    ]

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', onWindowResize)
      timeouts.forEach(clearTimeout)
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
    map.invalidateSize({ animate: false })
  }, [markers])

  return (
    <div
      className={`rounded-2xl overflow-hidden border shadow-md ${
        isDark ? 'border-dark-border' : 'border-neutral-200'
      } ${className}`}
      style={{ height, minHeight: 0, width: '100%' }}
    >
      <div ref={containerRef} className="block w-full h-full min-h-0 z-0" />
    </div>
  )
}
