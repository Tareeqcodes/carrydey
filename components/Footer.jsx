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
      icon: <Twitter size={16} />,
    },
    {
      href: 'https://linkedin.com/company/carrydey',
      label: 'LinkedIn',
      icon: <Linkedin size={16} />,
    },
    {
      href: 'https://www.instagram.com/carrydey.ng/',
      label: 'Instagram',
      icon: <Instagram size={16} />,
    },
  ];

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between items-start">

          <div className="w-full md:w-auto">
            <h3 className="font-semibold text-white mb-4 text-center md:text-left text-sm">
              Quick links
            </h3>
            <div className="grid grid-cols-1 gap-2 md:flex md:flex-col">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/40 hover:text-white transition-colors duration-200 text-sm text-center md:text-left"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto">
            <h3 className="font-semibold text-white mb-4 text-center md:text-left text-sm">
              Connect
            </h3>
            <div className="flex justify-center md:justify-start space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-white/30 text-sm text-center">
            © {currentYear} Carrydey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}