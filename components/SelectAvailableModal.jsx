'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, MapPin, Clock, Building2, Bike, X } from 'lucide-react';

const SelectAvailableModal = ({ traveler, onCancel, loading, onConfirm }) => {
  if (!traveler) return null;

  const isAgency    = traveler.entityType === 'agency';
  const accentColor = isAgency ? '#3A0A21' : '#FF6B35';
  const TypeIcon    = isAgency ? Building2 : Bike;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50"
        onClick={onCancel}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-md overflow-hidden"
        >
          {/* Colour strip */}
          <div className="h-1.5" style={{ background: accentColor }} />

          <div className="p-6">
            {/* Close */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-[16px] font-bold text-[#1a1a1a]">Confirm booking</p>
              <button
                onClick={onCancel}
                className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Traveler card */}
            <div className="bg-[#f5f3f4] rounded-2xl p-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={traveler.avatar}
                    alt={traveler.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-200"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#f5f3f4]"
                    style={{ background: accentColor }}
                  >
                    <TypeIcon size={9} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[14px] font-bold text-[#1a1a1a] truncate">{traveler.name}</p>
                    {traveler.verified && (
                      <CheckCircle size={13} className="text-blue-500 flex-shrink-0" fill="currentColor" />
                    )}
                  </div>
                  <span
                    className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                    style={{ background: accentColor + '15', color: accentColor }}
                  >
                    {isAgency ? '🏢 Agency' : '🏍️ Courier'}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star size={12} className="text-yellow-400" fill="currentColor" />
                  <span className="text-[12px] font-bold">{traveler.rating}</span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { icon: MapPin,  label: 'Distance', value: `${traveler.distance} km away` },
                  { icon: Clock,   label: 'Pickup',   value: `~${traveler.pickupTime} mins` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-[12px] font-bold text-[#1a1a1a]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

          

            {/* Actions */}
            <div className="flex gap-2.5">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-[13px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all active:scale-97 disabled:opacity-70"
                style={{ background: accentColor }}
              >
                {loading ? 'Sending…' : 'Confirm booking'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectAvailableModal;