'use client';
import { Bell } from 'lucide-react';

export default function Main({ role, name }) {
  return (
    <section>
     <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600"> {name || 'Unknown User'}</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* User Type Badge */}
            <div className='px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium'>
              
              {role.charAt(0).toUpperCase() + role.slice(1) || 'Guest'}
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
    </section>
  )
}
 