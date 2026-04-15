'use client';
import { useBrandColors } from '@/hooks/BrandColors';

export default function PickupOptions({ packageDetails, onPackageDetailChange }) {
  const { brandColors } = useBrandColors();

  return (
    <section>
      <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
        Pickup time
      </p>

      {/* Chips */}
      <div className="flex gap-2">
        {[
          { id: 'courier',  label: 'ASAP',  sub: 'Right away' },
          { id: 'schedule', label: 'Later', sub: 'Choose time' },
        ].map(({ id, label, sub }) => {
          const on = packageDetails.pickupTime === id;
          return (
            <button
              key={id}
              onClick={() => onPackageDetailChange('pickupTime', id)}
              className="flex-1 py-3 rounded-xl text-center transition-all border"
              style={{ 
                background: on ? '#00C896' : 'rgba(255,255,255,0.05)',
                borderColor: on ? '#00C896' : 'rgba(255,255,255,0.1)'
              }}
            >
              <p className={`text-sm font-bold ${on ? 'text-black' : 'text-white'}`}>
                {label}
              </p>
              <p className={`text-[10px] mt-0.5 ${on ? 'text-black/70' : 'text-white/40'}`}>
                {sub}
              </p>
            </button>
          );
        })}
      </div>

      {/* Date/time picker when scheduled */}
      {packageDetails.pickupTime === 'schedule' && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className="text-sm border border-white/10 bg-white/5 rounded-xl px-3 py-2.5 outline-none focus:border-[#00C896] focus:bg-white/10 transition-colors text-white placeholder-white/30"
          />
          <select className="text-sm border border-white/10 bg-white/5 rounded-xl px-3 py-2.5 outline-none focus:border-[#00C896] focus:bg-white/10 transition-colors text-white">
            {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map((t) => (
              <option key={t} className="bg-black text-white">{t}</option>
            ))}
          </select>
        </div>
      )}
    </section>
  );
}