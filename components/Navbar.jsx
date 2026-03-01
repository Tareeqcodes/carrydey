'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Send,
  PackageSearch,
  LayoutDashboard,
  TrendingUp,
  Bell,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import NavbarMorphism from '@/ui/NavbarMorphism';

// ─── Nav link config per role ───────────────────────────────────────────────
const getNavLinks = (user, role) => {
  if (!user) {
    return [
      { href: '/vendor',        label: 'Send',  icon: Send },
      { href: '/courier', label: 'Earn', icon: TrendingUp },
    ];
  }
  if (role === 'sender') {
    return [
      { href: '/send',  label: 'Send',  icon: Send },
      { href: '/track', label: 'Track', icon: PackageSearch },
      { href: '/hub',   label: 'Hub',   icon: LayoutDashboard },
    ];
  }
  if (role === 'courier' || role === 'agency') {
    return [
      { href: '/track', label: 'Track', icon: PackageSearch },
      { href: '/hub',   label: 'Hub',   icon: LayoutDashboard },
    ];
  }
  return [
    { href: '/',    label: 'Home', icon: Home },
    { href: '/hub', label: 'Hub',  icon: LayoutDashboard },
  ];
};

const DesktopNavLink = ({ href, label, icon: Icon, isActive, isEarn }) => (
  <Link
    href={href}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold
      ${isEarn
        ? 'bg-[#FF6B35] text-white hover:bg-[#e85e2a] shadow-sm shadow-orange-200'
        : isActive
          ? 'text-[#3A0A21] bg-[#3A0A21]/8'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
      }
    `}
  >
    <Icon size={16} strokeWidth={2} />
    <span>{label}</span>
  </Link>
);

const MobileNavItem = ({ href, label, icon: Icon, isActive }) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center flex-1 py-2 px-1"
  >
    <div className={`
      flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200
      ${isActive
        ? 'bg-[#3A0A21] text-white shadow-lg shadow-[#3A0A21]/25 scale-105'
        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
      }
    `}>
      <Icon size={20} strokeWidth={2.2} />
    </div>
    <span className={`
      text-[10px] font-semibold mt-1 transition-colors duration-200
      ${isActive ? 'text-[#3A0A21]' : 'text-gray-400'}
    `}>
      {label}
    </span>
  </Link>
);

// User avatar (top-right on mobile) 
const UserAvatar = ({ user }) => {
  const initial = user?.email?.[0]?.toUpperCase() ?? 'U';
  return (
    <Link
      href="/hub"
      className="w-8 h-8 rounded-xl bg-[#3A0A21] text-white flex items-center justify-center text-xs font-bold hover:bg-[#5C1438] transition-colors"
    >
      {initial}
    </Link>
  );
};

const Navbar = () => {
  const pathname  = usePathname();
  const { user }  = useAuth();
  const { role, loading } = useUserRole();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Routes where navbar is hidden entirely
  const hiddenRoutes = ['/AgencyBooking/', '/bookconfirm/', '/driver/'];
  if (hiddenRoutes.some(r => pathname?.startsWith(r))) return null;
  if (loading) return <NavbarMorphism />;

  const navLinks = getNavLinks(user, role);

  return (
    <>
      <nav className={`
        hidden md:flex w-full fixed top-0 left-0 right-0 z-50
        items-center justify-between h-16 px-6
        transition-all duration-300
        ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-gray-100/80'
          : 'bg-white border-b border-gray-100'
        }
      `}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#3A0A21] rounded-lg flex items-center justify-center group-hover:bg-[#5C1438] transition-colors">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-lg font-bold text-[#3A0A21] tracking-tight">Carrydey</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <DesktopNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={pathname === link.href}
              isEarn={link.label === 'Earn'}
            />
          ))}

          {/* Auth controls */}
          {!user ? (
            <Link
              href="/login"
              className="ml-2 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#3A0A21] transition-colors px-3 py-2"
            >
              <LogIn size={16} />
              Login
            </Link>
          ) : (
            <div className="ml-3 flex items-center gap-2">
              {/* Notification bell */}
              <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                <Bell size={18} />
                {/* Red dot — wire to real notification count later */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {/* Avatar */}
              <UserAvatar user={user} />
            </div>
          )}
        </div>
      </nav>

      {/* ── MOBILE TOP BAR ──────────────────────────────────────── */}
      <div className={`
        md:hidden fixed top-0 left-0 right-0 z-40 h-14
        flex items-center justify-between px-4
        transition-all duration-300
        ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white border-b border-gray-100'
        }
      `}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#3A0A21] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="text-base font-bold text-[#3A0A21] tracking-tight">Carrydey</span>
        </Link>

        {/* Right side — login btn or user avatar */}
        <div className="flex items-center gap-2">
          {!user ? (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-[#3A0A21] text-white text-xs font-semibold px-3 py-2 cursor-pointer rounded-xl hover:bg-[#5C1438] transition-colors"
            >
              <LogIn size={12} />
              Login
            </Link>
          ) : (
            <>
              {/* Bell */}
              <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              {/* Avatar */}
              <UserAvatar user={user} />
            </>
          )}
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div
          className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
        >
          <div className="flex items-center justify-around px-2 pt-1 pb-1">
            {navLinks.map((link) => (
              <MobileNavItem
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                // FIX: derive active state from pathname, not local click state
                isActive={pathname === link.href}
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