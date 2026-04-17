'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageSquare, Tag, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';

const groups = [
  {
    title: 'Delivery Updates',
    items: [
      { id: 'pickup',    label: 'Rider picked up package', icon: Bell,        on: true  },
      { id: 'transit',   label: 'Package in transit',      icon: Bell,        on: true  },
      { id: 'delivered', label: 'Package delivered',       icon: Bell,        on: true  },
      { id: 'delay',     label: 'Delivery delays',         icon: AlertCircle, on: true  },
    ],
  },
  {
    title: 'Messages',
    items: [
      { id: 'rider_msg',   label: 'Messages from rider', icon: MessageSquare, on: true  },
      { id: 'support_msg', label: 'Support replies',     icon: MessageSquare, on: false },
    ],
  },
  {
    title: 'Promotions',
    items: [
      { id: 'promo',   label: 'Discounts & offers', icon: Tag, on: false },
      { id: 'updates', label: 'Notification',        icon: Tag, on: false },
    ],
  },
];

const Toggle = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
      ${on ? 'bg-[#00C896]' : 'bg-gray-300 dark:bg-gray-600'}`}
  >
    <motion.div
      animate={{ x: on ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
    />
  </button>
);

export default function Notification() {
  const init = {};
  groups.forEach(g => g.items.forEach(i => { init[i.id] = i.on; }));
  const [prefs, setPrefs] = useState(init);
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Header + theme toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-[23px] font-black text-black dark:text-white leading-[1.08] tracking-[-0.02em] mb-2"
           
          >
            Notifications
          </h2>
          
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-bold
            bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {groups.map((group, gi) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.07 }}
          className="bg-black/5 dark:bg-white/10 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden shadow-md"
        >
          <p className="px-4 py-3 text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-[0.12em] border-b border-black/10 dark:border-white/10">
            {group.title}
          </p>
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                  <Icon size={14} className="text-black/50 dark:text-white/50 flex-shrink-0" />
                  <p className="flex-1 text-[13px] font-bold text-black dark:text-white">{item.label}</p>
                  <Toggle on={prefs[item.id]} onToggle={() => setPrefs(p => ({ ...p, [item.id]: !p[item.id] }))} />
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      <motion.button
        onClick={handleSave}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-4 rounded-2xl text-[13px] font-bold transition-all duration-300
          ${saved ? 'bg-green-500 text-white' : 'bg-[#00C896] text-white'}`}
      >
        {saved ? '✓ Saved' : 'Save Preferences'}
      </motion.button>
    </div>
  );
}