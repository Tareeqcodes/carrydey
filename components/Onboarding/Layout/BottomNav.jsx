import React from 'react';
import { Home, Package, Truck, Users, DollarSign } from 'lucide-react';

const BottomNav = ({ activePage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'requests', label: 'Requests', icon: Package },
    { id: 'active', label: 'Active', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: DollarSign }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-20">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activePage === item.id 
                ? 'text-[#3A0A21]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;