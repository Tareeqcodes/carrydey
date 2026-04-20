'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';

const features = [
  {
    label: 'Fast, same-day delivery',
    desc: 'Your customer orders. We deliver the same day. Simple.',
  },
  {
    label: 'Affordable flat rates',
    desc: "Know exactly what you're paying before you book. No surprises.",
  },
  {
    label: 'No WhatsApp chaos',
    desc: 'Everything in one place — bookings, history, support.',
  },
  {
    label: 'Reliable riders who show up',
    desc: 'Every courier is verified and rated by real businesses like yours.',
  },
  {
    label: 'Handles the follow-up for you',
    desc: 'Your customer gets a tracking link. You stop answering "where is my order?" messages.',
  },
];

const faqs = [
  {
    q: 'How fast will my package arrive?',
    a: 'Most deliveries within Lagos and Abuja arrive same-day, usually within 1–3 hours depending on distance and traffic.',
  },
  {
    q: 'How much does a delivery cost?',
    a: 'Prices start from ₦800 and are calculated by distance. You see the full price before you confirm — no hidden charges.',
  },
  {
    q: 'Can I schedule deliveries in advance?',
    a: 'Yes. You can schedule deliveries up to 7 days in advance to fit your needs.',
  },
  {
    q: "What if the rider doesn't show up?",
    a: "We reassign immediately. And your money doesn't leave until delivery is confirmed, so you're never left stranded.",
  },
  {
    q: 'I send packages every day. Is there a better plan for me?',
    a: 'Yes. Businesses that send frequently get access to bulk rates and a dedicated dashboard to manage all their orders.',
  },
  {
    q: 'Can my customers track their delivery?',
    a: 'Yes. They get a link sent to them automatically — no app download needed. You stop being the middle man.',
  },
];

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-black/10 dark:divide-white/10">
      {items.map(({ q, a }, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between text-left group"
          >
            <span className="text-[15px] font-medium text-black dark:text-white group-hover:text-[#00C896] transition-colors">
              {q}
            </span>
            <motion.div
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 ml-4"
            >
              <Plus size={16} className="text-[#00C896]" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                style={{ overflow: 'hidden' }}
              >
                <p className="pt-3 text-sm text-black/60 dark:text-white/60 leading-relaxed pr-8">
                  {a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function ForVendors() {
  return (
    <div
      className="min-h-screen bg-white dark:bg-black"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <motion.div
        className="max-w-2xl mx-auto px-6 pt-16 pb-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40 dark:text-white/40 mb-8">
          For Businesses & Vendors
        </p>

        <h1
          className="text-[clamp(2.6rem,7vw,4rem)] font-normal leading-[1.1] text-black dark:text-white mb-5"
          style={{
            fontFamily: "'DM Serif Display', serif",
            letterSpacing: '-0.02em',
          }}
        >
          Your customer
          <br />
          paid. <em>Deliver fast.</em>
        </h1>

        <p className="text-[17px] text-black/60 dark:text-white/60 leading-relaxed mb-12 max-w-sm">
          Carrydey gets your packages to customers the same day — affordably,
          reliably, without the WhatsApp back-and-forth.
        </p>

        <Link
          href="/send"
          className="inline-flex items-center gap-2 bg-[#00C896] text-black text-sm font-medium px-6 py-3 rounded-full hover:bg-[#00E5AD] transition-colors mb-16"
        >
          Send a package now <ArrowUpRight size={14} />
        </Link>

        {/* Feature list */}
        <div className="space-y-0 divide-y divide-black/10 dark:divide-white/10 border-t border-black/10 dark:border-white/10">
          {features.map(({ label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.1 + i * 0.07,
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="flex items-start justify-between py-4 gap-6"
            >
              <span className="text-[15px] font-medium text-black dark:text-white">
                {label}
              </span>
              <span className="text-sm text-black/50 dark:text-white/50 text-right max-w-[180px] leading-snug">
                {desc}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="my-16 h-px bg-black/10 dark:bg-white/10" />

        {/* Testimonial */}
        <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl px-6 py-6 mb-16">
          <p className="text-[15px] text-black/70 dark:text-white/70 leading-relaxed italic mb-4">
            "I used to spend 30 minutes every day on WhatsApp chasing riders.
            Now I book on Carrydey in 2 minutes and my customers get updates
            automatically. My refund complaints dropped completely."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00C896] text-black text-xs font-bold flex items-center justify-center">
              A
            </div>
            <div>
              <p className="text-[13px] font-semibold text-black dark:text-white">
                Adaeze O.
              </p>
              <p className="text-[11px] text-black/40 dark:text-white/40">
                Fashion vendor, Lagos
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <p className="text-xs font-semibold uppercase tracking-widest text-black/30 dark:text-white/30 mb-6">
          Questions
        </p>
        <Accordion items={faqs} />

        {/* Bottom CTA */}
        <div className="mt-16 flex items-center justify-between border border-black/10 dark:border-white/10 rounded-2xl px-4 py-5 bg-white dark:bg-black">
          <p className="text-[12px] font-medium text-black dark:text-white">
            Send packages daily?
          </p>
          <Link
            href="/send"
            className="inline-flex items-center gap-1 text-[#00C896] text-sm font-bold hover:underline"
          >
            Send now <ArrowUpRight size={13} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
