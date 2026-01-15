'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function SimpleRouteMap({ pickup, dropoff }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || !pickup || !dropoff) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [pickup.geometry.coordinates[0], pickup.geometry.coordinates[1]],
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Add pickup marker with custom styling
      const pickupEl = document.createElement('div');
      pickupEl.className = 'pickup-marker';
      pickupEl.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 bg-[#3A0A21] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#3A0A21] text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
            Pickup
          </div>
        </div>
      `;

      new mapboxgl.Marker({ element: pickupEl })
        .setLngLat([pickup.geometry.coordinates[0], pickup.geometry.coordinates[1]])
        .addTo(map.current);

      // Add dropoff marker with custom styling
      const dropoffEl = document.createElement('div');
      dropoffEl.className = 'dropoff-marker';
      dropoffEl.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
            Dropoff
          </div>
        </div>
      `;

      new mapboxgl.Marker({ element: dropoffEl })
        .setLngLat([dropoff.geometry.coordinates[0], dropoff.geometry.coordinates[1]])
        .addTo(map.current);

      // Draw route line
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.geometry.coordinates[0]},${pickup.geometry.coordinates[1]};${dropoff.geometry.coordinates[0]},${dropoff.geometry.coordinates[1]}?` +
        new URLSearchParams({
          access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
          geometries: 'geojson',
          overview: 'full'
        })
      )
      .then(response => response.json())
      .then(data => {
        if (data.routes && data.routes[0]) {
          const route = data.routes[0].geometry;
          
          if (!map.current.getSource('route')) {
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route
              }
            });
          }

          if (!map.current.getLayer('route')) {
            map.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3A0A21',
                'line-width': 4,
                'line-opacity': 0.7
              }
            });
          }

          // Fit map to show both markers and route
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([pickup.geometry.coordinates[0], pickup.geometry.coordinates[1]]);
          bounds.extend([dropoff.geometry.coordinates[0], dropoff.geometry.coordinates[1]]);
          map.current.fitBounds(bounds, {
            padding: 50,
            duration: 1000
          });
        }
      });
    });

    return () => map.current?.remove();
  }, [pickup, dropoff]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-xl" />
      <style jsx>{`
        .pickup-marker .absolute {
          top: -30px;
        }
        .dropoff-marker .absolute {
          top: -30px;
        }
      `}</style>
    </div>
  );
}