'use client';
import { X, Zap } from 'lucide-react';

const OFFER_DURATION_S = 20;

/**
 * OfferBanner
 *
 * Bottom-sheet offer notification shared between courier and agency dashboards.
 * Rendered by the parent only when `incomingOffer` is not null.
 *
 * Props:
 *   offerCountdown  number   seconds remaining
 *   onAccept        () => void
 *   onDecline       () => void
 *   label           string   optional descriptor shown under the countdown
 *                            e.g. "A delivery has been matched to you."
 */
const OfferBanner = ({
  offerCountdown,
  onAccept,
  onDecline,
  label = 'A delivery has been matched to you. Accept before time runs out.',
}) => {
  const circumference = 2 * Math.PI * 36; // r=36
  const dashOffset = circumference * (1 - offerCountdown / OFFER_DURATION_S);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onDecline}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <h3 className="font-black text-lg">New Delivery Offer!</h3>
          </div>
          <button onClick={onDecline} className="p-1">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Countdown ring */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#e5e7eb"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#FF6B35"
                strokeWidth="5"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black">{offerCountdown}s</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mb-6">{label}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
