'use client';
import { motion } from 'framer-motion';

const MotorcycleSVG = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient
        id="mframe"
        x1="0"
        y1="0"
        x2="64"
        y2="64"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient
        id="mwheel"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#374151" />
        <stop offset="1" stopColor="#111827" />
      </linearGradient>
      <linearGradient
        id="mrider"
        x1="0"
        y1="0"
        x2="64"
        y2="64"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FDE68A" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient
        id="mpack"
        x1="0"
        y1="0"
        x2="64"
        y2="64"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F87171" />
        <stop offset="1" stopColor="#DC2626" />
      </linearGradient>
      <filter id="mf">
        <feDropShadow
          dx="0"
          dy="2"
          stdDeviation="1.5"
          floodColor="#1D4ED8"
          floodOpacity="0.35"
        />
      </filter>
    </defs>
    <circle cx="14" cy="44" r="9" fill="url(#mwheel)" />
    <circle cx="14" cy="44" r="5" fill="#4B5563" />
    <circle cx="14" cy="44" r="2" fill="#9CA3AF" />
    <circle cx="50" cy="44" r="9" fill="url(#mwheel)" />
    <circle cx="50" cy="44" r="5" fill="#4B5563" />
    <circle cx="50" cy="44" r="2" fill="#9CA3AF" />
    <path
      d="M14 44 L22 28 L36 28 L50 44"
      stroke="url(#mframe)"
      strokeWidth="4"
      strokeLinecap="round"
      filter="url(#mf)"
      fill="none"
    />
    <rect
      x="22"
      y="30"
      width="16"
      height="10"
      rx="3"
      fill="url(#mframe)"
      filter="url(#mf)"
    />
    <path
      d="M14 40 Q10 42 8 46"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M44 28 L52 24"
      stroke="#93C5FD"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <rect x="24" y="24" width="14" height="5" rx="2.5" fill="#1E40AF" />
    <circle cx="52" cy="30" r="3" fill="#FDE68A" opacity="0.9" />
    <rect x="6" y="28" width="13" height="11" rx="2" fill="url(#mpack)" />
    <line
      x1="12"
      y1="28"
      x2="12"
      y2="39"
      stroke="white"
      strokeWidth="1"
      opacity="0.5"
    />
    <line
      x1="6"
      y1="33"
      x2="19"
      y2="33"
      stroke="white"
      strokeWidth="1"
      opacity="0.5"
    />
    <path
      d="M32 26 Q36 18 44 20"
      stroke="#F59E0B"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="44" cy="18" r="5" fill="#1D4ED8" />
    <path
      d="M40 16 Q44 12 48 16"
      stroke="#93C5FD"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M41 19 Q44 16 47 19"
      stroke="#DBEAFE"
      strokeWidth="1"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M38 22 L44 26"
      stroke="#F59E0B"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M32 26 L28 34 L22 34"
      stroke="#374151"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const DashboardPage = ({
  activeDeliveries,
  completedDeliveries = [],
  drivers,
  onNavigateToTracking,
}) => {
  const activeDrivers = drivers.filter((d) => d.status === 'on_delivery');
  const activeCount = activeDeliveries.filter(
    (d) => d.status !== 'delivered'
  ).length;

  return (
    <div className="min-h-screen bg-black px-4 mb-10 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Super minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-light text-white tracking-tight">
            Fleet Overview
          </h1>
          <p className="text-sm text-white/30 mt-1 font-light">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        {/* The Map - Full focus */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
              boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5)',
            }}
          >
            {/* Map Grid */}
            <div className="relative h-[500px]">
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
                  backgroundSize: '50px 50px',
                }}
              />

              {/* Route lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 100 150 Q 250 100, 400 200 T 600 350"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="6 8"
                  opacity="0.3"
                />
                <path
                  d="M 150 300 Q 300 350, 450 250 T 700 150"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="6 8"
                  opacity="0.3"
                />
              </svg>

              {/* Active Drivers */}
              {activeDrivers.length > 0 ? (
                activeDrivers.map((driver, i) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="absolute"
                    style={{
                      left: `${20 + ((i * 30) % 70)}%`,
                      top: `${30 + ((i * 20) % 60)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="relative group">
                      {/* Pulse ring */}
                      <motion.div
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-[#22c55e]"
                      />
                      {/* Driver marker */}
                      <div className="relative z-10 bg-[#22c55e] rounded-full p-2 shadow-lg">
                        <MotorcycleSVG size={20} />
                      </div>
                      {/* Label */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <p className="text-[10px] font-medium text-white/60 bg-white/5 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {driver.name?.split(' ')[0] || 'Driver'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                      <MotorcycleSVG size={32} />
                    </div>
                    <p className="text-white/40 text-sm font-light">
                      No active deliveries
                    </p>
                    <p className="text-white/20 text-xs mt-1">
                      Waiting for new orders
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Map overlay controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={onNavigateToTracking}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-xs font-medium text-white transition-all"
              >
                Expand Map →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats - Clean and minimal */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-xl p-4"
          >
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
              Active
            </p>
            <p className="text-2xl font-light text-white mt-1">{activeCount}</p>
            <p className="text-[10px] text-white/20 mt-1">deliveries</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/5 rounded-xl p-4"
          >
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
              On Road
            </p>
            <p className="text-2xl font-light text-white mt-1">
              {activeDrivers.length}
            </p>
            <p className="text-[10px] text-white/20 mt-1">drivers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-xl p-4"
          >
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
              Completed
            </p>
            <p className="text-2xl font-light text-white mt-1">
              {completedDeliveries.length}
            </p>
            <p className="text-[10px] text-white/20 mt-1">total</p>
          </motion.div>
        </div>

        {/* Recent activity - Optional minimal section */}
        {activeDrivers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 pt-4 border-t border-white/5"
          >
            <p className="text-[10px] font-medium text-white/20 uppercase tracking-wider mb-3">
              Live Status
            </p>
            <div className="space-y-2">
              {activeDrivers.slice(0, 2).map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                    <span className="text-xs text-white/60">{driver.name}</span>
                  </div>
                  <span className="text-[10px] text-white/30">en route</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
