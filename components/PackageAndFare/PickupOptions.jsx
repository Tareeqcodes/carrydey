'use client';
import { useBrandColors } from '@/hooks/BrandColors';

export default function PickupOptions({ packageDetails, onPackageDetailChange }) {
  const { brandColors } = useBrandColors();

  return (
    <section>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
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
              className="flex-1 py-3 rounded-xl text-center transition-all"
              style={{ background: on ? brandColors.primary : '#f3f4f6' }}
            >
              <p className={`text-sm font-bold ${on ? 'text-white' : 'text-gray-700'}`}>
                {label}
              </p>
              <p className={`text-[10px] mt-0.5 ${on ? 'text-white/70' : 'text-gray-400'}`}>
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
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none bg-gray-50 focus:border-violet-400 transition-colors"
          />
          <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none bg-gray-50 focus:border-violet-400 transition-colors">
            {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
    </section>
  );
}