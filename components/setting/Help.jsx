'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MessageSquare, Plus, ArrowUpRight } from 'lucide-react';

const faqs = [
  { q: 'How do I book a delivery?',          a: 'Enter pickup and dropoff on the home screen, describe your package, then pick a courier. Takes under 2 minutes.' },
  { q: 'How much does a delivery cost?',     a: 'Prices start from ₦800 based on distance. You always see the full price before you confirm — no hidden charges.' },
  { q: 'What if my rider doesn\'t show up?', a: 'We reassign immediately. Your payment is held until delivery is confirmed so you\'re always protected.' },
  { q: 'How do I track my package?',         a: 'Go to the Track tab. You also get a shareable link to send to whoever is receiving the package.' },
  { q: 'Can I cancel a booking?',            a: 'Yes, before a rider accepts. Once a rider is on their way, cancellation may attract a small fee.' },
  { q: 'How do I report a problem?',         a: 'WhatsApp us — it\'s the fastest way. We respond within 30 minutes during business hours.' },
];

const Faq = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <p className="text-[13px] font-semibold text-[#1a1a1a] leading-snug flex-1">{item.q}</p>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.18 }}
          className="flex-shrink-0"
        >
          <Plus size={15} className="text-[#3A0A21]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <p className="px-4 pb-4 pt-1 text-[12px] text-gray-500 leading-relaxed border-t border-gray-50">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Help() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-bold text-[#1a1a1a]">Help & Support</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">We're here when you need us</p>
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-0.5">Contact Us</p>

        <a
          href="https://wa.me/2349124498160?text=Hi%20Carrydey%2C%20I%20need%20help"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
        >
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
            <Phone size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13.5px] font-semibold text-[#1a1a1a]">WhatsApp</p>
            <p className="text-[11px] text-gray-400">Fastest · usually under 30 mins</p>
          </div>
          <ArrowUpRight size={13} className="text-gray-300" />
        </a>

        <a
          href="mailto:support@carrydey.tech"
          className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
        >
          <div className="w-10 h-10 bg-[#3A0A21]/8 rounded-xl flex items-center justify-center flex-shrink-0">
            <Mail size={16} className="text-[#3A0A21]" />
          </div>
          <div className="flex-1">
            <p className="text-[13.5px] font-semibold text-[#1a1a1a]">Email</p>
            <p className="text-[11px] text-gray-400">support@carrydey.tech</p>
          </div>
          <ArrowUpRight size={13} className="text-gray-300" />
        </a>

        <a
          href="https://www.instagram.com/carrydey.ng/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366)' }}>
            <MessageSquare size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13.5px] font-semibold text-[#1a1a1a]">Instagram</p>
            <p className="text-[11px] text-gray-400">@carrydey.ng</p>
          </div>
          <ArrowUpRight size={13} className="text-gray-300" />
        </a>
      </div>

      {/* FAQs */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-0.5">FAQs</p>
        {faqs.map((item, i) => <Faq key={i} item={item} index={i} />)}
      </div>

      {/* Hours */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
        <p className="text-[12px] text-gray-400 leading-relaxed">
          Support hours: <span className="font-semibold text-[#1a1a1a]">Mon–Sat, 8am–9pm</span><br />
          <span className="text-[11px]">Urgent issues: WhatsApp only</span>
        </p>
      </div>
    </div>
  );
}