'use client';
import { useCallback } from 'react';
import { AlertCircle, Minus, Plus, Truck } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

function OfferQuality({ offered, suggested, minFare, isLongDistance }) {
  if (!offered || offered <= 0) return null;
  let label, color, bg, icon;

  if (isLongDistance) {
    const ratio = offered / minFare;
    if (ratio < 1) {
      label = 'Below minimum';
      color = 'text-red-500';
      bg = 'bg-red-50';
      icon = '✕';
    } else if (ratio < 1.3) {
      label = 'Low offer';
      color = 'text-orange-500';
      bg = 'bg-orange-50';
      icon = '↗';
    } else if (ratio < 2) {
      label = 'Good offer';
      color = 'text-emerald-600';
      bg = 'bg-emerald-50';
      icon = '✓';
    } else {
      label = 'Great offer';
      color = 'text-emerald-600';
      bg = 'bg-emerald-50';
      icon = '⚡';
    }
  } else {
    const ratio = offered / suggested;
    if (ratio < 0.5) {
      label = 'Too low';
      color = 'text-red-500';
      bg = 'bg-red-50';
      icon = '✕';
    } else if (ratio < 0.8) {
      label = 'Low offer';
      color = 'text-orange-500';
      bg = 'bg-orange-50';
      icon = '↗';
    } else if (ratio <= 1.1) {
      label = 'Fair offer';
      color = 'text-emerald-600';
      bg = 'bg-emerald-50';
      icon = '✓';
    } else {
      label = 'Great offer';
      color = 'text-emerald-600';
      bg = 'bg-emerald-50';
      icon = '⚡';
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color} ${bg}`}
    >
      <span>{icon}</span>
      {label}
    </span>
  );
}

function FareInput({
  value,
  onChange,
  step = 500,
  minFare = 0,
  placeholder = '',
}) {
  const decrement = useCallback(() => {
    onChange(Math.max((value || 0) - step, minFare));
  }, [value, step, minFare, onChange]);
  const increment = useCallback(() => {
    onChange((value || 0) + step);
  }, [value, step, onChange]);

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <button
        type="button"
        onClick={decrement}
        className="w-10 h-10 rounded-full border-2 border-black/10 dark:border-white/10 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 active:scale-95 transition-all flex-shrink-0"
      >
        <Minus className="w-5 h-5" />
      </button>

      <div className="flex-1 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-2xl font-bold text-black/30 dark:text-white/30">
            ₦
          </span>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder={placeholder}
            className="w-36 text-4xl font-bold text-black dark:text-white outline-none bg-transparent text-center placeholder-black/20 dark:placeholder-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={increment}
        className="w-10 h-10 rounded-full border-2 border-black/10 dark:border-white/10 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 active:scale-95 transition-all flex-shrink-0"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

function ShortDistanceFare({
  fareDetails,
  onFareChange,
  fareFloor,
  suggestedFare,
  errors,
}) {
  return (
    <section className="space-y-1">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-widest">
          Your offer
        </p>
        <OfferQuality
          offered={fareDetails.offeredFare}
          suggested={suggestedFare}
          isLongDistance={false}
        />
      </div>
      <FareInput
        value={fareDetails.offeredFare}
        onChange={onFareChange}
        step={500}
        minFare={fareFloor}
        placeholder={String(suggestedFare)}
      />
      <div className="flex items-center pt-1 border-t border-black/10 dark:border-white/10">
        <span className="text-xs text-black/40 dark:text-white/40">
          Min{' '}
          <span className="font-medium text-black/60 dark:text-white/60">
            {formatNairaSimple(fareFloor)}
          </span>
        </span>
      </div>
      {errors?.fare && (
        <div className="flex items-center gap-1.5 pt-1">
          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{errors.fare}</p>
        </div>
      )}
    </section>
  );
}

function LongDistanceFare({ fareDetails, onFareChange, minFare, errors }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-widest">
          Your offer
        </p>
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
          <span className="text-xs font-medium text-black/50 dark:text-white/50">
            Long distance
          </span>
        </div>
      </div>
      <FareInput
        value={fareDetails.offeredFare}
        onChange={onFareChange}
        step={500}
        minFare={minFare}
        placeholder={minFare ? String(minFare) : '0'}
      />
      <div className="flex items-center justify-between pt-1 border-t border-black/10 dark:border-white/10">
        <OfferQuality
          offered={fareDetails.offeredFare}
          minFare={minFare}
          isLongDistance
        />
        {minFare > 0 && (
          <span className="text-xs text-black/40 dark:text-white/40">
            Min{' '}
            <span className="font-medium text-black/60 dark:text-white/60">
              {formatNairaSimple(minFare)}
            </span>
          </span>
        )}
      </div>
      {errors?.fare && (
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{errors.fare}</p>
        </div>
      )}
    </section>
  );
}

export default function FareSection({
  fareDetails,
  onFareChange,
  fareFloor,
  suggestedFare,
  minFare,
  isLongDistance,
  errors,
}) {
  if (isLongDistance) {
    return (
      <LongDistanceFare
        fareDetails={fareDetails}
        onFareChange={onFareChange}
        minFare={minFare}
        errors={errors}
      />
    );
  }
  return (
    <ShortDistanceFare
      fareDetails={fareDetails}
      onFareChange={onFareChange}
      fareFloor={fareFloor}
      suggestedFare={suggestedFare}
      errors={errors}
    />
  );
}
