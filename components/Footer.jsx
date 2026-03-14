import Link from 'next/link';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  const socialLinks = [
    { 
      href: 'https://www.instagram.com/carrydey.ng/', 
      label: 'Twitter', 
      icon: <Twitter size={20} /> 
    },
    { 
      href: 'https://linkedin.com/company/carrydey', 
      label: 'LinkedIn', 
      icon: <Linkedin size={20} /> 
    },
    { 
      href: 'https://www.instagram.com/carrydey.ng/', 
      label: 'Instagram', 
      icon: <Instagram size={20} /> 
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between items-start">
            
            <div className="w-full md:w-auto">
              <h3 className="font-semibold text-gray-900 mb-4 text-center md:text-left">Quick Links</h3>
              <div className="grid grid-cols-1 gap-3 md:flex md:flex-col md:space-y-2">
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