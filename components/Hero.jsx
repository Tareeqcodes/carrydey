'use client';
import { PackagePlus } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mt-6 overflow-hidden border border-purple-100">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl -ml-16 -mb-16"></div>
      
      {/* Floating icons decoration */}
      <div className="absolute top-7 text-6xl right-6 opacity-300">
       📦
      </div>
      
      <div className="relative z-10 max-w-2xl">

        <h2 className="text-2xl font-bold mb-3 text-gray-900 leading-tight">
          Send Packages Safely
        </h2>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Connect with verified travelers going your way
        </p>

        <Link
          href="/uploadpackage"
         className="bg-white/80 backdrop-blur-sm text-purple-700 px-8 py-4 rounded-xl border border-purple-100 font-semibold flex items-center space-x-2 shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hover:shadow-lg">
          <div
           className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
            <PackagePlus className="w-5 h-5" />
          </div>
          <span>Add Package</span>
        </Link>
      </div>
    </div>
  );
}