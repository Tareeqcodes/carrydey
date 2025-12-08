import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/support', label: 'Support Center' },
  ];

  const socialLinks = [
    { href: 'https://twitter.com/carrydey', label: 'Twitter', icon: '𝕏' },
    { href: 'https://linkedin.com/company/carrydey', label: 'LinkedIn', icon: 'in' },
    { href: 'https://instagram.com/carrydey', label: 'Instagram', icon: 'ig' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/60">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Brand Section with Paragraph */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] bg-clip-text text-transparent">
              Carrydey
            </span>
          </div>
          
          <p className="text-gray-600 max-w-md mt-3 text-sm md:text-base leading-relaxed">
            Making travel seamless and efficient. Experience the future of transportation 
            with our innovative solutions that connect people and places effortlessly.
          </p>
        </div>

        {/* Links and Social Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:items-start">
            
            {/* Quick Links - Stack on mobile, row on desktop */}
            <div className="w-full md:w-auto">
              <h3 className="font-semibold text-gray-900 mb-4 text-center md:text-left">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3 md:flex md:flex-col md:space-y-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-600 hover:text-[#3A0A21] transition-colors duration-200 text-sm md:text-base text-center md:text-left px-2 py-1 rounded-md hover:bg-gray-50 md:hover:bg-transparent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="w-full md:w-auto">
              <h3 className="font-semibold text-gray-900 mb-4 text-center md:text-left">Connect With Us</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#3A0A21] hover:text-white hover:border-[#3A0A21] transition-all duration-200 active:scale-95"
                  >
                    <span className="font-semibold text-base">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter - Full width on mobile, normal on desktop */}
            <div className="w-full md:w-auto md:max-w-xs">
              <h3 className="font-semibold text-gray-900 mb-4 text-center md:text-left">Stay Updated</h3>
              <form className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent outline-none transition-all text-sm md:text-base"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#3A0A21] text-white rounded-lg hover:bg-[#4A0A31] transition-colors duration-200 font-medium text-sm md:text-base active:scale-[0.98]"
                >
                  Subscribe to Newsletter
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright Bar - At the very end */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Legal Links - Center aligned on mobile */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-[#3A0A21] transition-colors duration-200 px-2 py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Copyright - Last element */}
            <div className="mt-4 pt-4 border-t border-gray-100 w-full">
              <p className="text-gray-600 text-sm">
                © {currentYear} Carrydey. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Designed for seamless travel experiences worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}