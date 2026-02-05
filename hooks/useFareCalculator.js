import { useMemo } from 'react';

export function useFareCalculator(packageDetails, routeData) {
  return useMemo(() => {
    if (!routeData?.distance) return 0;

    const distanceKm = Number(routeData.distance);
    const durationMin = Number(routeData.duration || 0);

    // ---- CORE PRICING CONSTANTS ----
    const BASE_FARE = 1000;        // covers pickup effort
    const MIN_PAYOUT = 1500;       // absolute floor

    // Tiered distance rates
    const RATE_SHORT = 250; // 0–5km
    const RATE_MID = 180;   // 5–15km
    const RATE_LONG = 120;  // 15km+

    // ---- DISTANCE CALCULATION ----
    let distanceFare = 0;

    if (distanceKm <= 5) {
      distanceFare = distanceKm * RATE_SHORT;
    } else if (distanceKm <= 15) {
      distanceFare =
        5 * RATE_SHORT +
        (distanceKm - 5) * RATE_MID;
    } else {
      distanceFare =
        5 * RATE_SHORT +
        10 * RATE_MID +
        (distanceKm - 15) * RATE_LONG;
    }

    // ---- TIME COMPONENT (LIGHT WEIGHT) ----
    const timeFare = durationMin * 20;

    // ---- PACKAGE PREMIUMS ----
    const sizePremiums = {
      small: 0,
      medium: 100,
      large: 250,
    };

    const weightPremiums = {
      light: 0,
      medium: 100,
      heavy: 250,
      'very-heavy': 400,
    };

    const fragilePremium = packageDetails?.isFragile ? 200 : 0;

    const packagePremium =
      (sizePremiums[packageDetails?.size] || 0) +
      (weightPremiums[packageDetails?.weight] || 0) +
      fragilePremium;

    // ---- FINAL PRICE ----
    const rawTotal =
      BASE_FARE +
      distanceFare +
      timeFare +
      packagePremium;

    return Math.max(Math.round(rawTotal), MIN_PAYOUT);
  }, [packageDetails, routeData]);
}
