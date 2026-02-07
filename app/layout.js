import '../assets/globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/hooks/Authcontext';
import Navbar from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const structuredData = {
  '@context': 'https://schema.org',
  '@type': ['WebApplication', 'SoftwareApplication'],
  name: 'Carrydey',
  applicationCategory: 'LogisticsApplication',
  operatingSystem: 'Any',
  description:
    'Carrydey is a logistics marketplace that connects Vendors with verified delivery agencies and independent couriers. Book deliveries, track orders, manage payments, and scale logistics operations easily.',
  url: 'https://carrydey.tech',
  provider: {
    '@type': 'Organization',
    name: 'Carrydey Technologies',
    url: 'https://carrydey.tech',
    logo: '/icon-192.png',
  },
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Carrydey Technologies',
  url: 'https://carrydey.tech',
  logo: '/og-image.svg',
  description:
    'A logistics technology company enabling delivery agencies and independent couriers to manage bookings, payments, drivers, and tracking through one platform.',
     areaServed: [
    {
      '@type': 'Country',
      name: 'Nigeria',
    },
    {
      '@type': 'Country',
      name: 'Ghana',
    },
    {
      '@type': 'Country',
      name: 'Kenya',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Kano State',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Lagos State',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Abuja',
    },
  ],
  sameAs: [
    'https://twitter.com/Carrydey',
    'https://facebook.com/Carrydey',
    'https://instagram.com/Carrydey.ng',
  ],
};

export const metadata = {
  title: {
    default:
  'Carrydey | Book & Manage Deliveries with Trusted Couriers in Nigeria',    
    template: '%s | Carrydey',
  },

  description:
    'Carrydey connects customers with verified delivery agencies and independent couriers. Book deliveries, track orders in real time, manage payments, and scale logistics operations across Nigeria.',

  keywords: [
    // Core logistics keywords
    'logistics marketplace',
    'delivery booking platform',
    'courier marketplace nigeria',
    'last mile delivery nigeria',
    'delivery management software',
    'package delivery',
    'logistics saas africa',
    'courier jobs nigeria',
    'dispatch rider platform',
    'delivery agency software',
    'track delivery nigeria',
    'same day delivery nigeria',
    'on-demand delivery',
    'delivery management software',
    'logistics saas africa',
    'courier jobs nigeria',
    'dispatch rider platform',
    'delivery agency software',
    
    // Brand keywords
    'carrydey',
    'carrydey tech',
    'carrydey logistics',
    'carrydey nigeria',
    
    // Popular search terms - sending & booking
    'send package nigeria',
    'how to send package in nigeria',
    'book delivery nigeria',
    'courier services near me',
    'cheapest courier in nigeria',
    'reliable courier service',
    'express delivery nigeria',
    'door to door delivery',
    'parcel delivery service',
    'package tracking nigeria',
    
    // E-commerce & business logistics
    'ecommerce logistics nigeria',
    'logistics for online business',
    'delivery for small business',
    'dispatch rider services',
    'courier for sme',
    'business delivery solution',
    'logistics platform for vendors',
    'marketplace delivery',
    
    // Location-based
    'courier service lagos',
    'delivery service abuja',
    'logistics company nigeria',
    'nigerian logistics',
    'local delivery nigeria',
    'interstate delivery nigeria',
    'nationwide courier',
    
    // Service-specific
    'freight forwarding nigeria',
    'courier express parcel',
    'CEP services nigeria',
    'third party logistics',
    '3pl nigeria',
    'logistics management system',
    'delivery tracking system',
    'real-time package tracking',
    
    // Rider/Agency focused
    'independent courier jobs',
    'dispatch rider jobs nigeria',
    'freelance courier',
    'delivery agency management',
    'courier booking link',
    'logistics agency software',
    'rider management system',
    'courier performance tracking',
    
    // Mobile & payment
    'mobile delivery booking',
    'delivery payment platform',
    'logistics fintech',
    'courier payment management',
    
    // Comparative/trending
    'best courier nigeria 2025',
    'affordable logistics nigeria',
    'fast delivery service',
    'trusted courier company',
    'logistics marketplace africa',
    'delivery platform nigeria',
  ],

  authors: [{ name: 'Carrydey Technologies' }],
  creator: 'Carrydey',
  publisher: 'Carrydey Technologies',

  applicationName: 'Carrydey',
  category: 'Logistics & Transportation',

  metadataBase: new URL('https://carrydey.tech'),

  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://carrydey.tech',
    siteName: 'Carrydey',
    title:
      'Carrydey | Book & Manage Deliveries with Trusted Couriers',
    description:
      'A logistics marketplace for customers, delivery agencies, and independent couriers. Book deliveries, track orders, manage payments, and grow your logistics business.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Carrydey Logistics Marketplace',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@Carrydey',
    creator: '@Carrydey',
    title: 'Carrydey | Logistics Marketplace',
    description:
      'Book deliveries, track orders, and manage logistics operations with trusted couriers and delivery agencies.',
    images: ['/twitter-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  alternates: {
    canonical: 'https://carrydey.tech',
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3A0A21',
  colorScheme: 'light',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen">
            <Navbar />
            {children}
            <Analytics />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}