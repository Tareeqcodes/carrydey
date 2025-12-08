'use client';
import {
  MapPin,
  Users,
  Clock,
} from 'lucide-react';
import Main from '@/components/Main';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
       <Main />
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#3A0A21] mb-4">
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
      <Footer />
    </div>
  );
}
