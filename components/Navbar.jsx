'use client';
import Link from 'next/link';
import { User, Search, Settings, Package, Info } from 'lucide-react';
export default function Navbar() {
  return (
     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <button 
          className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors'
        >
          <div className="relative">
        
            <User size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button 
     
          className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors'
        >
          <div className="relative">
           
            <Search size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Browse</span>
        </button>
        
        <button 
          className="flex flex-col items-center space-y-1 p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Package size={24} />
          <span className="text-xs font-medium">Match</span>
        </button>
        
        <button 
          className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors'
        >
          <div className="relative">
            <Info size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Status</span>
        </button>
          <Link href="/setting">
        <button 
          className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors cursor-pointer'
        >
          <div className="relative">
            <Settings size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Settings</span>
        </button>
          </Link>
      </div>
    </div>
  )
}
