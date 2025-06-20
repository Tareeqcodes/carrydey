'use client';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function Hero({ role }) {
  // Debug: Log the role to see what's being passed
  console.log('Role received in Hero component:', role);


  if (role === 'traveler') {
    return (
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-8 mt-8 text-white overflow-hidden pt-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-4 -mb-4"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">
            Travel & Earn Money
          </h2>
          <p className="text-white/90 mb-6">
            Help others deliver packages on your route
          </p>
          <Link
            href="/trip"
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Your Trip</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-8 mt-8 text-white overflow-hidden pt-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-4 -mb-4"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">
          Send Packages Safely
        </h2>
        <p className="text-white/90 mb-6">
          Connect with verified travelers going your way
        </p> 
        <Link 
        href="/package"
        prefetch={false}
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Post Your Package</span>
        </Link>
      </div>
    </div>
  );
}