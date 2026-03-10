import { useMemo } from 'react';
import { useAgencyPricing, DEFAULT_PRICING } from '@/hooks/Agencypricing';

const LONG_DISTANCE_THRESHOLD_KM = 20;

function calculateFare(packageDetails, routeData, pricing) {
  if (!routeData?.distance) {
    return { fare: 0, isLongDistance: false, fareMode: 'suggested', minFare: pricing.minFare };
  }

  const distanceKm = Number(routeData.distance);
  const isLongDistance = distanceKm > LONG_DISTANCE_THRESHOLD_KM;

  const {
    baseDeliveryFee,
    pricePerKm,
    minFare,
    fragilePremium,
    sizePremiums,
  } = pricing;

  
  if (isLongDistance) {
    return {
      fare: null,
      isLongDistance: true,
      fareMode: 'free',
      minFare,
    };
  }

  // ── Short distance: tiered taper ──────────────────────────────────────────
  // Full rate ≤5 km | 80% for 5–15 km | 65% for 15–20 km
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


  const fragile = packageDetails?.isFragile ? fragilePremium : 0;
  const packagePremium = (sizePremiums[packageDetails?.size] || 0) + fragile;

  const roundToClean = (n) =>
    n < 1000 ? Math.round(n / 50) * 50 : Math.round(n / 100) * 100;

  const fare = Math.max(
    roundToClean(baseDeliveryFee + distanceFare + packagePremium),
    minFare
  );

  return {
    fare,
    isLongDistance: false,
    fareMode: 'suggested',
    minFare,
  };
}

export function useFareCalculator(packageDetails, routeData) {
  return useMemo(
    () => calculateFare(packageDetails, routeData, DEFAULT_PRICING),
    [packageDetails, routeData]
  );
}

export function useAgencyFareCalculator(packageDetails, routeData) {
  const pricing = useAgencyPricing();
  return useMemo(
    () => calculateFare(packageDetails, routeData, pricing),
    [packageDetails, routeData, pricing]
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Itemised breakdown — short distance only
//    Returns null for long distance (no breakdown to show)
// ─────────────────────────────────────────────────────────────────────────────
export function getFareBreakdown(
  packageDetails,
  routeData,
  pricing = DEFAULT_PRICING
) {
  if (!routeData?.distance) return null;

  const distanceKm = Number(routeData.distance);
  if (distanceKm > LONG_DISTANCE_THRESHOLD_KM) return null;

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