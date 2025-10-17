'use client';
import Header from '@/hooks/Header';
import TravelerTransit from '@/components/TravelerTransit';

export default function page() {
  return (
    <>
      <div className="p-5 pb-24">
        <Header title="Back to Dashboard" showBack />

        <TravelerTransit />
      </div>
    </>
  );
}
