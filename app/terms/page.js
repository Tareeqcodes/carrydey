'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const sections = [
  {
    title: 'Agreement',
    content: `These Terms govern your use of Carrydey's platform. "Users" includes senders, vendors, delivery agencies, and independent couriers. By using our service you agree to these Terms and all referenced policies.`,
  },
  {
    title: 'Eligibility',
    content: `You must be 18 or older and legally able to form binding contracts under Nigerian law. You must provide accurate information and keep your account up to date.`,
  },
  {
    title: 'Accounts & verification',
    list: [
      'You are responsible for maintaining a secure account.',
      'Carrydey may require identity verification (NIN, government ID, selfie). Verified status is granted at our discretion.',
      'Providing false information may result in immediate account suspension.',
    ],
  },
  {
    title: 'Platform role',
    content: `Carrydey is a technology platform — not a carrier. We connect senders with delivery agencies and independent couriers. We do not take custody of goods and are not liable for physical loss or damage beyond the dispute procedures described below.`,
  },
  {
    title: 'Bookings & deliveries',
    list: [
      'Senders must provide honest, accurate package descriptions. Prohibited items are not allowed.',
      'Couriers and agencies must confirm capacity before accepting jobs.',
      'Proof of pickup and delivery (photo, GPS, or OTP) is required where applicable.',
    ],
  },
  {
    title: 'Payments & escrow',
    list: [
      'Payment must be funded before pickup. Carrydey uses Paystack to collect and settle funds.',
      'Funds are released after delivery confirmation or dispute resolution.',
      'If a sender does not confirm delivery within the review window and proof is present, funds may auto-release.',
    ],
  },
  {
    title: 'Prohibited items',
    content: `You may not use Carrydey to send weapons, illicit drugs, flammable materials, stolen property, or any item restricted by Nigerian law. Violations may result in account termination and referral to authorities.`,
  },
  {
    title: 'Cancellations & refunds',
    content: `Cancellations are governed by our Escrow & Refund Policy. Refund eligibility depends on the stage of the delivery at the time of cancellation.`,
  },
  {
    title: 'Liability',
    list: [
      'Carrydey\'s liability is limited to direct losses caused by our gross negligence.',
      'We are not liable for indirect, incidental, or consequential losses.',
      'Delivery times are estimates — we do not guarantee specific windows.',
    ],
  },
  {
    title: 'Conduct',
    content: `All users must behave respectfully. Abuse, harassment, or illegal conduct may result in permanent suspension. Ratings exist to maintain quality and safety for everyone on the platform.`,
  },
  {
    title: 'Disputes',
    content: `First, contact support via the app or support@carrydey.tech. Unresolved disputes may be escalated through our internal resolution process. Nigerian law applies and disputes are resolved in Nigerian courts.`,
  },
  {
    title: 'Changes to these terms',
    content: `We may update these Terms. Continued use of the platform after changes constitutes acceptance. We will notify users of material changes.`,
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#ebe6e9]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[15px] font-medium text-[#1a1a1a] group-hover:text-[#3A0A21] transition-colors">
          {item.title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="shrink-0 ml-4"
        >
          <Plus size={15} className="text-[#3A0A21]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-6 pr-8 space-y-3">
              {item.content && (
                <p className="text-sm text-[#888] leading-relaxed">{item.content}</p>
              )}
              {item.list && (
                <ul className="space-y-2">
                  {item.list.map((li, i) => (
                    <li key={i} className="text-sm text-[#888] leading-relaxed flex gap-2.5">
                      <span className="text-[#3A0A21] shrink-0 mt-0.5">–</span>
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TermsPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <motion.div
        className="max-w-2xl mx-auto px-6 pt-24 pb-32"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[#bbb] mb-8">
          Legal
        </p>

        <h1
          className="text-[clamp(2.4rem,6vw,3.5rem)] font-normal leading-[1.1] text-[#1a1a1a] mb-4"
          style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
        >
          Terms &amp; Conditions
        </h1>

        <p className="text-sm text-[#bbb] mb-6">
          Carrydey Technologies · Effective November 2025
        </p>

        <div className="bg-[#3A0A21]/5 border border-[#3A0A21]/15 rounded-xl px-5 py-4 mb-14">
          <p className="text-sm text-[#3A0A21] leading-relaxed">
            By creating an account or using Carrydey, you agree to be bound by these Terms. Please read them carefully.
          </p>
        </div>

        <div>
          {sections.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-14 border border-[#e2dce0] rounded-2xl px-6 py-5 bg-white">
          <p className="text-sm text-[#999]">
            Questions about these Terms?{' '}
            <a
              href="mailto:support@carrydey.tech"
              className="text-[#3A0A21] font-medium hover:underline"
            >
              support@carrydey.tech
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}