'use client';

import { MapPin, Users, Clock } from 'lucide-react';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import How from '@/components/How';
import BuiltForEveryone from '@/components/BuiltForEveryone';
import FareNegotiation from '@/components/FareNegotiation';

import { useEffect } from 'react';
function FontLoader() {
  useEffect(() => {
    if (document.getElementById('cd-fonts')) return;
    const link = document.createElement('link');
    link.id = 'cd-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap';
    document.head.appendChild(link);
  }, []);
  return null;
}

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="h-px bg-gray-100" />
    </div>
  );
}

export default function MainPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    >
      <FontLoader />

      <Main />

      <Divider />
      <BuiltForEveryone />
      <How />

      <Divider />

      <FareNegotiation />

      <Divider />
      <Footer />
    </div>
  );
}
