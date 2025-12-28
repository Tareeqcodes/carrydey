import React, { useState } from 'react';
import { Menu, Bell, Search, Truck } from 'lucide-react';

const TopNav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#3A0A21] rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">LogiTrack Pro</h1>
                <p className="text-sm text-gray-500">Delivery Agency Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                />
              </div>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-xl relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3A0A21] rounded-full flex items-center justify-center text-white font-bold">
                AC
              </div>
              <div>
                <p className="font-medium">Agency Control</p>
                <p className="text-sm text-gray-500">Logistics Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;