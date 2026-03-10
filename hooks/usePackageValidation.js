'use client';
import { useMemo } from 'react';


export function usePackageValidation(
  packageDetails,
  fareDetails,
  fareFloor,      // 50% of suggestedFare — only used in 'suggested' mode
  showPricing,
  fareMode = 'suggested',  // NEW — 'suggested' | 'free'
  minFare = 0              // NEW — agency minimum, used in 'free' mode
) {
  return useMemo(() => {
    const errors = {};

    if (!packageDetails?.size) {
      errors.size = 'Please select a package size';
    }

    if (showPricing) {
      const offered = fareDetails?.offeredFare || 0;

      if (!offered || offered <= 0) {
        errors.fare = 'Please enter your fare offer';
      } else if (fareMode === 'free') {
        // Long distance — only enforce the agency's min fare floor
        if (minFare > 0 && offered < minFare) {
          errors.fare = `Minimum accepted offer is ₦${minFare.toLocaleString()}`;
        }
      } else {
        // Short distance — enforce 50% of suggested fare
        if (fareFloor > 0 && offered < fareFloor) {
          errors.fare = `Offer must be at least ₦${fareFloor.toLocaleString()}`;
        }
      }
    }

    if (!fareDetails?.paymentMethod) {
      errors.paymentMethod = 'Please select a payment method';
    }

    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
  }, [packageDetails, fareDetails, fareFloor, showPricing, fareMode, minFare]);
}