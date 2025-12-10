import '../assets/globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/Authcontext';
import Navbar from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Carrydey',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'NGN',
  },
  description:
    'Connect senders and travelers globally for affordable package delivery. Send items worldwide or earn money delivering on your trips.',
  url: 'https://carrydey.tech',
  provider: {
    '@type': 'Organization',
    name: 'Carrydey',
    url: 'https://carrydey.tech',
    logo: '/logo.png',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Carrydey',
  url: 'https://carrydey.tech',
  logo: '/logo.png',
  description:
    'Peer-to-peer package delivery platform connecting travelers and senders worldwide',
  sameAs: [
    'https://twitter.com/Carrydey',
    'https://facebook.com/Carrydey',
    'https://instagram.com/Carrydey',
  ],
};

export const metadata = {
  title: {
    default:
      'Carrydey - Send Packages Worldwide with Travelers | Earn Money Delivering',
    template: '%s | Carrydey',
  },
  description:
    'Connect senders and travelers globally. Send packages affordably with verified travelers or earn money by delivering items on your next trip. Safe, fast, and reliable peer-to-peer delivery.',
  keywords: [
    'package delivery',
    'send packages abroad',
    'international shipping',
    'peer to peer delivery',
    'earn money traveling',
    'traveler income',
    'affordable shipping',
    'send items overseas',
    'delivery service',
    'crowdshipping',
    'travel and earn',
    'package forwarding',
    'international courier',
    'ship packages cheap',
    'earn while traveling',
    'traveler delivery app',
    'crowdsourced shipping',
    'package with traveler',
    'earn as traveler',
    'deliver packages within nigeria',
    'carrydey',
    'carrydey tech',
    'carrydey delivery',
    'carrydey app',
    'carrydey nigeria',
    'carrydey africa',
    'carrydey worldwide',
  ],

  authors: [{ name: 'Carrydey Team' }],
  creator: 'Carrydey',
  publisher: 'Carrydey',

  // Application Info
  applicationName: 'Carrydey',
  category: 'Logistics & Travel',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://carrydey.tech',
    siteName: 'Carrydey',
    title: 'Carrydey - Send Packages with Travelers or Earn Money Delivering',
    description:
      'Join thousands using Carrydey to send packages worldwide affordably or earn extra income while traveling. Safe, verified, and community-driven delivery.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Carrydey - Global Package Delivery Platform',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@Carrydey',
    creator: '@Carrydey',
    title: 'Carrydey - Send Packages with Travelers or Earn Money Delivering',
    description:
      'Affordable international package delivery through travelers. Send items worldwide or earn money on your trips.',
    images: ['/twitter-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification Tags (Add your verification codes)
  verification: {
    google: 'your-google-verification-code',
  },

  // Additional Meta Tags
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

  themeColor: '#3A0A21',
  colorScheme: 'light',

  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <main>
            <Navbar />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
