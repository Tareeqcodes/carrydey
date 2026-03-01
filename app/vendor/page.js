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
    a: 'Yes. They get a link sent to them automatically  no app download needed. You stop being the middle man.',
  },
  {
    q: 'What areas do you cover?',
    a: 'We’re growing across Nigeria. Enter your location to see available couriers.',
  },
];

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-[#ebe6e9]">
      {items.map(({ q, a }, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between text-left group"
          >
            <span className="text-[15px] font-medium text-[#1a1a1a] group-hover:text-[#3A0A21] transition-colors">
              {q}
            </span>
            <motion.div
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 ml-4"
            >
              <Plus size={16} className="text-[#3A0A21]" />
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
                <p className="pt-3 text-sm text-[#888] leading-relaxed pr-8">
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
      className="min-h-screen bg-[#faf9f7]"
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
        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-widest text-[#bbb] mb-8">
          For Businesses & Vendors
        </p>

        {/* Headline — speaks to the real pain */}
        <h1
          className="text-[clamp(2.6rem,7vw,4rem)] font-normal leading-[1.1] text-[#1a1a1a] mb-5"
          style={{
            fontFamily: "'DM Serif Display', serif",
            letterSpacing: '-0.02em',
          }}
        >
          Your customer
          <br />
          paid. <em>Deliver fast.</em>
        </h1>

        <p className="text-[17px] text-[#777] leading-relaxed mb-12 max-w-sm">
          Carrydey gets your packages to customers the same day affordably,
          reliably, without the WhatsApp back-and-forth.
        </p>

        {/* CTA */}
        <Link
          href="/send"
          className="inline-flex items-center gap-2 bg-[#3A0A21] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#521229] transition-colors mb-16"
        >
          Send a package now <ArrowUpRight size={14} />
        </Link>

        {/* Feature list */}
        <div className="space-y-0 divide-y divide-[#ebe6e9] border-t border-[#ebe6e9]">
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
              <span className="text-[15px] font-medium text-[#1a1a1a]">
                {label}
              </span>
              <span className="text-sm text-[#aaa] text-right max-w-[180px] leading-snug">
                {desc}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-[#ebe6e9]" />

        {/* Testimonial — one real voice beats five bullet points */}
        <div className="bg-white border border-[#ebe6e9] rounded-2xl px-6 py-6 mb-16">
          <p className="text-[15px] text-[#444] leading-relaxed italic mb-4">
            "I used to spend 30 minutes every day on WhatsApp chasing riders.
            Now I book on Carrydey in 2 minutes and my customers get updates
            automatically. My refund complaints dropped completely."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3A0A21] text-white text-xs font-bold flex items-center justify-center">
              A
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#1a1a1a]">
                Adaeze O.
              </p>
              <p className="text-[11px] text-[#aaa]">Fashion vendor, Lagos</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <p className="text-xs font-semibold uppercase tracking-widest text-[#bbb] mb-6">
          Questions
        </p>
        <Accordion items={faqs} />

        {/* Bottom CTA strip */}
        <div className="mt-16 flex items-center justify-between border border-[#e2dce0] rounded-2xl px-4 py-5 bg-white">
          <p className="text-[12px] font-medium text-[#1a1a1a]">
            Send packages daily? 
          </p>
          <Link
            href="/send"
            className="inline-flex items-center gap-1 text-[#3A0A21] text-sm font-bold hover:underline"
          >
            Send now <ArrowUpRight size={13} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
