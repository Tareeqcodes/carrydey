'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
      scrolled 
        ? 'bg-[#3A0A21] border-[#3A0A21]' 
        : 'bg-white/95 backdrop-blur-sm border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold transition-colors ${
              scrolled ? 'text-white' : 'text-[#3A0A21]'
            }`}>
              Carrydey
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/send"
              className={`transition-colors font-medium ${
                isActive('/send')
                  ? scrolled ? 'text-white border-b-2 border-white' : 'text-[#3A0A21] border-b-2 border-[#3A0A21]'
                  : scrolled ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-[#3A0A21]'
              }`}
            >
              Send
            </Link>
            <Link
              href="/travel"
              className={`transition-colors font-medium ${
                isActive('/travel')
                  ? scrolled ? 'text-white border-b-2 border-white' : 'text-[#3A0A21] border-b-2 border-[#3A0A21]'
                  : scrolled ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-[#3A0A21]'
              }`}
            >
              Travel
            </Link>
            <Link
              href="/track"
              className={`transition-colors font-medium ${
                isActive('/track')
                  ? scrolled ? 'text-white border-b-2 border-white' : 'text-[#3A0A21] border-b-2 border-[#3A0A21]'
                  : scrolled ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-[#3A0A21]'
              }`}
            >
              Track Delivery
            </Link>

            {user && (
              <>
                <Link
                  href="/send-package"
                  className={`transition-colors font-medium ${
                    isActive('/send-package')
                      ? scrolled ? 'text-white border-b-2 border-white' : 'text-[#3A0A21] border-b-2 border-[#3A0A21]'
                      : scrolled ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-[#3A0A21]'
                  }`}
                >
                  Send Package
                </Link>
              </>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    scrolled 
                      ? 'bg-white/20 hover:bg-white/30 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-[#3A0A21]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#3A0A21] flex items-center justify-center text-white font-medium">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={18} />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        // Add your logout logic here
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`px-6 py-2.5 rounded-full transition-colors font-medium ${
                  scrolled 
                    ? 'bg-white text-[#3A0A21] hover:bg-gray-100' 
                    : 'bg-[#3A0A21] text-white hover:bg-[#4A0A31]'
                }`}
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 ${scrolled ? 'text-white' : 'text-[#3A0A21]'}`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-gray-100">
            <Link
              href="/send"
              className={`block font-medium ${
                isActive('/send') ? 'text-[#3A0A21] font-bold' : 'text-gray-700 hover:text-[#3A0A21]'
              } transition-colors`}
            >
              Send
            </Link>
            <Link
              href="/travel"
              className={`block font-medium ${
                isActive('/travel') ? 'text-[#3A0A21] font-bold' : 'text-gray-700 hover:text-[#3A0A21]'
              } transition-colors`}
            >
              Travel
            </Link>
            <Link
              href="/track"
              className={`block font-medium ${
                isActive('/track') ? 'text-[#3A0A21] font-bold' : 'text-gray-700 hover:text-[#3A0A21]'
              } transition-colors`}
            >
              Track Delivery
            </Link>

            {user && (
              <>
                <Link
                  href="/send-package"
                  className={`block font-medium ${
                    isActive('/send-package') ? 'text-[#3A0A21] font-bold' : 'text-gray-700 hover:text-[#3A0A21]'
                  } transition-colors`}
                >
                  Send Package
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    // Add your logout logic here
                  }}
                  className="block w-full text-left text-gray-700 hover:text-[#3A0A21] transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <Link
                href="/login"
                className="block bg-[#3A0A21] text-white px-6 py-2.5 rounded-full hover:bg-[#4A0A31] transition-colors font-medium text-center"
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