'use client';
import { useBrandColors } from '@/hooks/BrandColors';

const SIZES = [
  { id: 'small', label: 'Small', sub: 'Backpack' },
  { id: 'medium', label: 'Medium', sub: 'Large bag' },
  { id: 'large', label: 'Large', sub: 'Car trunk' },
];

export default function PackageSection({
  packageDetails,
  onPackageDetailChange,
}) {
  const { brandColors } = useBrandColors();
  return (
    <section>
      <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-widest mb-3">
        Package
      </p>
      <div className="flex gap-2 mb-4">
        {SIZES.map((s) => {
          const on = packageDetails.size === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onPackageDetailChange('size', s.id)}
              className="flex-1 py-3 rounded-xl text-center transition-all border"
              style={{
                background: on ? '#00C896' : 'rgba(0,0,0,0.05)',
                borderColor: on ? '#00C896' : 'rgba(0,0,0,0.1)',
              }}
            >
              <p
                className={`text-sm font-bold ${on ? 'text-black' : 'text-black dark:text-white'}`}
              >
                {s.label}
              </p>
              <p
                className={`text-[10px] mt-0.5 ${on ? 'text-black/70' : 'text-black/40 dark:text-white/40'}`}
              >
                {s.sub}
              </p>
            </button>
          );
        })}
      </div>

      <input
        type="text"
        value={packageDetails.description}
        onChange={(e) => onPackageDetailChange('description', e.target.value)}
        placeholder="What are you sending? (optional)"
        className="w-full text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 outline-none border-b border-black/10 dark:border-white/10 pb-3 bg-transparent focus:border-[#00C896] transition-colors"
      />

      <div className="flex items-center justify-between pt-3">
        <p className="text-sm text-black dark:text-white">Fragile item</p>
        <button
          onClick={() =>
            onPackageDetailChange('isFragile', !packageDetails.isFragile)
          }
          className="relative rounded-full transition-colors duration-200 flex-shrink-0"
          style={{
            width: 40,
            height: 22,
            background: packageDetails.isFragile
              ? '#00C896'
              : 'rgba(0,0,0,0.1)',
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
