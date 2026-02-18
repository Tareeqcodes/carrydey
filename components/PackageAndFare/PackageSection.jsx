'use client';
import { useBrandColors } from '@/hooks/BrandColors';

const SIZES = [
  { id: 'small',  label: 'Small',  sub: 'Backpack' },
  { id: 'medium', label: 'Medium', sub: 'Large bag' },
  { id: 'large',  label: 'Large',  sub: 'Car trunk' },
];

export default function PackageSection({ packageDetails, onPackageDetailChange }) {
  const { brandColors } = useBrandColors();

  return (
    <section>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Package</p>

      {/* Size chips */}
      <div className="flex gap-2 mb-4">
        {SIZES.map((s) => {
          const on = packageDetails.size === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onPackageDetailChange('size', s.id)}
              className="flex-1 py-3 rounded-xl text-center transition-all"
              style={{ background: on ? brandColors.primary : '#f3f4f6' }}
            >
              <p className={`text-sm font-bold ${on ? 'text-white' : 'text-gray-700'}`}>
                {s.label}
              </p>
              <p className={`text-[10px] mt-0.5 ${on ? 'text-white/70' : 'text-gray-400'}`}>
                {s.sub}
              </p>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <input
        type="text"
        value={packageDetails.description}
        onChange={(e) => onPackageDetailChange('description', e.target.value)}
        placeholder="What are you sending? (optional)"
        className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none border-b border-gray-100 pb-3 bg-transparent"
      />

      {/* Fragile */}
      <div className="flex items-center justify-between pt-3">
        <p className="text-sm text-gray-700">Fragile item</p>
        <button
          onClick={() => onPackageDetailChange('isFragile', !packageDetails.isFragile)}
          className="relative rounded-full transition-colors duration-200 flex-shrink-0"
          style={{
            width: 40,
            height: 22,
            background: packageDetails.isFragile ? brandColors.primary : '#e5e7eb',
          }}
        >
          <span
            className="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200"
            style={{ left: packageDetails.isFragile ? 20 : 3 }}
          />
        </button>
      </div>
    </section>
  );
}