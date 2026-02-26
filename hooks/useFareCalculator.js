import { useMemo } from 'react';
import { useAgencyPricing, DEFAULT_PRICING } from '@/hooks/Agencypricing';

function calculateFare(packageDetails, routeData, pricing) {
  if (!routeData?.distance) return 0;

  const distanceKm = Number(routeData.distance);
  const durationMin = Number(routeData.duration || 0);

  const {
    baseDeliveryFee,
    pricePerKm,
    minFare,
    fragilePremium,
    sizePremiums,
  } = pricing;

  // Distance — tiered taper: full rate ≤5 km, 80% 5–15 km, 65% >15 km
  let distanceFare = 0;
  if (distanceKm <= 5) {
    distanceFare = distanceKm * pricePerKm;
  } else if (distanceKm <= 15) {
    distanceFare = 5 * pricePerKm + (distanceKm - 5) * (pricePerKm * 0.8);
  } else {
    distanceFare =
      5 * pricePerKm +
      10 * (pricePerKm * 0.8) +
      (distanceKm - 15) * (pricePerKm * 0.65);
  }

  // Time — platform cost, not agency-configurable
  const timeFare = durationMin * 20;

  // Package premiums (weight removed)
  const fragile = packageDetails?.isFragile ? fragilePremium : 0;
  const packagePremium = (sizePremiums[packageDetails?.size] || 0) + fragile;

  const roundToClean = (n) =>
    n < 1000 ? Math.round(n / 50) * 50 : Math.round(n / 100) * 100;

  return Math.max(
    roundToClean(baseDeliveryFee + distanceFare + timeFare + packagePremium),
    minFare
  );
}

export function useFareCalculator(packageDetails, routeData) {
  return useMemo(
    () => calculateFare(packageDetails, routeData, DEFAULT_PRICING),
    [packageDetails, routeData]
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. AGENCY HOOK — PackageAndFareScreen inside AgencyBookingPage
// ─────────────────────────────────────────────────────────────────────────────
export function useAgencyFareCalculator(packageDetails, routeData) {
  const pricing = useAgencyPricing();
  return useMemo(
    () => calculateFare(packageDetails, routeData, pricing),
    [packageDetails, routeData, pricing]
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Itemised breakdown
// ─────────────────────────────────────────────────────────────────────────────
export function getFareBreakdown(
  packageDetails,
  routeData,
  pricing = DEFAULT_PRICING
) {
  if (!routeData?.distance) return null;

  const distanceKm = Number(routeData.distance);
  const durationMin = Number(routeData.duration || 0);
  const {
    baseDeliveryFee,
    pricePerKm,
    minFare,
    fragilePremium,
    sizePremiums,
  } = pricing;

  let distanceFare = 0;
  if (distanceKm <= 5) {
    distanceFare = distanceKm * pricePerKm;
  } else if (distanceKm <= 15) {
    distanceFare = 5 * pricePerKm + (distanceKm - 5) * (pricePerKm * 0.8);
  } else {
    distanceFare =
      5 * pricePerKm +
      10 * (pricePerKm * 0.8) +
      (distanceKm - 15) * (pricePerKm * 0.65);
  }

  const timeFare = durationMin * 20;
  const fragile = packageDetails?.isFragile ? fragilePremium : 0;
  const sizeFee = sizePremiums[packageDetails?.size] || 0;

  const roundToClean = (n) =>
    n < 1000 ? Math.round(n / 50) * 50 : Math.round(n / 100) * 100;

  const rawTotal = baseDeliveryFee + distanceFare + timeFare + sizeFee + fragile;
  const total = Math.max(roundToClean(rawTotal), minFare);

  return {
    total,
    lines: [
      { label: 'Base fare', amount: baseDeliveryFee },
      {
        label: `Distance (${distanceKm.toFixed(1)} km)`,
        amount: Math.round(distanceFare),
      },
      { label: `Time (${durationMin} min)`, amount: Math.round(timeFare) },
      ...(sizeFee > 0
        ? [{ label: `Size — ${packageDetails?.size}`, amount: sizeFee }]
        : []),
      ...(fragile > 0 ? [{ label: 'Fragile handling', amount: fragile }] : []),
    ],
  };
}