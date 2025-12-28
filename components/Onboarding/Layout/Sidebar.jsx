import React from 'react';
import { 
  Home, Package, Truck, Users, DollarSign, Navigation,
  Shield, Settings, HelpCircle, LogOut, Bell
} from 'lucide-react';

const Sidebar = ({ activePage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'requests', label: 'Delivery Requests', icon: Package },
    { id: 'active', label: 'Active Deliveries', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'tracking', label: 'Live Tracking', icon: Navigation },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const supportItems = [
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Navigation</h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activePage === item.id
                    ? 'bg-[#3A0A21] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Support</h2>
          <nav className="space-y-1">
            {supportItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activePage === item.id
                    ? 'bg-[#3A0A21] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="p-4 bg-gray-50 rounded-xl mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-[#3A0A21]" />
              <span className="font-medium">Account Status</span>
            </div>
            <p className="text-sm text-gray-600">Professional Plan</p>
            <p className="text-xs text-gray-500 mt-1">Active • 12 Drivers</p>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;