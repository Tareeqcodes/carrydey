
export function formatNaira(amount) {
  if (!amount && amount !== 0) return '₦0.00';
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[₦,]/g, '')) 
    : amount;
  
  if (isNaN(numAmount)) return '₦0.00';
  
  return `₦${numAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// Alternative: Simple format without decimals if whole number
export function formatNairaSimple(amount) {
  if (!amount && amount !== 0) return '₦0';
  
  const numAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[₦,]/g, '')) 
    : amount;
  
  if (isNaN(numAmount)) return '₦0';
  
  // Check if it's a whole number
  if (numAmount % 1 === 0) {
    return `₦${numAmount.toLocaleString('en-NG')}`;
  }
  
  return `₦${numAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}