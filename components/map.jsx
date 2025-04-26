"use client"; // if you're using Next.js 13+/App Router

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const hospitals = [
  { id: 1, name: "Hospital A", lng: 73.0479, lat: 33.6844 }, // Example Islamabad
  { id: 2, name: "Hospital B", lng: 74.3587, lat: 31.5204 }, // Example Lahore
  // 👆 add your real hospital coordinates
];

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11", // or "dark-v10" etc
      center: [73.0479, 33.6844], // Initial center (Islamabad here)
      zoom: 5,
    });

    // Add hospitals as markers
    hospitals.forEach((hospital) => {
      new mapboxgl.Marker()
        .setLngLat([hospital.lng, hospital.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(hospital.name))
        .addTo(map.current);
    });
  }, []);

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />
    </div>
  );
};

export default Map;
