'use client';
import { AlertCircle } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

export default function FareSection({
  fareDetails,
  onFareChange,
  fareFloor,
  suggestedFare,
  errors,
}) {
  return (
    <section>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Fare
      </p>

      {/* Suggested label */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">Suggested</p>
        <p className="text-xs text-gray-400">
          {formatNairaSimple(suggestedFare)}
        </p>
      </div>

      {/* Editable fare input — pre-filled with suggested */}
      <div className="flex items-baseline gap-1 border-b border-gray-200 pb-3">
        <span className="text-2xl font-bold text-gray-300">₦</span>
        <input
          type="number"
          value={fareDetails.offeredFare || ''}
          onChange={(e) => onFareChange(parseInt(e.target.value) || 0)}
          placeholder={String(suggestedFare)}
          className="flex-1 text-2xl font-bold text-gray-900 outline-none bg-transparent placeholder-gray-300"
        />
      </div>

      {/* Floor hint */}
      <p className="text-xs text-gray-400 mt-2">
        Minimum offer: {formatNairaSimple(fareFloor)}
      </p>

      {/* Error */}
      {errors?.fare && (
        <div className="flex items-center gap-1.5 mt-2">
          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{errors.fare}</p>
        </div>
      )}
    </section>
  );
}
