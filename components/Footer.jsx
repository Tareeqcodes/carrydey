import Link from 'next/link';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/support', label: 'Support Center' },
  ];

  const socialLinks = [
    { 
      href: 'https://twitter.com/carrydey', 
      label: 'Twitter', 
      icon: <Twitter size={20} /> 
    },
    { 
      href: 'https://linkedin.com/company/carrydey', 
      label: 'LinkedIn', 
      icon: <Linkedin size={20} /> 
    },
    { 
      href: 'https://instagram.com/carrydey', 
      label: 'Instagram', 
      icon: <Instagram size={20} /> 
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col text-center items-start md:text-left mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] bg-clip-text text-transparent">
              Carrydey
            </span>
          </div>
          
          <p className="text-gray-600 max-w-md mt-3 text-sm text-start md:text-base leading-relaxed">
            Making travel seamless and efficient. Experience the future of transportation 
            with our innovative solutions that connect people and places effortlessly.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between items-start">
            
            <div className="w-full md:w-auto">
              <h3 className="font-semibold text-gray-900 mb-4 text-center md:text-left">Quick Links</h3>
              <div className="grid grid-cols-1 gap-3 md:flex md:flex-col md:space-y-3">
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

            <div className="w-full md:w-auto">
              <h3 className="font-semibold text-gray-900 mb-4 text-center md:text-left">Connect with us</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#3A0A21] hover:text-white hover:border-[#3A0A21] transition-all duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center">
            © {currentYear} Carrydey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}