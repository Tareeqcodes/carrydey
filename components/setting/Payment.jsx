'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, Building2, Wallet, Check, Shield } from 'lucide-react';

const methods = [
  {
    id: 'transfer',
    icon: Building2,
    label: 'Bank Transfer',
    desc: 'Transfer directly to our account',
  },
  {
    id: 'cash',
    icon: Banknote,
    label: 'Cash on Delivery',
    desc: 'Pay rider when package arrives',
    badge: 'Most popular',
  },
  {
    id: 'wallet',
    icon: Wallet,
    label: 'Carrydey Wallet',
    desc: 'Use your wallet balance',
    badge: 'Coming soon',
    disabled: true,
  },
];

export default function Payment() {
  const [selected, setSelected] = useState('transfer');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[23px] font-black text-black dark:text-white leading-[1.08] tracking-[-0.02em] mb-2">
          Payment Methods
        </h2>
      </div>

      {/* Wallet balance */}
      <div className="bg-[#00C896] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-2">
            Wallet Balance
          </p>
          <p className="text-white font-bold text-[28px] leading-none">₦0.00</p>
        </div>
        <div className="border border-white/15 text-white/50 text-[12px] font-semibold px-3 py-2 rounded-xl">
          Top up — coming soon
        </div>
      </div>

      {/* Method list */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-[0.12em] px-0.5">
          Default payment
        </p>
        {methods.map((m, i) => {
          const Icon = m.icon;
          const isSelected = selected === m.id;
          return (
            <motion.button
              key={m.id}
              onClick={() => !m.disabled && setSelected(m.id)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={!m.disabled ? { scale: 0.985 } : {}}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-150 text-left
                ${m.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                ${
                  isSelected
                    ? 'bg-black/5 dark:bg-white/5 border-[#00C896]'
                    : 'bg-transparent border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                }`}
            >
              <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-[#00C896]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13.5px] font-semibold text-black dark:text-white">
                    {m.label}
                  </p>
                  {m.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${
                          m.badge === 'Coming soon'
                            ? 'bg-black/10 dark:bg-white/10 text-black/50 dark:text-white/50'
                            : 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
                        }`}
                    >
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-black/60 dark:text-white/60 mt-0.5">
                  {m.desc}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${
                    isSelected
                      ? 'border-[#00C896] bg-[#00C896]'
                      : 'border-black/20 dark:border-white/20'
                  }`}
              >
                {isSelected && (
                  <Check size={11} className="text-white" strokeWidth={3} />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={handleSave}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-4 rounded-2xl text-[13px] font-bold transition-all duration-300 text-white
          ${saved ? 'bg-green-500' : 'bg-[#00C896]'}`}
      >
        {saved ? '✓ Saved' : 'Save Preference'}
      </motion.button>

      <div className="flex items-center gap-2 justify-center">
        <Shield size={12} className="text-black/30 dark:text-white/30" />
        <p className="text-[11px] text-black/50 dark:text-white/50">
          All payments are secure and protected
        </p>
      </div>
    </div>
  );
}
