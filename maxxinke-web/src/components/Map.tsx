'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  center: [number, number]
  zoom: number
  markers: Array<{
    position: [number, number]
    title: string
    content: string
  }>
}

const Map = ({ center, zoom, markers }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // 初始化地图
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom)

      // 添加地图图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)

      // 添加标记
      markers.forEach(marker => {
        const customIcon = L.icon({
          iconUrl: '/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })

        L.marker(marker.position, { icon: customIcon })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${marker.title}</h3>
              <p style="margin: 0;">${marker.content}</p>
            </div>
          `)
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [center, zoom, markers])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-96 rounded-lg"
    />
  )
}

export default Map 