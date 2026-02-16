'use client';
import { Package, Truck, History, DollarSign, User } from 'lucide-react';

const CourierSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navItems = [
    {
      id: 'deliveries',
      label: 'Pending Requests',
      icon: Package,
    },
    {
      id: 'active',
      label: 'Active Deliveries',
      icon: Truck,
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: DollarSign,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <aside
      className={`fixed lg:sticky pt-5 top-10 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                  setActivePage(item.id);
                  setSidebarOpen(false);
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
                    <p
                      className={`font-semibold text-sm ${
                        isActive ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </p>
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

export default CourierSidebar;