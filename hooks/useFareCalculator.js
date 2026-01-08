import { useMemo } from 'react';

export function useFareCalculator(packageDetails, routeData) {
  return useMemo(() => {
    const baseFare = 5;
    const perKm = 50;
    const distance = routeData?.distance || 0;
    
    let baseFareCalculated = baseFare + (distance * perKm);
    
    const sizePremiums = {
      small: 0,
      medium: 0,
      large: 100,
    };
    
    const weightPremiums = {
      light: 0,
      medium: 0,
      heavy: 100,
      'very-heavy': 150,
    };
    
    const totalPremium = 
      (sizePremiums[packageDetails.size] || 0) +
      (weightPremiums[packageDetails.weight] || 0) +
      (packageDetails.isFragile ? 100 : 0);
    
    return Math.round(baseFareCalculated + totalPremium);
  }, [packageDetails, routeData]);
}