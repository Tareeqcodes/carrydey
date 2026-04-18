'use client';
import { X, Zap, CheckCircle, Loader2 } from 'lucide-react';

const OFFER_DURATION_S = 20;

const OfferBanner = ({
  offerCountdown,
  onAccept,
  onDecline,
  label = 'A delivery has been matched to you. Accept before time runs out.',
  accepting = false,
}) => {
  const circumference = 2 * Math.PI * 36;
  // Clamp so dashOffset is never negative (happens if offerCountdown > OFFER_DURATION_S
  // on the very first render before the hook ticks down)
  const clampedCount = Math.min(offerCountdown, OFFER_DURATION_S);
  const dashOffset = circumference * (1 - clampedCount / OFFER_DURATION_S);

  if (accepting) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="font-black text-lg text-gray-900">Offer Accepted!</p>
            <p className="text-sm text-gray-500">Loading your delivery...</p>
            <Loader2 className="w-5 h-5 animate-spin text-orange-500 mt-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onDecline}
      />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl">
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
