import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: '404 — Page Not Found | Carrydey',
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-sm w-full">

        {/* Big 404 */}
        <p
          className="text-[clamp(5rem,20vw,9rem)] font-normal leading-none text-[#ede5e9] select-none mb-8"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          404
        </p>

        <h1
          className="text-[2rem] font-normal text-[#1a1a1a] mb-3 leading-snug"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Wrong turn.
        </h1>

        <p className="text-[15px] text-[#999] mb-10 leading-relaxed">
          This page doesn't exist. Let's get your package back on track.
        </p>

        <div className="flex gap-5 items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#878282] text-sm font-medium px-5 py-3 rounded-full hover:text-[#3A0A21] transition-colors w-fit"
          >
            Go home <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/send"
            className="text-sm text-[#878282] hover:text-[#3A0A21] transition-colors"
          >
            Book a delivery →
          </Link>
        </div>

      </div>
    </div>
  );
}