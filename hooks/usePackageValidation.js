export function usePackageValidation(packageDetails, fareDetails) {
  const errors = {};
  
  if (!packageDetails.size) {
    errors.size = 'Please select a package size';
  }
  
  
  if (fareDetails.offeredFare < fareDetails.suggestedFare) {
    errors.fare = `Minimum fare is ₦${fareDetails.suggestedFare.toLocaleString()}`;
  }

  if (!fareDetails.paymentMethod) {
  errors.paymentMethod = 'Please select a payment method';
  // valid = false;
}

  
  const isValid = 
    packageDetails.size && 
    fareDetails.offeredFare >= fareDetails.suggestedFare &&
    Object.keys(errors).length === 0;
  
  return { isValid, errors };
}