'use client';
import {
  Search,

  Grid,
  FileEdit,
  User,
  Truck,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
const Navbar = () => {
  const { role, loading } = useUserRole();

  if (loading) return null;

  if (!role) return null;

  const NavButton = ({ children, isActive = false, href = null }) => {
    const buttonContent = (
      <button
        className={`relative flex flex-col items-center space-y-1 p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer ${
          isActive
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
            : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:text-gray-900 shadow-md border border-white/30'
        } hover:shadow-xl hover:-translate-y-1`}
      >
        {/* Subtle glow effect for active state */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl blur-lg scale-110" />
        )}
        {children}
      </button>
    );

    if (href) {
      return (
        <a href={href} className="relative">
          {buttonContent}
        </a>
      );
    }
    return <div className="relative">{buttonContent}</div>;
  };

  return (
    <div className="fixed max-w-md mx-auto bottom-0 left-0 right-0 z-50">
      <div className="relative">
        <div className="bg-white/40 backdrop-blur-sm border-t border-white/30 p-2 shadow-xl">
          <div className="relative z-10 flex justify-around">
            {role === 'traveler' ? (
              <>
              <NavButton>
                  <div className="relative">
                    <Search size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-semibold">Browse</span>
                </NavButton>

                <NavButton href="/proposal">
                  <div className="relative">
                    <FileEdit size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-semibold">Proposals</span>
                </NavButton>

                
                <NavButton href="/transit">
                  <div className="relative">
                    <Truck size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-semibold">In Transit</span>
                </NavButton>

                <NavButton href="/setting">
                  <div className="relative">
                    <LayoutDashboard size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-semibold">Dashboard</span>
                </NavButton>
              </>
            ) : role === 'sender' ? (
              <>
              <NavButton href="/deliveryRequest">
                  <div className="relative">
                    <MessageSquare size={24} className="relative z-10" />
                    {/* Notification indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full border-2 border-white shadow-md">
                      <div className="w-full h-full bg-red-500 rounded-full animate-ping opacity-75" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold">Requests</span>
                </NavButton>
{/* 
                <NavButton href="/dashboard">
                  <div className="relative">
                    <LayoutDashboard size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-semibold">Home</span>
                </NavButton> */}

                

                <NavButton href="/transit">
                  <div className="relative">
                    <Truck size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-semibold">In Transit</span>
                </NavButton>

                <NavButton href="/setting">
                  <div className="relative">
                    <LayoutDashboard size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-semibold">Dashboard</span>
                </NavButton>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
