'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const sections = [
  {
    title: 'Introduction',
    content: `Carrydey Technologies ("Carrydey", "we", "us") operates a logistics marketplace connecting senders, delivery agencies, and independent couriers. This policy explains what data we collect, why, and how we use it. We operate in Nigeria and comply with the Nigerian Data Protection Regulation (NDPR).`,
  },
  {
    title: 'What we collect',
    list: [
      'Account data — name, email, phone number, profile photo.',
      'Verification data — NIN, government ID, selfie for liveness check.',
      'Payment data — bank account details, Paystack transaction IDs, billing history.',
      'Delivery data — pickup/drop locations, package descriptions, proof photos.',
      'Location & usage — GPS coordinates, IP address, device identifiers, app logs.',
      'Communications — support messages and tickets.',
    ],
  },
  {
    title: 'Why we collect it',
    list: [
      'To operate and improve the Carrydey platform.',
      'To process payments and hold funds securely.',
      'To verify identity for safety and trust.',
      'To prevent fraud and enforce our Terms.',
      'To comply with Nigerian legal and regulatory requirements.',
    ],
  },
  {
    title: 'Who we share it with',
    content: 'We share data only where necessary.',
    list: [
      'Paystack — payment processing.',
      'Verification providers — KYC and identity checks.',
      'Cloud and infrastructure providers — hosting, email, SMS.',
      'Law enforcement — only when required by law.',
    ],
    footer: 'We will never sell your personal data.',
  },
  {
    title: 'Data retention',
    content: `We keep your data for as long as needed to provide services and meet legal obligations. Account and transaction records are retained for a minimum of 5 years for compliance purposes.`,
  },
  {
    title: 'Security',
    content: `We use TLS encryption, access controls, and data minimisation to protect your information. If a breach occurs, we will notify affected users promptly in accordance with applicable rules.`,
  },
  {
    title: 'Your rights',
    content: `Under Nigerian law you may request access, correction, portability, or deletion of your data. Some data cannot be deleted while legal or contractual obligations remain active. Contact us to exercise your rights.`,
  },
  {
    title: 'Cookies',
    content: `We use cookies for authentication, analytics, and performance. You can manage cookies in your browser settings, though disabling essential cookies may affect core functionality.`,
  },
  {
    title: 'Changes to this policy',
    content: `We may update this policy from time to time. The effective date will be updated and users notified where appropriate.`,
  },
  {
    title: 'Contact',
    content: `Carrydey Technologies · privacy@carrydey.tech`,
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
              {item.footer && (
                <p className="text-sm text-[#3A0A21] font-medium mt-2">{item.footer}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <p className="text-sm text-[#bbb] mb-16">
          Carrydey Technologies · Last updated November 2025
        </p>

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
            Questions about this policy?{' '}
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