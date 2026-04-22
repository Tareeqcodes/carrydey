'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Send,
  PackageSearch,
  LayoutDashboard,
  TrendingUp,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import NavbarMorphism from '@/ui/NavbarMorphism';

const getNavLinks = (user, role) => {
  if (!user)
    return [
      { href: 'send', label: 'Send', icon: Send },
      { href: '/courier', label: 'Earn', icon: TrendingUp },
    ];
  if (role === 'sender')
    return [
      { href: '/send', label: 'Send', icon: Send },
      { href: '/track', label: 'Track', icon: PackageSearch },
      { href: '/hub', label: 'Hub', icon: LayoutDashboard },
    ];
  if (role === 'courier' || role === 'agency')
    return [
      { href: '/track', label: 'Track', icon: PackageSearch },
      { href: '/hub', label: 'Hub', icon: LayoutDashboard },
    ];
  return [
    { href: '/send', label: 'Send', icon: Send },
    { href: '/hub', label: 'Hub', icon: LayoutDashboard },
  ];
};

const DesktopNavLink = ({ href, label, icon: Icon, isActive, isEarn }) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold
      ${
        isEarn
          ? 'bg-[#22c55e] text-black hover:bg-[#16a34a]'
          : isActive
            ? 'text-[#22c55e] bg-black/5 dark:bg-white/8'
            : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8'
      }`}
  >
    <Icon
      size={16}
      strokeWidth={2}
      className={isActive ? 'text-[#22c55e]' : ''}
    />
    <span>{label}</span>
  </Link>
);

const MobileNavItem = ({ href, label, icon: Icon, isActive }) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center flex-1 py-2.5 px-1 select-none"
  >
    <div
      className={`flex items-center justify-center w-14 h-8 rounded-full transition-all duration-200
      ${isActive ? 'bg-[#22c55e]/15' : 'bg-transparent'}`}
    >
      <Icon
        size={20}
        strokeWidth={isActive ? 2.5 : 2.2}
        className={`transition-colors duration-200 ${isActive ? 'text-[#22c55e]' : 'text-black/40 dark:text-white/40'}`}
      />
    </div>
    <span
      className={`text-[10px] font-semibold mt-0.5 transition-colors duration-200
      ${isActive ? 'text-[#22c55e]' : 'text-black/40 dark:text-white/40'}`}
    >
      {label}
    </span>
  </Link>
);

const Navbar = () => {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hiddenRoutes = ['/AgencyBooking/', '/bookconfirm/', '/driver/', '/b/'];
  if (hiddenRoutes.some((r) => pathname?.startsWith(r))) return null;
  if (authLoading || roleLoading) return <NavbarMorphism />;

  const navLinks = getNavLinks(user, role);

  return (
    <>
      {/* Desktop nav */}
      <nav
        className={`hidden md:flex w-full fixed top-0 left-0 right-0 z-50 items-center justify-between h-16 px-6 transition-all duration-300
        ${
          scrolled
            ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/10 dark:border-white/10'
            : 'bg-white dark:bg-black border-b border-black/10 dark:border-white/10'
        }`}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-bold text-black dark:text-white tracking-tight">
            Carrydey
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <DesktopNavLink
              key={link.href}
              {...link}
              isActive={pathname === link.href}
              isEarn={link.label === 'Earn'}
            />
          ))}
          {!user && (
            <Link
              href="/login"
              className="ml-2 flex items-center gap-2 text-sm font-semibold text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors px-3 py-2 border border-black/20 dark:border-white/20 rounded-xl hover:border-black/40 dark:hover:border-white/40"
            >
              <LogIn size={16} /> Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile top bar */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 transition-all duration-300
        ${
          scrolled
            ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/10 dark:border-white/10'
            : 'bg-white dark:bg-black border-b border-black/10 dark:border-white/10'
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-bold text-black dark:text-white tracking-tight">
            Carrydey
          </span>
        </Link>
        {!user && (
          <Link
            href="/login"
            className="flex items-center gap-1.5 border border-black/20 dark:border-white/20 text-black dark:text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
          >
            <LogIn size={12} /> Login
          </Link>
        )}
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div
          className="flex justify-center"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
            paddingTop: '8px',
          }}
        >
          <div
            className="flex items-center justify-around bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl rounded-[28px] px-2"
            style={{
              width: 'calc(100% - 32px)',
              border: '0.5px solid rgba(0,0,0,0.08)',
              boxShadow:
                '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {navLinks.map((link) => (
              <MobileNavItem
                key={link.href}
                {...link}
                isActive={pathname === link.href}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="md:hidden h-24" />
      <div className="hidden md:block h-16" />
    </>
  );
};

export default Navbar;
