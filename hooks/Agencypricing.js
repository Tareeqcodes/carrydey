'use client';
import { createContext, useContext, useMemo } from 'react';

export const DEFAULT_PRICING = {
  baseDeliveryFee: 1000,
  pricePerKm: 150,
  minFare: 1500,
  fragilePremium: 200,
  sizePremiums: { small: 0, medium: 100, large: 250 },
};

const AgencyPricingContext = createContext(DEFAULT_PRICING);

export function parseAgencyPricing(agencyData) {
  if (!agencyData) return DEFAULT_PRICING;

  const safeJson = (raw, fallback) => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  return {
    baseDeliveryFee:
      Number(agencyData.baseDeliveryFee) || DEFAULT_PRICING.baseDeliveryFee,
    pricePerKm: Number(agencyData.pricePerKm) || DEFAULT_PRICING.pricePerKm,
    minFare: Number(agencyData.minFare) || DEFAULT_PRICING.minFare,
    fragilePremium:
      Number(agencyData.fragilePremium) || DEFAULT_PRICING.fragilePremium,
    sizePremiums: safeJson(
      agencyData.sizePremiums,
      DEFAULT_PRICING.sizePremiums
    ),
  };
}

export function AgencyPricingProvider({ pricing, children }) {
  const value = useMemo(() => pricing ?? DEFAULT_PRICING, [pricing]);
  return (
    <AgencyPricingContext.Provider value={value}>
      {children}
    </AgencyPricingContext.Provider>
  );
}

export function useAgencyPricing() {
  return useContext(AgencyPricingContext);
}