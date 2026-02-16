'use client';
import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  PackageCheck, 
  Users, 
  MapPin,
  Settings,
  History,
} from 'lucide-react';

const Sidebar = ({ activePage, onPageChange, drivers, isOpen }) => {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & stats'
    },
    { 
      id: 'requests', 
      label: 'Requests', 
      icon: Inbox,
      description: 'Pending deliveries'
    },
    { 
      id: 'active', 
      label: 'Active', 
      icon: PackageCheck,
      description: 'Ongoing deliveries'
    },
    { 
      id: 'drivers', 
      label: 'Drivers', 
      icon: Users, 
      badge: drivers.length,
      description: 'Manage team'
    },
    { 
      id: 'tracking', 
      label: 'Tracking', 
      icon: MapPin,
      description: 'Live locations'
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: History,
      description: 'Past deliveries'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      description: 'Agency profile'
    },
  ];

  return (
    <aside
      className={`fixed lg:sticky pt-5 top-10 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Navigation Items */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                }}
                className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white shadow-lg shadow-[#3A0A21]/20'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="relative z-10 flex items-start gap-4 p-4">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-white/20'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-white' : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`font-semibold text-sm ${
                          isActive ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {item.label}
                      </p>
                      {item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${
                        isActive ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;