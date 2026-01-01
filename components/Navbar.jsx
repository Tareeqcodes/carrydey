'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import NavbarMorphism from '@/ui/NavbarMorphism';

// Define navigation links based on user role
const getNavLinks = (user, role) => {
  if (!user) {
    return [
      { href: '/send', label: 'Send' },
      { href: '/travel', label: 'Become a Traveler' },
    ];
  }

  if (role === 'sender') {
    return [
      { href: '/travel', label: 'Become a Traveler' },
      { href: '/send', label: 'Send' },
      { href: '/track', label: 'Track Delivery' },
    ];
  }

  if (role === 'traveler') {
    return [
      { href: '/send', label: 'Send Package' },
      { href: '/travel', label: 'Travel' },
      { href: '/track', label: 'Track Delivery' },
    ];
  }

  return [];
};

// Reusable NavLink component
const NavLink = ({ href, label, onClick, className = '' }) => (
  <Link
    href={href}
    className={`text-gray-700 hover:text-[#3A0A21] transition-colors font-medium ${className}`}
    onClick={onClick}
  >
    {label}
  </Link>
);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <NavbarMorphism />
    );
  }

  const navLinks = getNavLinks(user, role);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-6">
        <div className="flex justify-between items-center h-20">
         
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#3A0A21]">
              Carrydey
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}

            {user ? (
              <Link
                href="/hub"
                className="bg-white/5 hover:text-white hover:bg-[#3A0A21] transition-colors p-1.5 shadow rounded-xl font-medium"
              >
                My Hub
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-[#3A0A21] text-white text-sm px-6 py-2.5 rounded-full hover:bg-[#4A0A31] transition-colors font-semibold"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#3A0A21] p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium"
              />
            ))}

            {user ? (
              <Link
                href="/hub"
                className="block bg-white/95 backdrop-blur-sm border hover:text-white hover:bg-[#3A0A21] transition-colors px-3 py-2 shadow rounded-xl font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Hub
              </Link>
            ) : (
              <Link
                href="/login"
                className="block bg-[#3A0A21] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#4A0A31] transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;