'use client';
import { useEffect, useRef } from 'react';
import { X, Zap, CheckCircle, Loader2, MapPin, Navigation } from 'lucide-react';

const OFFER_DURATION_S = 20;

// ── Tiny audio helper ──────────────────────────────────────────────────────
// Generates a short two-tone ping using the Web Audio API.
// No external file needed — works offline and feels native.
const playOfferSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    // First tone — higher pitch
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.connect(gain);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.18);

    // Second tone — resolution note
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.2);
    osc2.connect(gain);
    osc2.start(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (_) {
    // AudioContext blocked (e.g. no user gesture yet) — silent fallback
  }
};

// ── Vibration helper ────────────────────────────────────────────────────────
const vibrateOffer = () => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  } catch (_) {}
};

// ──────────────────────────────────────────────────────────────────────────
// OfferBanner
//
// Props:
//   offerCountdown   number        seconds remaining (from useDispatchOffer)
//   onAccept         () => void
//   onDecline        () => void
//   accepting        boolean       shows "accepted" confirmation state
//   offer            object|null   incomingOffer from useDispatchOffer
//                                  shape: { deliveryId, expiresAt, queueId,
//                                           fare?, distance?, pickup? }
//   label            string        fallback body copy
// ──────────────────────────────────────────────────────────────────────────
const OfferBanner = ({
  offerCountdown,
  onAccept,
  onDecline,
  offer = null,
  label = 'A delivery has been matched to you. Accept before time runs out.',
  accepting = false,
}) => {
  const circumference = 2 * Math.PI * 36;
  const clampedCount = Math.min(offerCountdown, OFFER_DURATION_S);
  const dashOffset = circumference * (1 - clampedCount / OFFER_DURATION_S);

  // Colour shifts red as time runs out
  const timerColor =
    clampedCount > 10 ? '#FF6B35' : clampedCount > 5 ? '#f59e0b' : '#ef4444';

  // Play sound + vibrate once when the banner first appears
  const soundPlayedRef = useRef(false);
  useEffect(() => {
    if (!accepting && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playOfferSound();
      vibrateOffer();
    }
    if (accepting) {
      soundPlayedRef.current = false; // reset for next offer
    }
  }, [accepting]);

  // ── Extract delivery details from the offer object ─────────────────────
  const fare = offer?.fare ?? null;
  const distance = offer?.distance ?? null;
  const pickup = offer?.pickup ?? null;

  // ── Accepting confirmation state ────────────────────────────────────────
  if (accepting) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl p-6 shadow-2xl">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="font-black text-lg text-gray-900 dark:text-white">
              Offer Accepted!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading your delivery...
            </p>
            <Loader2 className="w-5 h-5 animate-spin text-orange-500 mt-1" />
          </div>
        </div>
      </div>
    );
  }

  // ── Main offer banner ───────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop — tap to dismiss (same as decline) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onDecline}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl overflow-hidden">
        {/* Top accent strip */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, #3A0A21, #FF6B35)` }}
        />

        <div className="p-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: '#3A0A21' }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-black text-base leading-tight text-gray-900 dark:text-white">
                  New Delivery Offer
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Respond before time runs out
                </p>
              </div>
            </div>
            <button
              onClick={onDecline}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Body — fare + meta pills + countdown, side by side */}
          <div className="flex items-center gap-4 mb-5">
            {/* Left: delivery details */}
            <div className="flex-1 min-w-0">
              {/* Fare — primary number */}
              {fare ? (
                <p
                  className="text-3xl font-black leading-none mb-2"
                  style={{ color: '#FF6B35' }}
                >
                  {fare}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {label}
                </p>
              )}

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                {distance && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                    <Navigation className="w-3 h-3" />
                    {distance}km away
                  </span>
                )}
                {pickup && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 max-w-[160px] truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{pickup}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right: countdown ring */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="5"
                  fill="none"
                  className="dark:stroke-zinc-700"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke={timerColor}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900 dark:text-white leading-none">
                  {clampedCount}
                </span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium leading-none mt-0.5">
                  secs
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 py-3 rounded-xl font-black text-white transition-colors text-sm"
              style={{ background: '#FF6B35' }}
            >
              Accept ₦{fare ? fare.replace('₦', '') : '—'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
