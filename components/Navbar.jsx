'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { role, loading } = useUserRole();

  // Determine which links to show based on role
  const isSender = role === 'sender';
  const isTraveler = role === 'traveler';

  return (
    <div className="fixed max-w-full z-50">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#3A0A21]">
                Carrydey
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Sender Role Navigation */}
              {user && isSender && (
                <>
                  <Link
                    href="/travel"
                    className="text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                  >
                    Become a Traveler
                  </Link>
                  <Link
                    href="/send"
                    className="text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                  >
                    Send
                  </Link>
                  <Link
                    href="/track"
                    className="text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                  >
                    Track Delivery
                  </Link>
                </>
              )}

              {/* Traveler Role Navigation */}
              {user && isTraveler && (
                <>
                  <Link
                    href="/send-package"
                    className="text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                  >
                    Send Package
                  </Link>
                  <Link
                    href="/travel"
                    className="text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                  >
                    Travel
                  </Link>

                  <Link
                    href="/track"
                    className="text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                  >
                    Track Delivery
                  </Link>
                </>
              )}

              {/* Guest Navigation (not logged in) */}
              {!user && (
                <>
                  <Link
                    href="/send"
                    className="text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                  >
                    Send
                  </Link>
                  <Link
                    href="/travel"
                    className="text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                  >
                    Travel
                  </Link>
                </>
              )}

              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-white/5 hover:text-white hover:bg-[#3A0A21] transition-colors px-3 py-2 shadow rounded-xl font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-[#3A0A21] text-white px-6 py-2.5 rounded-full hover:bg-[#4A0A31] transition-colors font-medium"
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

              {user && isSender && (
                <>
                <Link
                    href="/travel"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Become a Traveler
                  </Link>
                  <Link
                    href="/send"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Send
                  </Link>
                  
                  <Link
                    href="/track"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Track Delivery
                  </Link>
                </>
              )}

              {user && isTraveler && (
                <>
                <Link
                    href="/send-package"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Send Package
                  </Link>
                  <Link
                    href="/travel"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Travel
                  </Link>
                  
                  <Link
                    href="/track"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Track Delivery
                  </Link>
                </>
              )}

              {/* Guest Mobile Navigation (not logged in) */}
              {!user && (
                <>
                  <Link
                    href="/send"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Send
                  </Link>
                  <Link
                    href="/travel"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Travel
                  </Link>
                  <Link
                    href="/track"
                    className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Track Delivery
                  </Link>
                </>
              )}

              {user ? (
                <Link
                  href="/dashboard"
                  className="block bg-white/95 backdrop-blur-sm border hover:text-white hover:bg-[#3A0A21] transition-colors px-3 py-2 shadow rounded-xl font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block bg-[#3A0A21] text-white px-6 py-2.5 rounded-full hover:bg-[#4A0A31] transition-colors font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
