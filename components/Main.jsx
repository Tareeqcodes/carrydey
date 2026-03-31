'use client';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Package, Zap, ArrowRight } from 'lucide-react';
import InputLocation from './InputLocation';

export default function Main() {
  const router = useRouter();
  const [pickup, setPickup]       = useState(null);
  const [dropoff, setDropoff]     = useState(null);
  const [routeData, setRouteData] = useState(null);

  const handleLocationSelect = useCallback((type, location) => {
    if (type === 'pickup') setPickup(location);
  }, []);

  const handleDropoffsChange = useCallback((updatedDropoffs) => {
    const first = updatedDropoffs?.[0];
    setDropoff(first?.location ?? null);
  }, []);

  const handleRouteCalculated = useCallback((data) => {
    setRouteData(data);
  }, []);

  const handleBookDelivery = useCallback(() => {
    if (pickup && dropoff) {
      sessionStorage.setItem(
        'deliveryData',
        JSON.stringify({ pickup, dropoff, routeData })
      );
    }
    router.push('/send');
  }, [pickup, dropoff, routeData, router]);

  const bothFilled = pickup && dropoff;

  // Memoized so InputLocation doesn't get a new object reference every render
  const dropoffsProp = useMemo(() => {
    if (!dropoff) return undefined;
    return [
      {
        id: 'd0',
        location: dropoff,
        address: dropoff.place_name || '',
        recipientName: '',
        recipientPhone: '',
        packageLabel: '',
      },
    ];
  }, [dropoff]);

  return (
    <main className="bg-white rounded-2xl overflow-hidden my-0 md:mx-5 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center text-sm text-gray-500 font-semibold">
              Delivery Marketplace · Nigeria
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#3A0A21] leading-[1.1] tracking-tight">
                Send anything.
                <br />
                <span className="text-[#FF6B35] ">On your budget.</span>
              </h1>
            </div>

            <InputLocation
              onLocationSelect={handleLocationSelect}
              onDropoffsChange={handleDropoffsChange}
              onRouteCalculated={handleRouteCalculated}
              pickup={pickup}
              dropoffs={dropoffsProp}
              showNextButton={false}
            />

            <button
              onClick={handleBookDelivery}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-all shadow-lg active:scale-[0.98]"
              style={{
                background: bothFilled ? '#FF6B35' : '#3A0A21',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {bothFilled ? 'Find a courier' : 'Book a delivery'}
              {!bothFilled && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <div
                className="relative bg-white rounded-2xl overflow-hidden"
                style={{ height: '460px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-8 h-full">
                      {[...Array(64)].map((_, i) => (
                        <div key={i} className="border border-gray-400" />
                      ))}
                    </div>
                  </div>
                  <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ zIndex: 1 }}
                  >
                    <defs>
                      <linearGradient
                        id="routeGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: '#3A0A21', stopOpacity: 0.8 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: '#FF6B35', stopOpacity: 0.5 }}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 80 100 Q 200 160, 320 220 T 430 370"
                      stroke="url(#routeGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="8 4"
                    />
                  </svg>
                </div>

                <div className="absolute top-16 left-10 z-10">
                  <div className="bg-[#3A0A21] text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium mb-2">
                    📍 Lekki Phase 1
                  </div>
                  <div className="w-5 h-5 bg-[#3A0A21] rounded-full border-4 border-white shadow-lg mx-auto" />
                </div>

                <div className="absolute bottom-20 right-12 z-10">
                  <div className="bg-[#FF6B35] text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium mb-2">
                    🎯 Victoria Island
                  </div>
                  <div className="w-5 h-5 bg-[#FF6B35] rounded-full border-4 border-white shadow-lg mx-auto" />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative animate-pulse">
                    <div className="bg-white p-3 rounded-full shadow-xl border-2 border-[#3A0A21]">
                      <Truck className="w-6 h-6 text-[#3A0A21]" />
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-semibold text-[#3A0A21] whitespace-nowrap">
                      En route · 15 mins
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-5 w-11/12 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3A0A21]/08 rounded-full flex items-center justify-center bg-orange-50">
                      <Package className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#FF6B35]">
                        Express Delivery
                      </div>
                      <div className="text-xs text-gray-500">
                        8.5 km · 25 mins
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-[#3A0A21] text-white px-4 py-2.5 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF6B35]" />
                <span className="text-sm font-bold">30 min avg. delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}