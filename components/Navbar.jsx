'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Home, Send, MapPin, Package, User, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import NavbarMorphism from '@/ui/NavbarMorphism';

// Define navigation links based on user role
const getNavLinks = (user, role) => {
  if (!user) {
    return [
      { href: '/', label: 'Home', icon: Home },
      { href: '/send', label: 'Send', icon: Send },
      { href: '/travel', label: 'Travel', icon: MapPin },
    ];
  }

  if (role === 'sender') {
    return [
      { href: '/', label: 'Home', icon: Home },
      { href: '/send', label: 'Send', icon: Send },
      { href: '/track', label: 'Track', icon: Package },
      { href: '/hub', label: 'Hub', icon: User },
    ];
  }

  if (role === 'traveler') {
    return [
      { href: '/', label: 'Home', icon: Home },
      { href: '/send', label: 'Send', icon: Send },
      { href: '/travel', label: 'Travel', icon: MapPin },
      { href: '/track', label: 'Track', icon: Package },
      { href: '/hub', label: 'Hub', icon: User },
    ];
  }

  return [
    { href: '/', label: 'Home', icon: Home },
    { href: '/hub', label: 'Hub', icon: User },
  ];
};

const MobileNavItem = ({ href, label, icon: Icon, isActive, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex flex-col items-center justify-center flex-1 py-2 px-1 relative group"
  >
    <div className={`
      relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300
      ${isActive 
        ? 'bg-[#3A0A21] text-white shadow-lg shadow-[#3A0A21]/20' 
        : 'text-gray-600 hover:bg-gray-100'
      }
    `}>
      <Icon size={22} strokeWidth={2.5} />
    </div>
    <span className={`
      text-xs font-medium mt-1 transition-colors duration-300
      ${isActive ? 'text-[#3A0A21]' : 'text-gray-600'}
    `}>
      {label}
    </span>
  </Link>
);

const DesktopNavLink = ({ href, label, icon: Icon }) => (
  <Link
    href={href}
    className="flex items-center space-x-2 text-gray-700 hover:text-[#3A0A21] transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('/');
  const { user } = useAuth();
  const { role, loading } = useUserRole();

  if (loading) {
    return <NavbarMorphism />;
  }

  const navLinks = getNavLinks(user, role);

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#3A0A21]">Carrydey</span>
          </Link>
          
          {!user && (
            <Link
              href="/login"
              className="bg-[#3A0A21] text-white text-xs px-4 py-2 rounded-full hover:bg-[#4A0A31] transition-colors font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Spacer for mobile top bar */}
      <div className="md:hidden h-16" />

      {/* Desktop Navbar - Top */}
      <nav className="hidden md:block fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#3A0A21]">Carrydey</span>
            </Link>

            <div className="flex items-center space-x-2">
              {navLinks.slice(1).map((link) => (
                <DesktopNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                />
              ))}

              {!user && (
                <Link
                  href="/login"
                  className="ml-4 bg-[#3A0A21] text-white text-sm px-6 py-2.5 rounded-full hover:bg-[#4A0A31] transition-colors font-semibold"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-around px-2 pb-safe">
            {navLinks.map((link) => (
              <MobileNavItem
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                isActive={activeTab === link.href}
                onClick={() => setActiveTab(link.href)}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;