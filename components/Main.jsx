'use client';
import { User, Search, Plus, Wallet, Settings, Bell } from 'lucide-react';

export default function Main() {
  return (
    <section>
     <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600"> Alex Johnson</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* User Type Badge */}
            <div className='px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium'>
             
            </div>
            {/* Notifications */}
            <div className="relative">
              <Bell size={24} className="text-gray-600" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">2</span>
                </div>
            </div>
          </div>
        </div>
      </div>

    {/* bottom nav */}
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
          <span className="text-xs font-medium">Search</span>
        </button>
        
        <button 
          className="flex flex-col items-center space-y-1 p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus size={24} />
          <span className="text-xs font-medium">Post</span>
        </button>
        
        <button 
          className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors'
        >
          <div className="relative">
            <Wallet size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Wallet</span>
        </button>
        
        <button 
          className='flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors '
        >
          <div className="relative">
         
            <Settings size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
    </section>
  )
}
 