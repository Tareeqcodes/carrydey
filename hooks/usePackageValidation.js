export function usePackageValidation(packageDetails, fareDetails, fareFloor) {
  const errors = {};

  if (!packageDetails.size) {
    errors.size = 'Please select a package size';
  }

  if (!fareDetails.paymentMethod) {
    errors.paymentMethod = 'Please select a payment method';
  }


  if (fareDetails.offeredFare < fareFloor) {
    errors.fare = `Offer can't be less than ₦${fareFloor.toLocaleString()}`;
  }

  const isValid =
    !!packageDetails.size &&
    !!fareDetails.paymentMethod &&
    fareDetails.offeredFare >= fareFloor &&
    Object.keys(errors).length === 0;

  return { isValid, errors };
}