'use client';
import Link from 'next/link';
import { User, Settings, Info } from 'lucide-react';
export default function Navbar() {
  return (
     <div className="fixed max-w-md mx-auto bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <Link href="/dashboard">
          <button 
            className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors'
          >
            <div className="relative">

            <User size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Home</span>
        </button>
        </Link>
          
        <button 
          className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors'
        >
          <div className="relative">
            <Info size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Transit</span>
        </button>
          <Link href="/setting">
        <button 
          className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors cursor-pointer'
        >
          <div className="relative">
            <Settings size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Profile</span>
        </button>
          </Link>
      </div>
    </div>
  )
}
