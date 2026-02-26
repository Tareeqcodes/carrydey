'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Send, 
  PackageSearch, 
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import NavbarMorphism from '@/ui/NavbarMorphism';

const getNavLinks = (user, role) => {
  if (!user) {
    return [
      { href: '/send', label: 'Send', icon: Send },
      { href: '/onboardagency', label: 'Earn', icon: TrendingUp },
    ];
  }

  if (role === 'sender') {
    return [
      { href: '/send', label: 'Send', icon: Send },
      { href: '/track', label: 'Track', icon: PackageSearch },
      { href: '/hub', label: 'Hub', icon: LayoutDashboard },
    ];
  } else if (role === 'courier') {
    return [
      { href: '/track', label: 'Track', icon: PackageSearch },
      { href: '/hub', label: 'Hub', icon: LayoutDashboard },
    ];
  } else if (role === 'agency') {
    return [
      { href: '/track', label: 'Track', icon: PackageSearch },
      { href: '/hub', label: 'Hub', icon: LayoutDashboard },
    ];
  } else {
    return [
      { href: '/', label: 'Home', icon: Home },
      { href: '/hub', label: 'Hub', icon: LayoutDashboard },
    ];
  }
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

const DesktopNavLink = ({ href, label, icon: Icon, isActive }) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
      isActive
        ? 'text-[#3A0A21] bg-[#3A0A21]/5'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { role, loading } = useUserRole();

  const [activeTab, setActiveTab] = useState('/');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hiddenNavbarRoutes = ['/AgencyBooking/', '/bookconfirm/', '/driver/'];
  const shouldHideNavbar = hiddenNavbarRoutes.some(route =>
    pathname?.startsWith(route)
  );

  if (shouldHideNavbar) return null;
  if (loading) return <NavbarMorphism />;

  const navLinks = getNavLinks(user, role);

  return (
    <>
      {/* Desktop nav */}
      <nav
        className={`hidden w-full md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white overflow-hidden shadow-lg'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#3A0A21]">Carrydey</span>
            </Link>
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <DesktopNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  isActive={pathname === link.href}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="text-lg font-bold text-[#3A0A21]">
            Carrydey
          </Link>
        </div>
      </div>

      {/* Mobile bottom nav */}
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

      <div className="md:hidden h-14" />
      <div className="hidden md:block h-16" />
    </>
  );
};

export default Navbar;