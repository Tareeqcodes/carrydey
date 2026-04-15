'use client';
import { Truck, History, User, Home } from 'lucide-react';

const SenderSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navItems = [
    {
      id: 'active',
      label: 'Active Deliveries',
      icon: Truck,
      description: 'Track ongoing Deliveries',
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      description: 'View past deliveries',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your account',
    },
  ];

  return (
    <aside
      className={`fixed lg:sticky pt-5 top-10 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
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
                    ? 'bg-gradient-to-r from-[#00C896] to-[#00E5AD] text-black shadow-lg shadow-[#00C896]/20'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <div className="relative z-10 flex items-start gap-4 p-4">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-black/20'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-black' : 'text-white/70'
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`font-semibold text-sm ${
                        isActive ? 'text-black' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        isActive ? 'text-black/70' : 'text-white/50'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-black rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SenderSidebar;
