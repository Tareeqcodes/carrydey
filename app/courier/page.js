'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';

const tabs = ['Riders', 'Agencies'];

const content = {
  Riders: {
    headline: 'More jobs.\nBetter pay.\nNo stress.',
    sub: 'Stop waiting for WhatsApp messages. Carrydey sends jobs to you  verified, paid, and on your terms.',
    pills: ['Free to join', 'Get paid per job', 'Work your own hours'],
    stat1: { num: '120+', label: 'active riders' },
    stat2: { num: '0 fees', label: 'to sign up' },
    testimonial: {
      quote: '"Before Carrydey I was just waiting for people to call me. Now jobs come to me and I know exactly what I\'ll earn before I accept. My income is consistent now."',
      name: 'Emeka D.',
      role: 'Dispatch rider, Lagos',
    },
    cta: 'Start earning today',
    ctaHref: '/login',
  },
  Agencies: {
    headline: 'Run your agency\nwithout\nthe chaos.',
    sub: 'Stop managing drivers on WhatsApp. Carrydey gives your agency a proper system  bookings, payments, and drivers, all in one place.',
    pills: ['Free to start', 'Your own booking link', 'Manage unlimited riders'],
    stat1: { num: '1 link', label: 'customers book from' },
    stat2: { num: '0 calls', label: 'to assign a job' },
    stat3: { num: 'Full', label: 'payment visibility' },
    testimonial: {
      quote: '"We were running everything on WhatsApp missed jobs, confusion, unpaid deliveries. Carrydey gave us a real system. Our drivers are more accountable and clients trust us more."',
      name: 'Biodun A.',
      role: 'Agency owner, Abuja',
    },
    cta: 'Register your agency',
    ctaHref: '/login',
  },
};

const faqs = {
  Riders: [
    {
      q: 'How much can I earn on Carrydey?',
      a: 'It depends on how many jobs you take. Active riders earn between ₦15,000–₦40,000 per week. You see the payout before you accept any job — no guessing.',
    },
    {
      q: 'Is it free to join?',
      a: 'Completely free. Create your profile, get verified, and start receiving jobs. No upfront cost, no monthly fee.',
    },
    {
      q: 'What vehicles can I use?',
      a: 'Bikes, cars, and tricycles are all accepted. As long as you can deliver reliably, you qualify.',
    },
    {
      q: 'When and how do I get paid?',
      a: 'Payment is digital and released after every confirmed delivery. No cash drama, no waiting weeks. What you earn is what you see.',
    },
    {
      q: 'Can I reject jobs I don\'t want?',
      a: 'Yes. You choose which jobs to accept. You\'re never forced to take a delivery that doesn\'t work for you.',
    },
    {
      q: 'What if a customer has a problem with my delivery?',
      a: 'We have a support team that handles disputes fairly. Your history and proof of delivery protect you.',
    },
  ],
  Agencies: [
    {
      q: 'How does the booking link work?',
      a: 'You get a unique Carrydey link for your agency. Share it on WhatsApp, Instagram, or your website. Customers book and pay directly — you just assign the job.',
    },
    {
      q: 'Can I bring my existing riders?',
      a: 'Yes. Add your current team to your dashboard immediately. No need to recruit new riders to get started.',
    },
    {
      q: 'Is there a free plan?',
      a: 'Yes. You can start and run your agency on Carrydey for free. Paid plans unlock analytics, priority support, and advanced features as you grow.',
    },
    {
      q: 'Do my customers need to download an app?',
      a: 'No. Customers book through your link in any browser. No app download required — which means less friction and more completed bookings.',
    },
    {
      q: 'How does payment work for my agency?',
      a: 'All customer payments go through Carrydey\'s secure system. You see every transaction clearly, and payouts are fast and recorded.',
    },
    {
      q: 'What if I have multiple branches or locations?',
      a: 'Reach out to us on WhatsApp. We support multi-location agencies and can set up a structure that fits how you operate.',
    },
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
              className="relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-150 cursor-pointer"
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
            <div className="flex flex-wrap gap-2 mb-10">
              {c.pills.map((p) => (
                <span
                  key={p}
                  className="text-xs font-medium text-[#3A0A21] bg-[#3A0A21]/7 border border-[#3A0A21]/15 px-3 py-1.5 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 mb-12 flex-wrap">
              
              <div>
                <p className="text-[20px] font-semibold text-[#1a1a1a] leading-none">{c.stat1.num}</p>
                <p className="text-xs text-[#aaa] mt-1">{c.stat1.label}</p>
              </div>
              <div className="h-8 w-px bg-[#ebe6e9]" />
              <div>
                <p className="text-[20px] font-semibold text-[#1a1a1a] leading-none">{c.stat2.num}</p>
                <p className="text-xs text-[#aaa] mt-1">{c.stat2.label}</p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={c.ctaHref}
              className="inline-flex items-center gap-2 bg-[#3A0A21] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#521229] transition-colors"
            >
              {c.cta} <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div className="my-16 h-px bg-[#ebe6e9]" />

        {/* Testimonial */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`testimonial-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-[#ebe6e9] rounded-2xl px-6 py-6 mb-16"
          >
            <p className="text-[15px] text-[#444] leading-relaxed italic mb-4">
              {c.testimonial.quote}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#3A0A21] text-white text-xs font-bold flex items-center justify-center">
                {c.testimonial.name[0]}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1a1a1a]">{c.testimonial.name}</p>
                <p className="text-[11px] text-[#aaa]">{c.testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

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