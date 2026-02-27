'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';

const tabs = ['Riders', 'Agencies'];

const content = {
  Riders: {
    headline: 'Your hustle,\nnow on record.',
    sub: 'Get verified, receive jobs, and build a delivery history that speaks for you.',
    pills: ['Verified profile', 'Transparent pay', 'Flexible hours'],
  },
  Agencies: {
    headline: 'Run your agency\nlike a tech company.',
    sub: 'One link. Customers book, pay, and track — you manage everything from a single dashboard.',
    pills: ['Booking link', 'Driver management', 'Analytics'],
  },

};

const faqs = {
  Riders: [
    { q: 'Is it free to join?', a: 'Yes. Create your profile and start receiving jobs at no cost.' },
    { q: 'What vehicles are accepted?', a: 'Bikes, cars, tricycles — any vehicle works.' },
    { q: 'How do I get paid?', a: 'All payments are digital, recorded, and visible to you after every job.' },
    { q: 'Can I choose my jobs?', a: 'Yes. You have the freedom to accept or decline any job that comes your way.' },
    { q: 'What if I have an issue with a delivery?', a: 'Our support team is available 24/7 to assist you with any problems or concerns.' },
  ],
  Agencies: [
    { q: 'Do customers need the app?', a: 'No. They book directly from the link you share — no download needed.' },
    { q: 'Can I add my existing riders?', a: 'Yes. Bring your current team and assign them jobs immediately.' },
    { q: 'Is there a free plan?', a: 'Yes. Start free and scale as your operations grow.' },
    { q: 'How does the dashboard help?', a: 'Manage bookings, track deliveries, and view analytics all in one place.' },
    { q: 'What support do you offer?', a: 'Our team is here 24/7 to help you with any questions or issues.' },
  ],
};

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
                <p className="pt-3 text-sm text-[#888] leading-relaxed pr-8">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function Earn() {
  const [active, setActive] = useState('Riders');
  const c = content[active];

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-2xl mx-auto px-6 pt-16 pb-32">

        {/* Tab toggle */}
        <div className="flex gap-1 bg-white border border-[#e8e2e5] rounded-full p-1 w-fit mb-16">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className="relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-150"
              style={{ color: active === t ? '#fff' : '#999' }}
            >
              {active === t && (
                <motion.span
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-full bg-[#3A0A21]"
                  style={{ zIndex: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>

        {/* Hero text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h1
              className="text-[clamp(2.6rem,7vw,4rem)] font-normal leading-[1.1] text-[#1a1a1a] mb-5 whitespace-pre-line"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
            >
              {c.headline}
            </h1>

            <p className="text-[17px] text-[#777] leading-relaxed mb-8 max-w-sm">
              {c.sub}
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2 mb-12">
              {c.pills.map((p) => (
                <span
                  key={p}
                  className="text-xs font-medium text-[#3A0A21] bg-[#3A0A21]/7 border border-[#3A0A21]/15 px-3 py-1.5 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#3A0A21] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#521229] transition-colors"
            >
              Get started free <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div className="my-16 h-px bg-[#ebe6e9]" />

        {/* FAQ */}
        <p className="text-xs font-semibold uppercase tracking-widest text-[#bbb] mb-6">
          Questions
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={`faq-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Accordion items={faqs[active]} />
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}