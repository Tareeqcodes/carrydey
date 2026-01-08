'use client';
import { DollarSign, TrendingUp, Plus, AlertCircle } from 'lucide-react';

export default function FareSection({
  fareDetails,
  onFareChange,
  suggestedFare,
  errors,
}) {
  const fareIncrease =
    fareDetails.suggestedFare > 0
      ? (
          ((fareDetails.offeredFare - fareDetails.suggestedFare) /
            fareDetails.suggestedFare) *
          100
        ).toFixed(0)
      : 0;

  const handleQuickAdd = (amount) => {
    const newFare = fareDetails.offeredFare + amount;
    onFareChange(newFare);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-[#3A0A21] to-[#4A0A31] p-6 text-white shadow-xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm py-3 text-white/80">Suggested Fare</span>
          </div>
          <div className="text-4xl font-bold">
            ₦{suggestedFare.toLocaleString()}
          </div>
          <p className="text-sm text-white/70 mt-1">
            Based on distance, package size & weight
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-4" />

        {/* Your Offer */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Your Offer
            <span className="ml-2 text-white/70">
              (Minimum: ₦{suggestedFare.toLocaleString()})
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
              placeholder={suggestedFare.toString()}
            />
          </div>

          {/* Error Message */}
          {errors.fare && (
            <div className="mb-4 flex items-start gap-2 text-red-200 text-sm bg-white/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errors.fare}</span>
            </div>
          )}
          
          {fareDetails.offeredFare > suggestedFare && (
            <div className="mt-4 bg-white/15 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Increased Visibility!</span>
              </div>
              <p className="text-sm text-white/90">
                Your offer is {fareIncrease}% higher than suggested. This
                significantly increases your chances of finding a traveler
                quickly!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
