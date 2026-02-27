'use client';
import { motion } from 'framer-motion';
import DashboardSummary from './DashboardSummary';


const MotorcycleSVG = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="mframe" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" /><stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="mwheel" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
        <stop stopColor="#374151" /><stop offset="1" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="mrider" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A" /><stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="mpack" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F87171" /><stop offset="1" stopColor="#DC2626" />
      </linearGradient>
      <filter id="mf"><feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#1D4ED8" floodOpacity="0.35" /></filter>
    </defs>

    {/* ── Rear wheel ── */}
    <circle cx="14" cy="44" r="9" fill="url(#mwheel)" />
    <circle cx="14" cy="44" r="5" fill="#4B5563" />
    <circle cx="14" cy="44" r="2" fill="#9CA3AF" />

    {/* ── Front wheel ── */}
    <circle cx="50" cy="44" r="9" fill="url(#mwheel)" />
    <circle cx="50" cy="44" r="5" fill="#4B5563" />
    <circle cx="50" cy="44" r="2" fill="#9CA3AF" />

    {/* ── Frame / body ── */}
    <path d="M14 44 L22 28 L36 28 L50 44" stroke="url(#mframe)" strokeWidth="4" strokeLinecap="round" filter="url(#mf)" fill="none" />
    {/* Engine block */}
    <rect x="22" y="30" width="16" height="10" rx="3" fill="url(#mframe)" filter="url(#mf)" />
    {/* Exhaust */}
    <path d="M14 40 Q10 42 8 46" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Handlebar */}
    <path d="M44 28 L52 24" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
    {/* Seat */}
    <rect x="24" y="24" width="14" height="5" rx="2.5" fill="#1E40AF" />
    {/* Headlight */}
    <circle cx="52" cy="30" r="3" fill="#FDE68A" opacity="0.9" />

    {/* ── Delivery box on rear ── */}
    <rect x="6" y="28" width="13" height="11" rx="2" fill="url(#mpack)" />
    <line x1="12" y1="28" x2="12" y2="39" stroke="white" strokeWidth="1" opacity="0.5" />
    <line x1="6" y1="33" x2="19" y2="33" stroke="white" strokeWidth="1" opacity="0.5" />

    {/* ── Rider body ── */}
    {/* Torso leaning forward */}
    <path d="M32 26 Q36 18 44 20" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Head / helmet */}
    <circle cx="44" cy="18" r="5" fill="#1D4ED8" />
    <path d="M40 16 Q44 12 48 16" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Visor shine */}
    <path d="M41 19 Q44 16 47 19" stroke="#DBEAFE" strokeWidth="1" fill="none" opacity="0.7" />
    {/* Arms */}
    <path d="M38 22 L44 26" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    {/* Legs */}
    <path d="M32 26 L28 34 L22 34" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const PinSVG = () => (
  <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F87171" /><stop offset="1" stopColor="#DC2626" />
      </linearGradient>
      <filter id="ps"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#EF4444" floodOpacity="0.5" /></filter>
    </defs>
    <path d="M24 4C18.5 4 14 8.5 14 14c0 8 10 20 10 20s10-12 10-20c0-5.5-4.5-10-10-10z" fill="url(#pg)" filter="url(#ps)" />
    <circle cx="24" cy="14" r="4" fill="white" opacity="0.65" />
    <ellipse cx="19" cy="10" rx="3" ry="1.5" fill="white" opacity="0.3" transform="rotate(-30 19 10)" />
  </svg>
);

const CheckSVG = () => (
  <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" /><stop offset="1" stopColor="#059669" />
      </linearGradient>
      <filter id="cs"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10B981" floodOpacity="0.45" /></filter>
    </defs>
    <circle cx="24" cy="24" r="20" fill="url(#cg)" filter="url(#cs)" />
    <ellipse cx="18" cy="14" rx="5" ry="2.5" fill="white" opacity="0.22" transform="rotate(-30 18 14)" />
    <path d="M14 24l7 7 13-14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CoinSVG = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="cf" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A" /><stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="cshadow"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#D97706" floodOpacity="0.5" /></filter>
    </defs>
    {/* 3D side */}
    <ellipse cx="24" cy="33" rx="17" ry="4" fill="#92400E" opacity="0.55" />
    {/* Face */}
    <ellipse cx="24" cy="20" rx="17" ry="10" fill="url(#cf)" filter="url(#cshadow)" />
    {/* Shine */}
    <ellipse cx="17" cy="15" rx="5" ry="2.5" fill="white" opacity="0.35" transform="rotate(-25 17 15)" />
    <text x="24" y="24.5" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold" fontFamily="Georgia,serif">₦</text>
  </svg>
);

const NavSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L20.5 20L12 16L3.5 20L12 2Z" fill="white" />
  </svg>
);

const DashboardPage = ({
  activeDeliveries,
  completedDeliveries = [],
  drivers,
  onNavigateToTracking,
}) => {
  const activeDrivers   = drivers.filter((d) => d.status === 'on_delivery');
  const availableDrivers = drivers.filter((d) => d.status === 'available');
  const inTransit = activeDeliveries.filter(
    (d) => !['delivered', 'pending_assignment'].includes(d.status)
  ).length;

  const today = new Date().toDateString();

  const todayEarnings = completedDeliveries
    .filter((d) => d.status === 'delivered' &&
      new Date(d.$createdAt || d.createdAt).toDateString() === today)
    .reduce((sum, d) => sum + (d.offeredFare || d.suggestedFare || 0), 0);

  const totalEarnings = completedDeliveries
    .filter((d) => d.status === 'delivered')
    .reduce((sum, d) => sum + (d.offeredFare || d.suggestedFare || 0), 0);

  const fmt = (n) =>
    n >= 1000 ? `₦${(n / 1000).toFixed(1)}k` : `₦${n.toLocaleString()}`;

  // const stats = [
  //   { icon: <MotorcycleSVG />, value: activeDrivers.length,    label: 'On Delivery', bg: 'from-blue-50 to-indigo-50',   border: 'border-blue-100',   color: 'text-blue-900' },
  //   { icon: <PinSVG />,   value: inTransit,                label: 'In Transit',  bg: 'from-green-50 to-emerald-50', border: 'border-green-100',  color: 'text-green-900' },
  //   { icon: <CheckSVG />, value: availableDrivers.length,  label: 'Available',   bg: 'from-purple-50 to-pink-50',   border: 'border-purple-100', color: 'text-purple-900' },
  // ];

  return (
    <div className="space-y-5 px-3 pb-16">

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl pt-5 pl-1 font-semibold text-gray-900 tracking-tight"
      >
        Dashboard
      </motion.h1>

      {/* Existing summary cards */}
      <DashboardSummary activeDeliveries={activeDeliveries} drivers={drivers} />

     
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        {/* Today's earnings */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl p-4 shadow-md shadow-amber-200">
          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white opacity-10" />
          <div className="flex items-center gap-2 mb-2">
            <CoinSVG size={22} />
            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">Today</p>
          </div>
          <p className="text-2xl font-bold text-white leading-none">{fmt(todayEarnings)}</p>
          <p className="text-[11px] text-amber-100 mt-1">Earnings</p>
        </div>

        {/* All-time earnings */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 shadow-md">
          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white opacity-5" />
          <div className="flex items-center gap-2 mb-2">
            <CoinSVG size={22} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
          </div>
          <p className="text-2xl font-bold text-white leading-none">{fmt(totalEarnings)}</p>
          <p className="text-[11px] text-slate-500 mt-1">All time</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Card header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Live Routes</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateToTracking}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-xl text-xs font-semibold shadow shadow-[#3A0A21]/20"
          >
            <NavSVG />
            Full Map
          </motion.button>
        </div>

        <div className="p-4">
          {/* Map area */}
          <div
            className="relative rounded-2xl h-52 overflow-hidden border border-indigo-100"
            style={{ background: 'linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 55%,#F5F3FF 100%)' }}
          >
            {/* Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right,rgba(99,102,241,.1) 1px,transparent 1px),
                linear-gradient(to bottom,rgba(99,102,241,.1) 1px,transparent 1px)`,
              backgroundSize: '36px 36px',
            }} />

            {activeDrivers.length > 0 ? (
              activeDrivers.map((driver, i) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.1, type: 'spring' }}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${16 + i * 22}%`, top: `${20 + i * 18}%` }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-blue-400"
                    />
                    <div >
                      <MotorcycleSVG size={32} />
                    </div>
                  </div>
                  <div className="bg-white px-2.5 py-1 rounded-lg text-[10px] font-bold mt-1.5 shadow border border-gray-100 whitespace-nowrap">
                    {driver.name.split(' ')[0]}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-40">
                <MotorcycleSVG />
                <p className="text-xs text-gray-500">No active drivers</p>
              </div>
            )}
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-3 gap-3 mt-4">
            {stats.map(({ icon, value, label, bg, border, color }) => (
              <div
                key={label}
                className={`text-center p-3 rounded-2xl bg-gradient-to-br ${bg} border ${border}`}
              >
                <div className="flex justify-center mb-1.5">{icon}</div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div> */}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;