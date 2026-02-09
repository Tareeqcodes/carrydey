'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Clock, Navigation2 } from 'lucide-react';

export default function SimpleRouteMap({ pickup, dropoff }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    if (!mapContainer.current || !pickup || !dropoff) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Initialize map with dark style like Uber
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [pickup.geometry.coordinates[0], pickup.geometry.coordinates[1]],
      zoom: 13,
      pitch: 45, // 3D tilt for modern look
      bearing: 0,
      antialias: true,
    });

    // Minimal navigation controls
    const nav = new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true,
      visualizePitch: false
    });
    map.current.addControl(nav, 'bottom-right');

    map.current.on('load', () => {
      setMapLoaded(true);

      // Create modern pickup marker
      const pickupEl = document.createElement('div');
      pickupEl.className = 'modern-marker-pickup';
      pickupEl.innerHTML = `
        <div class="marker-modern">
          <div class="marker-dot pickup-dot"></div>
          <div class="marker-stem pickup-stem"></div>
        </div>
      `;

      new mapboxgl.Marker({ 
        element: pickupEl,
        anchor: 'bottom'
      })
        .setLngLat([pickup.geometry.coordinates[0], pickup.geometry.coordinates[1]])
        .addTo(map.current);

      // Create modern dropoff marker
      const dropoffEl = document.createElement('div');
      dropoffEl.className = 'modern-marker-dropoff';
      dropoffEl.innerHTML = `
        <div class="marker-modern">
          <div class="marker-square">
            <div class="marker-square-inner"></div>
          </div>
          <div class="marker-stem dropoff-stem"></div>
        </div>
      `;

      new mapboxgl.Marker({ 
        element: dropoffEl,
        anchor: 'bottom'
      })
        .setLngLat([dropoff.geometry.coordinates[0], dropoff.geometry.coordinates[1]])
        .addTo(map.current);

      // Fetch and draw route
      fetchAndDrawRoute();
    });

    const fetchAndDrawRoute = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.geometry.coordinates[0]},${pickup.geometry.coordinates[1]};${dropoff.geometry.coordinates[0]},${dropoff.geometry.coordinates[1]}?` +
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            geometries: 'geojson',
            overview: 'full',
            steps: 'true',
          })
        );

        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const geometry = route.geometry;
          
          // Store route info for display
          setRouteInfo({
            distance: (route.distance / 1000).toFixed(1),
            duration: Math.round(route.duration / 60)
          });

          // Add route glow effect (outer layer)
          if (!map.current.getSource('route-glow')) {
            map.current.addSource('route-glow', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: geometry
              }
            });

            map.current.addLayer({
              id: 'route-glow',
              type: 'line',
              source: 'route-glow',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3A0A21',
                'line-width': 12,
                'line-opacity': 0.3,
                'line-blur': 8
              }
            });
          }

          // Add main route line (thick, solid)
          if (!map.current.getSource('route')) {
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: geometry
              }
            });

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
                'line-width': 6,
                'line-opacity': 1
              }
            });
          }

          // Add animated border/edge highlight
          if (!map.current.getSource('route-border')) {
            map.current.addSource('route-border', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: geometry
              }
            });

            map.current.addLayer({
              id: 'route-border',
              type: 'line',
              source: 'route-border',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#FFFFFF',
                'line-width': 1.5,
                'line-opacity': 0.6
              }
            });
          }

          // Fit map to route with generous padding
          const bounds = new mapboxgl.LngLatBounds();
          geometry.coordinates.forEach(coord => bounds.extend(coord));
          
          map.current.fitBounds(bounds, {
            padding: { top: 120, bottom: 180, left: 80, right: 80 },
            duration: 1500,
            maxZoom: 14.5
          });
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [pickup, dropoff]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Route Info Overlay - Top */}
      {mapLoaded && routeInfo && (
        <div className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-2xl p-2 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-[#3A0A21] rounded-full flex items-center justify-center">
                <Navigation2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Distance</p>
                <p className="text-sm font-bold text-gray-900">{routeInfo.distance} km</p>
              </div>
            </div>
            
            <div className="w-px h-10 bg-gray-200"></div>
            
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Duration</p>
                <p className="text-sm font-bold text-gray-900">{routeInfo.duration} min</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Details Overlay - Bottom */}
      {mapLoaded && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">
          {/* Pickup */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#3A0A21] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Pickup
                </p>
                <p className="text-xs font-medium text-gray-900 leading-tight">
                  {pickup?.place_name || 'Pickup location'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Dropoff */}
          <div className="p-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Dropoff
                </p>
                <p className="text-xs font-medium text-gray-900 leading-tight">
                  {dropoff?.place_name || 'Dropoff location'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3A0A21] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-semibold text-lg">Loading route...</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Modern Marker Styles - Uber/InDrive like */
        .marker-modern {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Pickup Marker - Circle with stem */
        .marker-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: relative;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .pickup-dot {
          background: #3A0A21;
          border: 3px solid white;
        }

        /* Dropoff Marker - Square with stem */
        .marker-square {
          width: 20px;
          height: 20px;
          background: #EF4444;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 2;
        }

        .marker-square-inner {
          width: 8px;
          height: 8px;
          background: white;
        }

        /* Marker Stem */
        .marker-stem {
          width: 2px;
          height: 16px;
          position: relative;
          z-index: 1;
          margin-top: -2px;
        }

        .pickup-stem {
          background: linear-gradient(to bottom, #3A0A21, transparent);
        }

        .dropoff-stem {
          background: linear-gradient(to bottom, #EF4444, transparent);
        }

        /* Mapbox controls - minimal styling */
        .mapboxgl-ctrl-group {
          background: rgba(255, 255, 255, 0.95) !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important;
          border-radius: 12px !important;
          border: none !important;
        }

        .mapboxgl-ctrl-group button {
          width: 36px !important;
          height: 36px !important;
          border: none !important;
        }

        .mapboxgl-ctrl-group button:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }

        /* Remove Mapbox logo and attribution for cleaner look */
        .mapboxgl-ctrl-bottom-left,
        .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-attrib {
          display: none;
        }
      `}</style>
    </div>
  );
}