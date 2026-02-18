'use client';
import { AlertCircle } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';
import { useBrandColors } from '@/hooks/BrandColors';

export default function FareSection({ fareDetails, onFareChange, suggestedFare, errors }) {
  // const { brandColors } = useBrandColors();

  return (
    <section>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Fare</p>

      {/* Suggested row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">Suggested</p>
        <p className="text-sm font-bold text-gray-900">{formatNairaSimple(suggestedFare)}</p>
      </div>

      {/* Offer input */}
      <div className="flex items-baseline gap-1 border-b border-gray-100 pb-3">
        <span className="text-2xl font-bold text-gray-300">₦</span>
        <input
          type="number"
          value={fareDetails.offeredFare || ''}
          onChange={(e) => onFareChange(parseInt(e.target.value) || 0)}
          min={suggestedFare}
          placeholder={String(suggestedFare)}
          className="flex-1 text-2xl font-bold text-gray-900 outline-none bg-transparent placeholder-gray-300"
        />
      </div>

      {errors?.fare && (
        <div className="flex items-center gap-1.5 mt-2">
          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{errors.fare}</p>
        </div>
      )}
    </section>
  );
}