'use client';

import Link from 'next/link';
import {
  Package,
  MapPin,
  Users,
  Zap,
  ArrowRight,
  Truck,
  Clock,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
    
      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#3A0A21]/5 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-[#3A0A21]" />
                <span className="text-sm font-medium text-[#3A0A21]">
                  Fast & Reliable Delivery
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-[#3A0A21] leading-tight">
                  Your Package,
                  <br />
                  <span className="text-[#3A0A21]/80">Their Journey</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Connect with travelers heading your way. Send packages faster,
                  cheaper, and more reliably with people already making the
                  trip.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                  <Clock className="w-4 h-4 text-[#3A0A21]" />
                  <span className="text-sm font-medium text-gray-700">
                    Same-day delivery
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                  <Users className="w-4 h-4 text-[#3A0A21]" />
                  <span className="text-sm font-medium text-gray-700">
                    Verified travelers
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                  <Truck className="w-4 h-4 text-[#3A0A21]" />
                  <span className="text-sm font-medium text-gray-700">
                    Real-time tracking
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/create-delivery"
                  className="inline-flex items-center justify-center space-x-2 bg-[#3A0A21] text-white px-8 py-4 rounded-full hover:bg-[#4A0A31] transition-all shadow-lg shadow-[#3A0A21]/20 font-medium text-lg group"
                >
                  <span>Send a Package</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/become-traveler"
                  className="inline-flex items-center justify-center space-x-2 bg-white text-[#3A0A21] px-8 py-4 rounded-full hover:bg-gray-50 transition-colors border-2 border-[#3A0A21] font-medium text-lg"
                >
                  <span>Earn as a Traveler</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-[#3A0A21]">10k+</div>
                  <div className="text-sm text-gray-600 mt-1">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#3A0A21]">30k+</div>
                  <div className="text-sm text-gray-600 mt-1">Deliveries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#3A0A21]">98%</div>
                  <div className="text-sm text-gray-600 mt-1">On-time Rate</div>
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
                        className="animate-pulse"
                      />
                    </svg>
                  </div>

                  {/* Pickup Marker */}
                  <div
                    className="absolute top-20 left-12 z-10 animate-bounce"
                    style={{ animationDuration: '3s' }}
                  >
                    <div className="relative">
                      <div className="bg-[#3A0A21] text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm mb-2">
                        📍 Pickup: Lekki Phase 1
                      </div>
                      <div className="w-6 h-6 bg-[#3A0A21] rounded-full border-4 border-white shadow-lg mx-auto"></div>
                      <div className="w-4 h-4 bg-[#3A0A21] rounded-full absolute top-6 left-1/2 -translate-x-1/2 opacity-30"></div>
                    </div>
                  </div>

                  {/* Dropoff Marker */}
                  <div
                    className="absolute bottom-24 right-16 z-10 animate-bounce"
                    style={{ animationDuration: '3s', animationDelay: '0.5s' }}
                  >
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
                        <Package className="w-6 h-6 text-[#3A0A21]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#3A0A21]">
                          Express Delivery
                        </div>
                        <div className="text-sm text-gray-600">
                          8.5 km • 25 mins
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#3A0A21]">
                        ₦1,800
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Save 40%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    12 travelers nearby
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-[#3A0A21] text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    30 min avg. delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3A0A21] mb-4">
              Why Choose Carrydey?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The smarter way to send packages across Nigeria
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#3A0A21]/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-[#3A0A21]" />
              </div>
              <h3 className="text-xl font-bold text-[#3A0A21] mb-3">
                Find Travelers Heading Your Way
              </h3>
              <p className="text-gray-600">
                Match with verified travelers already making the trip to your
                destination
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#3A0A21]/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-[#3A0A21]" />
              </div>
              <h3 className="text-xl font-bold text-[#3A0A21] mb-3">
                Lightning Fast Delivery
              </h3>
              <p className="text-gray-600">
                Get your packages delivered same-day with real-time tracking
                every step
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#3A0A21]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-[#3A0A21]" />
              </div>
              <h3 className="text-xl font-bold text-[#3A0A21] mb-3">
                Community You Can Trust
              </h3>
              <p className="text-gray-600">
                Every traveler is verified with ratings and reviews from real
                users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#3A0A21] rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#3A0A21]">Carrydey</span>
            </div>

            <div className="flex space-x-6 text-sm text-gray-600">
              <Link
                href="/privacy"
                className="hover:text-[#3A0A21] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#3A0A21] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#3A0A21] transition-colors"
              >
                Contact Us
              </Link>
            </div>

            <p className="text-sm text-gray-600">
              © 2024 Carrydey. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
