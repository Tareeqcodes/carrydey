'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, ArrowRight, X } from 'lucide-react';

export default function Closedagencymodal({
  isOpen,
  onDismiss,
  agencyName,
  message,
  brandColors,
  logoUrl,
}) {
  const parts = message?.split('. Opens ');
  const closedText = parts?.[0] || message;
  const opensText  = parts?.[1] ? `Opens ${parts[1]}` : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Branded top strip */}
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${brandColors.primary}, ${brandColors.accent}, ${brandColors.secondary})`,
              }}
            />

            {/* Dismiss X */}
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="p-7">
              {/* Icon row */}
              <div className="flex items-center gap-3 mb-5">
                {/* Agency logo or clock icon */}
                {logoUrl ? (
                  <div
                    className="w-12 h-12 rounded-2xl border-2 overflow-hidden flex-shrink-0 bg-white"
                    style={{ borderColor: `${brandColors.primary}30` }}
                  >
                    <img
                      src={logoUrl}
                      alt={agencyName}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${brandColors.primary}15, ${brandColors.secondary}15)`,
                    }}
                  >
                    <Clock
                      className="w-6 h-6"
                      style={{ color: brandColors.primary }}
                    />
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {agencyName}
                  </p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">
                    Currently Closed
                  </p>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold text-red-600">
                    {closedText}
                  </span>
                </span>
                {opensText && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                    <Calendar className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">
                      {opensText}
                    </span>
                  </span>
                )}
              </div>

              {/* Message */}
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                You can still place your booking now{' '}
                <span className="font-semibold text-gray-700">{agencyName}</span>{' '}
                will review and process it as soon as they open.
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDismiss}
                className="w-full py-3.5 px-6 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
                  boxShadow: `0 8px 20px -4px ${brandColors.primary}40`,
                }}
              >
                <span>Book Anyway</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <p className="text-center text-xs text-gray-400 mt-3">
                No commitment until you confirm your booking
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}