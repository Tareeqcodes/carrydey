'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowRight, MapPin } from 'lucide-react';
import InputLocation from './InputLocation';

const CITIES = ['Kano', 'Lagos', 'Abuja', 'Port Harcourt', 'Kaduna', 'Ibadan', 'Jos', 'Enugu', 'Benin City', 'Kogi'];

export default function Main() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';

  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [routeData, setRouteData] = useState(null);

  const handleLocationSelect = useCallback((type, location) => {
    if (type === 'pickup') setPickup(location);
  }, []);

  const handleDropoffsChange = useCallback((updatedDropoffs) => {
    const first = updatedDropoffs?.[0];
    setDropoff(first?.location ?? null);
  }, []);

  const handleRouteCalculated = useCallback((data) => {
    setRouteData(data);
  }, []);

  const handleBookDelivery = useCallback(() => {
    if (pickup && dropoff) {
      sessionStorage.setItem('deliveryData', JSON.stringify({ pickup, dropoff, routeData }));
    }
    router.push('/send');
  }, [pickup, dropoff, routeData, router]);

  const bothFilled = pickup && dropoff;

  const dropoffsProp = useMemo(() => {
    if (!dropoff) return undefined;
    return [{
      id: 'd0',
      location: dropoff,
      address: dropoff.place_name || '',
      recipientName: '',
      recipientPhone: '',
      packageLabel: '',
    }];
  }, [dropoff]);

  // Inline style tokens that can't be done with Tailwind dark: classes
  const card       = dark ? '#141414' : '#F5F5F5';
  const cardBorder = dark ? '#2A2A2A' : '#E0E0E0';
  const floatBg   = dark ? '#1A1A1A' : '#FFFFFF';
  const floatBdr  = dark ? '#2E2E2E' : '#E0E0E0';
  const divider   = dark ? '#2E2E2E' : '#E0E0E0';
  const textPri   = dark ? '#F0F0F0' : '#111111';
  const textMut   = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)';
  const textMut2  = dark ? 'rgba(255,255,255,0.3)'  : 'rgba(0,0,0,0.3)';
  const tickerBg  = dark ? '#111'    : '#F0F0F0';
  const tickerBdr = dark ? '#2A2A2A' : '#E0E0E0';
  const tickerFade = dark
    ? { left: 'linear-gradient(to right, #111, transparent)', right: 'linear-gradient(to left, #111, transparent)' }
    : { left: 'linear-gradient(to right, #F0F0F0, transparent)', right: 'linear-gradient(to left, #F0F0F0, transparent)' };

  return (
    <main className="bg-white dark:bg-black overflow-hidden my-0 md:mx-5 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left column ── */}
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-[#00C896] uppercase tracking-[0.14em] mb-3">
                Nigeria's Logistics Marketplace
              </p>
              <h1
                className="text-4xl pt-2 md:text-5xl font-bold text-black dark:text-white leading-[1.1] tracking-tight"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                Send anything,
                <br />
                <span className="text-[#00C896] italic">on your budget</span>
              </h1>
              <p className="mt-3 font-semibold text-[15px] text-black/40 dark:text-white/40 leading-relaxed">
                Book verified couriers and agencies in seconds.
              </p>
            </div>

            <InputLocation
              onLocationSelect={handleLocationSelect}
              onDropoffsChange={handleDropoffsChange}
              onRouteCalculated={handleRouteCalculated}
              pickup={pickup}
              dropoffs={dropoffsProp}
              showNextButton={false}
            />

            <button
              onClick={handleBookDelivery}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98]"
              style={{ background: '#00C896', color: '#042C22', cursor: 'pointer' }}
            >
              {bothFilled ? 'Find a courier' : 'Book a delivery'}
              {!bothFilled && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

          {/* ── Mobile city ticker ── */}
          <div className="lg:hidden overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
              style={{ background: tickerFade.left }} />
            <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
              style={{ background: tickerFade.right }} />
            <div className="flex animate-ticker w-max">
              {[...CITIES, ...CITIES].map((city, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 mr-2 rounded-full whitespace-nowrap"
                  style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', border: `0.5px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}
                >
                  <MapPin className="w-3 h-3 text-[#00C896] flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-black/60 dark:text-white/60">{city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column — desktop only ── */}
          <div className="relative hidden lg:flex flex-col gap-3 items-stretch">

            {/* Main SVG card */}
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{ background: card, border: `0.5px solid ${cardBorder}` }}
            >
              {/* Nigeria dot-map + motorcycle SVG */}
              <svg width="100%" viewBox="0 0 520 370" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {/* Nigeria dot map */}
                <g fill="#00C896" opacity="0.15">
                  {[218,232,246,260,274].map(x => <circle key={x+'r1'} cx={x} cy={38} r={3.5}/>)}
                  {[204,218,232,246,260,274,288,302].map(x => <circle key={x+'r2'} cx={x} cy={52} r={3.5}/>)}
                  {[190,204,218,232,246,260,274,288,302,316].map(x => <circle key={x+'r3'} cx={x} cy={66} r={3.5}/>)}
                  {[176,190,204,218,232,246,260,274,288,302,316,330].map(x => <circle key={x+'r4'} cx={x} cy={80} r={3.5}/>)}
                  {[162,176,190,204,218,232,246,260,274,288,302,316,330,344].map(x => <circle key={x+'r5'} cx={x} cy={94} r={3.5}/>)}
                  {[148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358].map(x => <circle key={x+'r6'} cx={x} cy={108} r={3.5}/>)}
                  {[148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372].map(x => <circle key={x+'r7'} cx={x} cy={122} r={3.5}/>)}
                  {[134,148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372].map(x => <circle key={x+'r8'} cx={x} cy={136} r={3.5}/>)}
                  {[134,148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372,386].map(x => <circle key={x+'r9'} cx={x} cy={150} r={3.5}/>)}
                  {[120,134,148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372,386].map(x => <circle key={x+'r10'} cx={x} cy={164} r={3.5}/>)}
                  {[120,134,148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372,386,400].map(x => <circle key={x+'r11'} cx={x} cy={178} r={3.5}/>)}
                  {[120,134,148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372,386,400].map(x => <circle key={x+'r12'} cx={x} cy={192} r={3.5}/>)}
                  {[134,148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372,386,400].map(x => <circle key={x+'r13'} cx={x} cy={206} r={3.5}/>)}
                  {[148,162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372,386].map(x => <circle key={x+'r14'} cx={x} cy={220} r={3.5}/>)}
                  {[162,176,190,204,218,232,246,260,274,288,302,316,330,344,358,372].map(x => <circle key={x+'r15'} cx={x} cy={234} r={3.5}/>)}
                  {[176,190,204,218,232,246,260,274,288,302,316,330,344,358].map(x => <circle key={x+'r16'} cx={x} cy={248} r={3.5}/>)}
                  {[190,204,218,232,246,260,274,288,302,316,330,344].map(x => <circle key={x+'r17'} cx={x} cy={262} r={3.5}/>)}
                  {[204,218,232,246,260,274,288,302,316,330].map(x => <circle key={x+'r18'} cx={x} cy={276} r={3.5}/>)}
                  {[218,232,246,260,274,288,302,316].map(x => <circle key={x+'r19'} cx={x} cy={290} r={3.5}/>)}
                  {[218,232,246,260,274,288].map(x => <circle key={x+'r20'} cx={x} cy={304} r={3.5}/>)}
                  {[232,246,260,274].map(x => <circle key={x+'r21'} cx={x} cy={318} r={3.5}/>)}
                  {[246,260].map(x => <circle key={x+'r22'} cx={x} cy={332} r={3.5}/>)}
                </g>

                {/* Motorcycle courier — colors stay dark since card bg is always near-dark */}
                <g transform="translate(105, 155)">
                  <circle cx="52" cy="108" r="42" fill="none" stroke="#2A2A2A" strokeWidth="14"/>
                  <circle cx="52" cy="108" r="42" fill="none" stroke="#00C896" strokeWidth="5" strokeDasharray="20 10" opacity="0.6"/>
                  <circle cx="52" cy="108" r="14" fill="#1E1E1E" stroke="#333" strokeWidth="2"/>
                  <circle cx="52" cy="108" r="5" fill="#00C896"/>
                  <circle cx="248" cy="108" r="42" fill="none" stroke="#2A2A2A" strokeWidth="14"/>
                  <circle cx="248" cy="108" r="42" fill="none" stroke="#00C896" strokeWidth="5" strokeDasharray="20 10" opacity="0.6"/>
                  <circle cx="248" cy="108" r="14" fill="#1E1E1E" stroke="#333" strokeWidth="2"/>
                  <circle cx="248" cy="108" r="5" fill="#00C896"/>
                  <line x1="52" y1="108" x2="130" y2="72" stroke="#333" strokeWidth="8" strokeLinecap="round"/>
                  <polyline points="52,108 90,58 150,42 200,50 230,68 248,108" fill="none" stroke="#2E2E2E" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="110" y="58" width="72" height="44" rx="8" fill="#1E1E1E" stroke="#333" strokeWidth="2"/>
                  <rect x="118" y="65" width="56" height="30" rx="5" fill="#252525"/>
                  <path d="M130 42 Q160 28 190 38 L200 50 L150 42 Z" fill="#1A1A1A" stroke="#00C896" strokeWidth="1.5"/>
                  <path d="M90 90 Q70 100 60 108" fill="none" stroke="#2A2A2A" strokeWidth="6" strokeLinecap="round"/>
                  <line x1="210" y1="36" x2="230" y2="52" stroke="#333" strokeWidth="6" strokeLinecap="round"/>
                  <line x1="204" y1="32" x2="220" y2="32" stroke="#444" strokeWidth="5" strokeLinecap="round"/>
                  <rect x="238" y="52" width="20" height="14" rx="4" fill="#1E1E1E" stroke="#00C896" strokeWidth="1.5"/>
                  <rect x="242" y="55" width="12" height="8" rx="2" fill="#00C896" opacity="0.5"/>
                  <rect x="22" y="28" width="68" height="52" rx="6" fill="#1A1A1A" stroke="#00C896" strokeWidth="1.5"/>
                  <line x1="22" y1="54" x2="90" y2="54" stroke="#00C896" strokeWidth="0.8" opacity="0.5"/>
                  <line x1="56" y1="28" x2="56" y2="80" stroke="#00C896" strokeWidth="0.8" opacity="0.5"/>
                  <rect x="38" y="36" width="36" height="10" rx="3" fill="#00C896" opacity="0.2"/>
                  <rect x="38" y="60" width="36" height="10" rx="3" fill="#00C896" opacity="0.1"/>
                  <path d="M148 100 Q155 80 170 72 L178 80 Q168 86 162 104 Z" fill="#1E1E1E" stroke="#2A2A2A" strokeWidth="1"/>
                  <path d="M152 72 Q165 38 185 30 L196 40 Q178 48 168 78 Z" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1.5"/>
                  <path d="M158 62 Q168 42 182 34 L186 38 Q174 46 164 66 Z" fill="#00C896" opacity="0.25"/>
                  <path d="M178 46 Q195 38 210 36" fill="none" stroke="#1E1E1E" strokeWidth="10" strokeLinecap="round"/>
                  <path d="M178 46 Q195 38 210 36" fill="none" stroke="#2A2A2A" strokeWidth="7" strokeLinecap="round"/>
                  <ellipse cx="178" cy="24" rx="22" ry="20" fill="#1A1A1A" stroke="#2E2E2E" strokeWidth="2"/>
                  <path d="M158 22 Q162 8 178 6 Q194 8 198 22" fill="#00C896" opacity="0.18"/>
                  <path d="M160 26 Q178 18 196 26 L194 32 Q178 24 162 32 Z" fill="#00C896" opacity="0.35"/>
                  <line x1="-20" y1="90" x2="10" y2="90" stroke="#00C896" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
                  <line x1="-30" y1="100" x2="-4" y2="100" stroke="#00C896" strokeWidth="1" opacity="0.2" strokeLinecap="round"/>
                  <line x1="-14" y1="110" x2="8" y2="110" stroke="#00C896" strokeWidth="1" opacity="0.15" strokeLinecap="round"/>
                </g>

                <ellipse cx="260" cy="362" rx="140" ry="6" fill="#00C896" opacity="0.06"/>
              </svg>

              {/* Floating — courier info */}
              <div style={{
                position: 'absolute', top: 20, left: 20,
                background: floatBg, border: `0.5px solid ${floatBdr}`,
                borderRadius: 12, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C896', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: textPri }}>Ahmad Yusuf</div>
                  <div style={{ fontSize: 11, color: textMut, marginTop: 1 }}>En route · 8 min away</div>
                </div>
              </div>

              {/* Floating — live badge */}
              <div style={{
                position: 'absolute', top: 20, right: 20,
                background: 'rgba(0,200,150,0.1)', border: '0.5px solid rgba(0,200,150,0.3)',
                borderRadius: 20, padding: '5px 12px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C896' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#00C896' }}>Live tracking</span>
              </div>

              {/* Floating — stats bar */}
              <div style={{
                position: 'absolute', bottom: 20, left: '50%',
                transform: 'translateX(-50%)',
                background: floatBg, border: `0.5px solid ${floatBdr}`,
                borderRadius: 14, padding: '12px 20px',
                display: 'flex', alignItems: 'center', gap: 20, whiteSpace: 'nowrap',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#00C896' }}>30 min</div>
                  <div style={{ fontSize: 10, color: textMut2, marginTop: 2 }}>avg. delivery</div>
                </div>
                <div style={{ width: '0.5px', height: 28, background: divider }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: textPri }}>8.5 km</div>
                  <div style={{ fontSize: 10, color: textMut2, marginTop: 2 }}>distance</div>
                </div>
                <div style={{ width: '0.5px', height: 28, background: divider }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: textPri }}>4.9</div>
                  <div style={{ fontSize: 10, color: textMut2, marginTop: 2 }}>courier rating</div>
                </div>
              </div>
            </div>

            {/* City ticker — desktop */}
            <div
              className="relative overflow-hidden rounded-xl py-3 px-0"
              style={{ background: tickerBg, border: `0.5px solid ${tickerBdr}` }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
                style={{ background: tickerFade.left }} />
              <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
                style={{ background: tickerFade.right }} />

              <div className="flex animate-ticker w-max">
                {[...CITIES, ...CITIES].map((city, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1 mr-2 rounded-full whitespace-nowrap"
                    style={{
                      background: dark ? 'rgba(0,200,150,0.06)' : 'rgba(0,200,150,0.1)',
                      border: `0.5px solid ${dark ? 'rgba(0,200,150,0.15)' : 'rgba(0,200,150,0.3)'}`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00C896' }} />
                    <span className="text-[11px] font-semibold text-black/55 dark:text-white/55">{city}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}