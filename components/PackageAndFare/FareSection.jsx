'use client';
import { AlertCircle } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';
import { useBrandColors } from '@/hooks/BrandColors';

export default function FareSection({
  fareDetails,
  onFareChange,
  suggestedFare,
  errors,
}) {
  const { brandColors } = useBrandColors();

  return (
    <section className="space-y-4">
      <div 
        className="rounded-2xl p-6 text-white shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
        }}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm py-3 text-white/80">Suggested Fare</span>
          </div>
          <div className="text-4xl font-bold">
            {formatNairaSimple(suggestedFare)}
          </div>
          <p className="text-sm text-white/70 mt-1">
            Based on distance, package size & weight
          </p>
        </div>

        <div className="border-t border-white/20 my-4" />

        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Your Offer
            <span className="ml-2 text-white/70">
              (Minimum: {formatNairaSimple(suggestedFare)})
            </span>
          </label>
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold">
              ₦
            </span>
            <input
              type="number"
              value={fareDetails.offeredFare}
              onChange={(e) => onFareChange(parseInt(e.target.value) || 0)}
              min={suggestedFare}
              className="w-full pl-12 pr-4 py-4 text-3xl font-bold bg-white/10 border-2 border-white/30 rounded-xl outline-none text-white placeholder-white/70 focus:border-white/50 focus:bg-white/15 transition-all"
              placeholder={`Enter fare (min ₦${formatNairaSimple(suggestedFare)})`}
            />
          </div>

          {/* Error Message */}
          {errors.fare && (
            <div className="mb-4 flex items-start gap-2 text-red-200 text-sm bg-white/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errors.fare}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}