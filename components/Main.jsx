'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Package, Zap } from 'lucide-react';
import InputLocation from './InputLocation';

export default function Main() {
  const router = useRouter();
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [routeData, setRouteData] = useState(null);

  const handleLocationSelect = (type, location) => {
    if (type === 'pickup') {
      setPickup(location);
    } else {
      setDropoff(location);
    }
  };

  const handleRouteCalculated = (data) => {
    setRouteData(data);
  };

  const handleFindTraveler = () => {
    if (pickup && dropoff) {
      const locationData = {
        pickup,
        dropoff,
        routeData,
        skipLocationScreen: true,
      };

      sessionStorage.setItem('deliveryData', JSON.stringify(locationData));
      router.push('/send');
    }
  };

  return (
    <main className="bg-white rounded-2xl overflow-hidden shadow-lg my-0 md:mx-5 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF6B35] bg-opacity-10 text-[#FFF] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span>⚡</span> Fast & Reliable Delivery
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3A0A21] leading-tight">
                Your Package,
                <br />
                <span className="text-[#3A0A21]/80">Their Journey</span>
              </h1>
            </div>
            <InputLocation
              onLocationSelect={handleLocationSelect}
              onRouteCalculated={handleRouteCalculated}
              pickup={pickup}
              dropoff={dropoff}
              showNextButton={false}
            />
            <button
              onClick={handleFindTraveler}
              disabled={!pickup || !dropoff}
              className="w-full bg-[#3A0A21] text-white py-4 rounded-lg hover:bg-[#4A0A31] transition-colors font-medium text-lg cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pickup && dropoff ? 'Find a Courier' : 'Enter pickup & dropoff'}
            </button>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                <span className="text-[#1A1D29] text-sm font-semibold">
                  Same-day delivery
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00D9FF]"></div>
                <span className="text-[#1A1D29] text-sm font-semibold">
                  Verified Courier
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF6B35]"></div>
                <span className="text-[#1A1D29] text-sm font-semibold">
                  Real-time tracking
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Map UI */}
          <div className="relative">
            {/* Map Container */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-2xl">
              {/* Map Background with Route */}
              <div
                className="relative bg-white rounded-2xl overflow-hidden"
                style={{ height: '500px' }}
              >
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-8 h-full">
                      {[...Array(64)].map((_, i) => (
                        <div key={i} className="border border-gray-400"></div>
                      ))}
                    </div>
                  </div>

                  {/* Route Line */}
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
                          style={{ stopColor: '#3A0A21', stopOpacity: 0.4 }}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 80 120 Q 200 180, 320 240 T 420 360"
                      stroke="url(#routeGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="8 4"
                      className="animate-none"
                    />
                  </svg>
                </div>

                {/* Pickup Marker */}
                <div className="absolute top-20 left-12 z-10 animate-none">
                  <div className="relative">
                    <div className="bg-[#3A0A21] text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm mb-2">
                      📍 Pickup: Lekki Phase 1
                    </div>
                    <div className="w-6 h-6 bg-[#3A0A21] rounded-full border-4 border-white shadow-lg mx-auto"></div>
                    <div className="w-4 h-4 bg-[#3A0A21] rounded-full absolute top-6 left-1/2 -translate-x-1/2 opacity-30"></div>
                  </div>
                </div>

                {/* Dropoff Marker */}
                <div className="absolute bottom-24 right-16 z-10 animate-none">
                  <div className="relative">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm mb-2">
                      🎯 Dropoff: Victoria Island
                    </div>
                    <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg mx-auto"></div>
                    <div className="w-4 h-4 bg-red-500 rounded-full absolute top-6 left-1/2 -translate-x-1/2 opacity-30"></div>
                  </div>
                </div>

                {/* Delivery Person Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative animate-pulse">
                    <div className="bg-white p-3 rounded-full shadow-xl border-2 border-[#3A0A21]">
                      <Truck className="w-6 h-6 text-[#3A0A21]" />
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-medium text-[#3A0A21] whitespace-nowrap">
                      En route • 15 mins
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info Card */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 w-11/12 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#3A0A21]/10 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#FF6B35]" />
                    
                    </div>
                    <div>
                      <div className="font-bold text-[#FF6B35]">
                        Express Delivery
                      </div>
                      <div className="text-sm font-bold text-[#FF6B35]">
                        8.5 km • 25 mins
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#3A0A21]">
                      ₦1,800
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-[#10B981]">
                  12 courier nearby
                </span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-[#3A0A21] text-white p-2 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-bold">
                  30 min avg. delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
