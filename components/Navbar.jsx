'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Package, Info, User, MessageCircle } from 'lucide-react';
import { UserRole } from '@/hooks/UserRole';

export default function UnifiedNavbar() {
  const { role, loading } = UserRole();
  
  // Don't render anything while loading
  if (loading) return null;
  
  // Don't render navbar if no role (user not logged in or verified)
  if (!role) return null;

  return (
    <div className="fixed max-w-md mx-auto bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {role === 'traveler' ? (
          // Traveler Navigation
          <>
            <button className="flex flex-col items-center space-y-1 p-2 rounded-lg text-white hover:text-black bg-black hover:bg-gray-100 cursor-pointer transition-colors">
              <Package size={24} />
              <span className="text-xs font-medium">Match</span>
            </button>
            <Link href="/browse">
              <button className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors">
                <div className="relative">
                  <Search size={24} className="relative z-10" />
                </div>
                <span className="text-xs font-medium">Browse</span>
              </button>
            </Link>
            <Link href="/setting">
              <button className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors cursor-pointer">
                <div className="relative">
                  <Settings size={24} className="relative z-10" />
                </div>
                <span className="text-xs font-medium">Profile</span>
              </button>
            </Link>
          </>
        ) : role === 'sender' ? (
         
          <>
            <Link href="/dashboard">
              <button className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors">
                <div className="relative">
                  <User size={24} className="relative z-10" />
                </div>
                <span className="text-xs font-medium">Home</span>
              </button>
            </Link>
            <button className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors">
              <div className="relative">
                <MessageCircle size={24} className="relative z-10" />
              </div>
              <span className="text-xs font-medium">Requests</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors">
              <div className="relative">
                <Info size={24} className="relative z-10" />
              </div>
              <span className="text-xs font-medium">Transit</span>
            </button>
            
            <Link href="/setting">
              <button className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors cursor-pointer">
                <div className="relative">
                  <User size={24} className="relative z-10" />
                </div>
                <span className="text-xs font-medium">Profile</span>
              </button>
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}