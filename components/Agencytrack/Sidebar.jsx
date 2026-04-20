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
  X,
} from 'lucide-react';

const Sidebar = ({ activePage, onPageChange, drivers, isOpen, onClose }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & stats',
    },
    {
      id: 'requests',
      label: 'Requests',
      icon: Inbox,
      description: 'Pending deliveries',
    },
    {
      id: 'active',
      label: 'Active',
      icon: PackageCheck,
      description: 'Ongoing deliveries',
    },
    {
      id: 'drivers',
      label: 'Drivers',
      icon: Users,
      badge: drivers.length,
      description: 'Manage team',
    },
    {
      id: 'tracking',
      label: 'Tracking',
      icon: MapPin,
      description: 'Live locations',
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      description: 'Past deliveries',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Agency profile',
    },
  ];

  return (
    <aside
      className={`fixed lg:sticky pt-5 top-10 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-72
        bg-white dark:bg-black border-r border-black/10 dark:border-white/10
        z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Close button — mobile only */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">
            Menu
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#00C896] text-black shadow-lg shadow-[#00C896]/20'
                    : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="relative z-10 flex items-start gap-4 p-4">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-black/10'
                        : 'bg-black/5 dark:bg-white/10 group-hover:bg-black/10 dark:group-hover:bg-white/15'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'text-black' : 'text-black/60 dark:text-white/60'}`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`font-semibold text-sm ${isActive ? 'text-black' : 'text-black dark:text-white'}`}
                      >
                        {item.label}
                      </p>
                      {item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                            isActive
                              ? 'bg-black/15 text-black'
                              : 'bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${isActive ? 'text-black/60' : 'text-black/40 dark:text-white/40'}`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/20 rounded-l-full" />
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
