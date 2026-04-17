'use client';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import BuiltForEveryone from '@/components/BuiltForEveryone';
import FareNegotiation from '@/components/FareNegotiation';

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="h-px bg-white/10" />
    </div>
  );
}

export default function MainPage() {
  return (
    <div className="min-h-screen">
      <Main />
      <Divider />
      <BuiltForEveryone />
      <Divider />
      <FareNegotiation />
      <Divider />
      <Footer />
    </div>
  );
}