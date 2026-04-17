'use client';

import { useState } from 'react';

const COURIERS = [
  {
    seed: 'Ahmad',
    name: 'Ahmad Yusuf',
    sub: '8 min away · 4.9 stars',
    accepted: true,
    label: 'Accepted ✓',
  },
  {
    seed: 'Musa',
    name: 'Musa Ibrahim',
    sub: '12 min · Counter: ₦1,800',
    accepted: false,
    label: 'Counter →',
  },
  {
    seed: 'Laila',
    name: 'Laila Sani Express',
    sub: 'Agency · Fleet of 12',
    accepted: false,
    label: 'Pending…',
  },
];

const HINTS = [
  {
    max: 800,
    text: 'Very low — couriers unlikely to accept',
    color: '#ef4444',
  },
  { max: 1200, text: 'Below average — may take a while', color: '#f59e0b' },
  {
    max: 2200,
    text: 'Competitive — good chance of quick pickup',
    color: '#00C896',
  },
  {
    max: Infinity,
    text: 'Premium — couriers will prioritise you',
    color: '#00E5AD',
  },
];

function hint(val) {
  return HINTS.find((h) => val <= h.max) ?? HINTS[HINTS.length - 1];
}

export default function FareNegotiation() {
  const [slider, setSlider] = useState(60);
  const fare = Math.round(500 + (slider / 100) * 2500);
  const h = hint(fare);

  return (
    <section className="py-20 px-4 md:px-6 bg-gray-100 dark:bg-[#111111]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* ── Left: copy ── */}
        <div>
          <h2
            className="text-[28px] md:text-[38px] font-black text-black dark:text-white leading-[1.08] tracking-[-0.02em] mb-5"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            The marketplace where{' '}
            <span className="text-[#00C896] italic">you</span> name the price.
          </h2>
          <p className="text-[14px] font-medium text-black/50 dark:text-white/50 leading-[1.75] mb-8 max-w-md">
            Every other platform decides what you pay. Carrydey flips the model
            — post your offer, watch couriers compete for your booking.
          </p>

          {/* Steps */}
          <div className="space-y-5">
            {[
              {
                title: 'You set the opening offer',
                desc: 'We suggest a fair price based on distance — accept it, go higher, or lower.',
              },
              {
                title: 'Couriers respond in real-time',
                desc: 'Accept your price, send a counter-offer, or pass. You stay in control.',
              },
              {
                title: 'Confirm and tracking starts',
                desc: 'Accept a courier and the delivery is live. No surprises, no hidden fees.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: 'rgba(0,200,150,0.12)',
                    border: '0.5px solid rgba(0,200,150,0.25)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#00C896]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-black dark:text-white mb-0.5">
                    {title}
                  </p>
                  <p className="text-[13px] text-black/45 dark:text-white/45 leading-[1.6]">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: live mockup ── */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2E2E2E]">
          <p className="text-[10px] font-bold text-black/25 dark:text-white/25 uppercase tracking-[0.12em] mb-5">
            Live fare — Kano Central → Sabon Gari
          </p>

          {/* Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[12px] font-semibold text-black/40 dark:text-white/40">
                Your offer
              </span>
              <span
                className="font-black text-black dark:text-white text-[22px] leading-none"
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  letterSpacing: '-0.02em',
                }}
              >
                ₦{fare.toLocaleString()}
              </span>
            </div>

            {/* Custom track */}
            <div className="relative h-1.5 rounded-full mb-1 bg-black/8 dark:bg-white/8">
              <div
                className="absolute h-full rounded-full transition-all"
                style={{ width: `${slider}%`, background: '#00C896' }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-100 dark:bg-[#111111] border-2 border-[#00C896] pointer-events-none"
                style={{ left: `calc(${slider}% - 8px)` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: '100%' }}
              />
            </div>

            <div className="flex justify-between">
              <span className="text-[10px] text-black/20 dark:text-white/20 font-medium">
                ₦500
              </span>
              <span
                className="text-[10px] font-semibold transition-all"
                style={{ color: h.color }}
              >
                {h.text}
              </span>
              <span className="text-[10px] text-black/20 dark:text-white/20 font-medium">
                ₦3,000
              </span>
            </div>
          </div>

          {/* Courier rows */}
          <div className="space-y-2">
            {COURIERS.map(({ seed, name, sub, accepted, label }) => (
              <div
                key={seed}
                className="flex items-center justify-between rounded-xl px-3.5 py-3 bg-black/4 dark:bg-white/4 border border-black/6 dark:border-white/6"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                    alt={name}
                    className="w-8 h-8 rounded-lg object-cover bg-black/6 dark:bg-white/6"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-black dark:text-white leading-tight">
                      {name}
                    </p>
                    <p className="text-[11px] text-black/30 dark:text-white/30 mt-0.5">
                      {sub}
                    </p>
                  </div>
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold"
                  style={
                    accepted
                      ? { background: 'rgba(0,200,150,0.15)', color: '#00C896' }
                      : {
                          background: 'rgba(0,0,0,0.05)',
                          color: 'rgba(0,0,0,0.25)',
                        }
                  }
                >
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
