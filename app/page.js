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
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] to-[#FFF8F0] rounded-3xl px-3 md:py-7 shadow-2xl">
       <Main />
      <section className="py-16  bg-gradient-to-br from-[#FFFBF5] to-[#FFF8F0] rounded-3xl shadow-2xl my-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-2">
          <div className="text-center mb-12">
            <h2 className="text-sm md:text-3xl font-bold text-[#3A0A21] mb-4">
              The smarter way to send packages across Nigeria
            </h2>
            <p className="text-[#1A1D29] text-xs md:text-md max-w-2xl mx-auto">
              Experience the future of delivery with our trusted community of
              travelers and lightning-fast service.
            </p>
          </div>
            
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transform hover:scale-105 transition-all">
              <div className="w-14 h-14 bg-[#3A0A21]/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-[#3A0A21]" />
              </div>
              <h3 className="text-sm font-bold text-[#3A0A21] mb-3">
                Find Travelers Heading Your Way
              </h3>
              <p className="text-[#1A1D29] text-xs">
                Match with verified travelers already making the trip to your
                destination
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transform hover:scale-105 transition-all">
              <div className="w-14 h-14 bg-[#3A0A21]/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-[#3A0A21]" />
              </div>
              <h3 className="text-sm font-bold text-[#3A0A21] mb-3">
                Lightning Fast Delivery
              </h3>
              <p className="text-[#1A1D29] text-xs">
                Get your packages delivered same-day with real-time tracking
                every step
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transform hover:scale-105 transition-all">
              <div className="w-14 h-14 bg-[#3A0A21]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-[#3A0A21]" />
              </div>
              <h3 className="text-sm font-bold text-[#3A0A21] mb-3">
                Community You Can Trust
              </h3>
              <p className="text-[#1A1D29] text-xs">
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
