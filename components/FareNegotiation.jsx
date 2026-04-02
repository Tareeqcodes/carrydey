'use client';

import { useState } from 'react';

const COURIERS = [
  {
    seed: 'Ahmad',
    name: 'Ahmad Yusuf',
    sub: '🟢 8 min away · ⭐ 4.9',
    accepted: true,
    label: 'Accepted ✓',
  },
  {
    seed: 'Musa',
    name: 'Musa Ibrahim',
    sub: '🟡 12 min · Counter: ₦1,800',
    accepted: false,
    label: 'Counter →',
  },
  {
    seed: 'Laila',
    name: 'Laila Sani Express',
    sub: '🏢 Agency · Fleet of 12',
    accepted: false,
    label: 'Pending…',
  },
];

const HINTS = [
  { max: 800,        text: '↓ Very low — couriers unlikely to accept',     color: '#ef4444' },
  { max: 1200,       text: '→ Below average — may take a while',           color: '#f59e0b' },
  { max: 2200,       text: '✓ Competitive — good chance of quick pickup',  color: '#10b981' },
  { max: Infinity,   text: '⚡ Premium — couriers will prioritise you',    color: '#FF6B35' },
];

function hint(val) {
  return HINTS.find((h) => val <= h.max) ?? HINTS[HINTS.length - 1];
}

export default function FareNegotiation() {
  const [slider, setSlider] = useState(60);
  const fare = Math.round(500 + (slider / 100) * 2500);
  const h = hint(fare);

  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: copy ── */}
        <div>
          <p className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-[0.14em] mb-3">
            Fare negotiation
          </p>
          <h2
            className="text-[28px] md:text-[38px] font-black text-[#3A0A21] leading-[1.08] tracking-[-0.02em] mb-5"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            The marketplace where{' '}
            <span className="text-[#FF6B35] italic">you</span>
            {' '}name the price.
          </h2>
          <p className="text-[14px] font-medium text-gray-500 leading-[1.75] mb-8 max-w-md">
            Every other platform decides what you pay. Carrydey flips the model
            post your offer, watch couriers compete for your booking.
          </p>

          {/* Steps */}
          <div className="space-y-5">
            {[
              { title: 'You set the opening offer',      desc: 'We suggest a fair price based on distance  accept it, go higher, or lower.' },
              { title: 'Couriers respond in real-time',   desc: 'Accept your price, send a counter-offer, or pass. You stay in control.'      },
              { title: 'Confirm and tracking starts',     desc: 'Accept a courier and the delivery is live. No surprises, no hidden fees.'     },
            ].map(({ title, desc }, i) => (
              <div key={title} className="flex items-start gap-4">
                {/* Step dot */}
                <div className="w-6 h-6 rounded-full bg-[#3A0A21]/08 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#3A0A21]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#3A0A21] mb-0.5">{title}</p>
                  <p className="text-[13px] text-gray-500 leading-[1.6]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: live mockup ── */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'linear-gradient(150deg, #0e0608 0%, #1c0812 55%, #2e0d1e 100%)' }}
        >
          {/* Route label */}
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] mb-5">
            Live fare — Kano Central → Sabon Gari
          </p>

          {/* Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[12px] font-semibold text-white/40">Your offer</span>
              <span
                className="font-black text-white text-[22px] leading-none"
                style={{ fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.02em' }}
              >
                ₦{fare.toLocaleString()}
              </span>
            </div>

            {/* Custom track */}
            <div className="relative h-1.5 bg-white/10 rounded-full mb-1">
              <div
                className="absolute h-full rounded-full transition-all"
                style={{
                  width: `${slider}%`,
                  background: 'linear-gradient(90deg, #FF6B35, #d94e1a)',
                }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#FF6B35] shadow-[0_0_0_3px_rgba(255,107,53,0.25)] pointer-events-none"
                style={{ left: `calc(${slider}% - 8px)` }}
              />
              {/* Invisible range input on top */}
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
              <span className="text-[10px] text-white/25 font-medium">₦500</span>
              <span className="text-[10px] font-semibold transition-all" style={{ color: h.color }}>
                {h.text}
              </span>
              <span className="text-[10px] text-white/25 font-medium">₦3,000</span>
            </div>
          </div>

          {/* Courier rows */}
          <div className="space-y-2">
            {COURIERS.map(({ seed, name, sub, accepted, label }) => (
              <div
                key={seed}
                className="flex items-center justify-between rounded-xl px-3.5 py-3"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                    alt={name}
                    className="w-8 h-8 rounded-lg object-cover bg-white/10"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-white leading-tight">{name}</p>
                    <p className="text-[11px] text-white/35 mt-0.5">{sub}</p>
                  </div>
                </div>
                <button
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                    accepted
                      ? 'bg-[#FF6B35]/20 text-[#FF6B35]'
                      : 'bg-white/06 text-white/30'
                  }`}
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