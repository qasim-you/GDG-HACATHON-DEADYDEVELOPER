"use client"

import { useState, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card } from "@/components/ui/card"

// Initialize Mapbox with your access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function DoctorMap({ doctors }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-74.006)
  const [lat, setLat] = useState(40.7128)
  const [zoom, setZoom] = useState(11)

  useEffect(() => {
    // Initialize map only once
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right",
    )

    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          setLng(longitude)
          setLat(latitude)
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            essential: true,
          })
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    }

    // Clean up on unmount
    return () => map.current.remove()
  }, [])

  // Add doctor markers when doctors data changes
  useEffect(() => {
    if (!map.current || !doctors || doctors.length === 0) return

    // Remove existing markers
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker")
    existingMarkers.forEach((marker) => marker.remove())

    // Add markers for each doctor
    doctors.forEach((doctor) => {
      if (!doctor.location || !doctor.location.latitude || !doctor.location.longitude) return

      // Create custom marker element
      const markerElement = document.createElement("div")
      markerElement.className = "doctor-marker"
      markerElement.style.width = "30px"
      markerElement.style.height = "30px"
      markerElement.style.borderRadius = "50%"
      markerElement.style.backgroundColor = "#10b981"
      markerElement.style.border = "3px solid white"
      markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"
      markerElement.style.cursor = "pointer"

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${doctor.name}</h3>
          <p style="color: #10b981; margin-bottom: 5px;">${doctor.specialty}</p>
          <p style="font-size: 12px; color: #666;">${doctor.address || doctor.city}</p>
          <a href="/doctors/${doctor.id}" style="color: #10b981; font-size: 12px; text-decoration: underline;">View Profile</a>
        </div>
      `)

      // Add marker to map
      new mapboxgl.Marker(markerElement)
        .setLngLat([doctor.location.longitude, doctor.location.latitude])
        .setPopup(popup)
        .addTo(map.current)
    })

    // Fit map to show all markers if there are multiple doctors
    if (doctors.length > 1) {
      const bounds = new mapboxgl.LngLatBounds()
      doctors.forEach((doctor) => {
        if (doctor.location && doctor.location.latitude && doctor.location.longitude) {
          bounds.extend([doctor.location.longitude, doctor.location.latitude])
        }
      })
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }, [doctors])

  return (
    <Card className="overflow-hidden">
      <div ref={mapContainer} className="h-[500px] w-full" />
    </Card>
  )
}
