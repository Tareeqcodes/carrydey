'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  LogOut,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import Payment from '@/components/setting/Payment';
import Notification from '@/components/setting/Notification';
import Setting from '@/components/setting/Setting';
import Help from '@/components/setting/Help';
import NotUser from '@/hooks/NotUser';

const menuItems = [
  {
    id: 'payment',
    label: 'Payment Methods',
    icon: CreditCard,
    desc: 'Cards & bank accounts',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    desc: 'Alerts & updates',
  },
  {
    id: 'settings',
    label: 'Account Settings',
    icon: Settings,
    desc: 'Profile & preferences',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: HelpCircle,
    desc: 'FAQs & contact',
  },
];

const roleBadge = { sender: 'Customer', courier: 'Rider', agency: 'Agency' };

const renderContent = (id) =>
  ({
    payment: <Payment />,
    notifications: <Notification />,
    settings: <Setting />,
    help: <Help />,
  })[id] ?? (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold text-gray-400">Coming soon</p>
    </div>
  );

export default function Hub() {
  const [active, setActive] = useState(null);
  const { logout, user } = useAuth();
  const { role } = useUserRole();

  if (!user) return <NotUser />;

  const initial = user?.email?.[0]?.toUpperCase() ?? 'U';
  const email = user?.email ?? '';
  const name = user?.displayName || email.split('@')[0] || 'User';
  const badge = roleBadge[role] ?? 'User';

  const slide = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: { type: 'spring', stiffness: 340, damping: 34 },
    },
    exit: {
      x: '100%',
      transition: { type: 'spring', stiffness: 340, damping: 34 },
    },
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-36">
        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 rounded-3xl p-5 mb-6 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 flex-shrink-0">
              <span className="text-white font-bold text-xl">{initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-bold text-[17px] truncate">
                  {name}
                </p>
                <span className="bg-white/15 text-white/70 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-white/15 uppercase tracking-widest flex-shrink-0">
                  {badge}
                </span>
              </div>
              <p className="text-white/50 text-[12px] truncate font-medium">
                {email}
              </p>
            </div>
          </div>
        </motion.div>

        {/* MENU */}
        <div className="flex flex-col gap-2 mb-5">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActive(item.id)}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.22 }}
                whileTap={{ scale: 0.985 }}
                className="w-full flex items-center gap-3.5 p-4 bg-white/10 rounded-2xl  hover:shadow-sm transition-all duration-150 text-left"
              >
                <div className="w-9 h-9 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center">
                  <Icon size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-white">{item.label}</p>
                  <p className="text-[12px] text-white/50 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-white/30 flex-shrink-0"
                />
              </motion.button>
            );
          })}
        </div>

        {/* WHATSAPP */}
        <motion.a
          href="https://wa.me/2349124498160?text=Hi%20Carrydey%2C%20I%20need%20help"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 w-full bg-white/10 border border-white/10 rounded-2xl p-4 mb-3 hover:border-white/20 hover:bg-white/15 transition-colors shadow-md"
        >
          <div className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
            <Phone size={15} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white">
              Chat with us
            </p>
            <p className="text-[12px] text-white/50">WhatsApp support</p>
          </div>
          <ChevronRight size={14} className="text-gray-300" />
        </motion.a>

        {/* LOGOUT */}
        <motion.button
          onClick={logout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-[13px] font-bold hover:bg-red-500/20 transition-colors shadow-md"
        >
          <LogOut size={14} />
          Log out
        </motion.button>

        <p className="text-center text-[10px] text-white/30 mt-6">
          Carrydey · Made for Nigeria 🇳🇬
        </p>
      </div>

      {/* SLIDE-IN PANEL */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active}
            variants={slide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 z-30 bg-black overflow-y-auto"
          >
            {/* FIXED: sticky bar full-width, inner wrapper matches content width */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-white/10">
              <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
                <button
                  onClick={() => setActive(null)}
                  className="flex items-center gap-2.5 text-white text-[13px] font-bold"
                >
                  <div className="w-8 h-8 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center">
                    <ArrowLeft size={13} className="text-white" />
                  </div>
                  Back
                </button>
              </div>
            </div>

            <div className="max-w-lg mx-auto px-4 pt-4 pb-32">
              {renderContent(active)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
