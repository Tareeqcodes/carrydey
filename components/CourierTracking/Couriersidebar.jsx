'use client';
import { Package, Truck, History, DollarSign, User } from 'lucide-react';

const Couriersidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navItems = [
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'active', label: 'Active Deliveries', icon: Truck },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside
      className={`fixed lg:sticky pt-5 top-10 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-72
      bg-white dark:bg-black border-r border-black/10 dark:border-white/10 z-40
      transform transition-transform duration-300 ease-in-out lg:translate-x-0
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-6 h-full flex flex-col">
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
                className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? 'bg-black/5 dark:bg-white/10 text-[#00C896] border border-black/10 dark:border-white/20 shadow-md'
                      : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10'
                  }`}
              >
                <div className="relative z-10 flex items-start gap-4 p-4">
                  <div
                    className={`p-2 rounded-xl transition-colors
                    ${isActive ? 'bg-black/10 dark:bg-white/20' : 'bg-black/5 dark:bg-white/5 group-hover:bg-black/8 dark:group-hover:bg-white/10'}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'text-[#00C896]' : 'text-black/50 dark:text-white/50'}`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`font-semibold text-sm ${isActive ? 'text-black dark:text-white' : 'text-black/70 dark:text-white/70'}`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${isActive ? 'text-black/60 dark:text-white/60' : 'text-black/40 dark:text-white/40'}`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#00C896] rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Couriersidebar;
