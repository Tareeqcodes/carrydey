'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// ── Marker HTML factories ──────────────────────────────────────────────────
function makeDriverMarkerEl(driverName, status) {
  const el = document.createElement('div');
  el.className = 'carrydey-driver-marker';
  el.innerHTML = `
    <div class="driver-ping-ring"></div>
    <div class="driver-dot">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    </div>
    <div class="driver-label">${driverName.split(' ')[0]}</div>
  `;
  return el;
}

function makePickupEl() {
  const el = document.createElement('div');
  el.className = 'carrydey-pickup-marker';
  el.innerHTML = `<div class="pickup-dot"></div>`;
  return el;
}

function makeDropoffEl() {
  const el = document.createElement('div');
  el.className = 'carrydey-dropoff-marker';
  el.innerHTML = `<div class="dropoff-square"></div>`;
  return el;
}

// ── Component ─────────────────────────────────────────────────────────────
export default function TrackingMapbox({ drivers, activeDeliveries }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // keyed by driverId or deliveryId
  const [ready, setReady] = useState(false);

  // ── Init map once ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [8.5167, 12.0022], // Kano, Nigeria default
      zoom: 12,
      pitch: 40,
      antialias: true,
    });

    mapRef.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'bottom-right'
    );

    mapRef.current.on('load', () => setReady(true));

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Sync markers whenever drivers / deliveries update ───────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const map = mapRef.current;
    const activeMarkerIds = new Set();

    // ── 1. Driver live markers ──────────────────────────────────────────
    drivers
      .filter((d) => d.status === 'on_delivery' && d.lat && d.lng)
      .forEach((driver) => {
        const key = `driver-${driver.$id || driver.id}`;
        activeMarkerIds.add(key);

        const lngLat = [parseFloat(driver.lng), parseFloat(driver.lat)];

        if (markersRef.current[key]) {
          // Smoothly move existing marker
          markersRef.current[key].setLngLat(lngLat);
        } else {
          // Create new marker
          const el = makeDriverMarkerEl(driver.name, driver.status);
          const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(lngLat)
            .setPopup(
              new mapboxgl.Popup({ offset: 32, closeButton: false }).setHTML(`
                <div style="font-family:sans-serif;padding:4px 2px">
                  <p style="font-weight:700;font-size:12px;margin:0">${driver.name}</p>
                  <p style="font-size:10px;color:#666;margin:2px 0 0">${driver.phone || ''}</p>
                  <p style="font-size:10px;color:#2563EB;margin:2px 0 0;font-weight:600">On Delivery</p>
                </div>
              `)
            )
            .addTo(map);
          markersRef.current[key] = marker;
        }
      });

    // ── 2. Pickup / Dropoff pins for active deliveries ──────────────────
    activeDeliveries
      .filter((d) =>
        ['accepted', 'assigned', 'picked_up', 'in_transit'].includes(d.status)
      )
      .forEach((delivery) => {
        const id = delivery.$id || delivery.id;

        // Pickup pin
        if (delivery.pickupLat && delivery.pickupLng) {
          const key = `pickup-${id}`;
          activeMarkerIds.add(key);
          if (!markersRef.current[key]) {
            const el = makePickupEl();
            const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
              .setLngLat([
                parseFloat(delivery.pickupLng),
                parseFloat(delivery.pickupLat),
              ])
              .setPopup(
                new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(`
                  <div style="font-family:sans-serif;padding:4px 2px">
                    <p style="font-size:9px;font-weight:700;color:#16A34A;margin:0;text-transform:uppercase;letter-spacing:0.05em">Pickup</p>
                    <p style="font-size:11px;font-weight:600;margin:2px 0 0;color:#111">${(delivery.pickupAddress || '').split(',')[0]}</p>
                  </div>
                `)
              )
              .addTo(map);
            markersRef.current[key] = marker;
          }
        }

        // Dropoff pin — only show if not yet picked up
        if (
          delivery.dropoffLat &&
          delivery.dropoffLng &&
          delivery.status !== 'picked_up'
        ) {
          const key = `dropoff-${id}`;
          activeMarkerIds.add(key);
          if (!markersRef.current[key]) {
            const el = makeDropoffEl();
            const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
              .setLngLat([
                parseFloat(delivery.dropoffLng),
                parseFloat(delivery.dropoffLat),
              ])
              .setPopup(
                new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(`
                  <div style="font-family:sans-serif;padding:4px 2px">
                    <p style="font-size:9px;font-weight:700;color:#DC2626;margin:0;text-transform:uppercase;letter-spacing:0.05em">Dropoff</p>
                    <p style="font-size:11px;font-weight:600;margin:2px 0 0;color:#111">${(delivery.dropoffAddress || '').split(',')[0]}</p>
                  </div>
                `)
              )
              .addTo(map);
            markersRef.current[key] = marker;
          }
        }
      });

    // ── 3. Remove stale markers ─────────────────────────────────────────
    Object.keys(markersRef.current).forEach((key) => {
      if (!activeMarkerIds.has(key)) {
        markersRef.current[key].remove();
        delete markersRef.current[key];
      }
    });

    // ── 4. Fit map to all visible markers ───────────────────────────────
    const allLngLats = Object.values(markersRef.current).map((m) =>
      m.getLngLat()
    );
    if (allLngLats.length >= 2) {
      const bounds = new mapboxgl.LngLatBounds();
      allLngLats.forEach((ll) => bounds.extend(ll));
      map.fitBounds(bounds, {
        padding: { top: 80, bottom: 200, left: 60, right: 60 },
        maxZoom: 14,
        duration: 1200,
      });
    } else if (allLngLats.length === 1) {
      map.easeTo({ center: allLngLats[0], zoom: 14, duration: 800 });
    }
  }, [ready, drivers, activeDeliveries]);

  return (
    <>
      <div ref={containerRef} className="w-full h-full" />

      <style jsx global>{`
        /* ── Driver marker ── */
        .carrydey-driver-marker {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }
        .driver-ping-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -62%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.25);
          animation: driverPing 1.8s ease-out infinite;
        }
        @keyframes driverPing {
          0%   { transform: translate(-50%, -62%) scale(0.6); opacity: 0.8; }
          100% { transform: translate(-50%, -62%) scale(1.8); opacity: 0; }
        }
        .driver-dot {
          position: relative;
          z-index: 2;
          width: 36px;
          height: 36px;
          background: #2563EB;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
        }
        .driver-label {
          position: relative;
          z-index: 2;
          margin-top: 3px;
          background: #1E3A5F;
          color: white;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 2px 6px;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        /* ── Pickup marker ── */
        .carrydey-pickup-marker {
          cursor: pointer;
        }
        .pickup-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #16A34A;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(22,163,74,0.5);
        }

        /* ── Dropoff marker ── */
        .carrydey-dropoff-marker {
          cursor: pointer;
        }
        .dropoff-square {
          width: 16px;
          height: 16px;
          background: #DC2626;
          border: 3px solid white;
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(220,38,38,0.5);
        }

        /* ── Mapbox popup cleanup ── */
        .mapboxgl-popup-content {
          border-radius: 10px !important;
          padding: 8px 10px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
        }
        .mapboxgl-popup-tip { display: none !important; }
        .mapboxgl-ctrl-bottom-left { display: none !important; }
        .mapboxgl-ctrl-attrib { display: none !important; }
        .mapboxgl-ctrl-group {
          background: rgba(255,255,255,0.95) !important;
          border-radius: 10px !important;
          border: none !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </>
  );
}