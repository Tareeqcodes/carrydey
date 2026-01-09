/**
 * Format duration in minutes to a human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string (e.g., "30 min", "1 hr 30 min", "2 hrs")
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) {
    return '0 min';
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
};

/**
 * Format duration with long form (optional alternative)
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string (e.g., "30 minutes", "1 hour 30 minutes")
 */
export const formatDurationLong = (minutes) => {
  if (!minutes || minutes < 0) {
    return '0 minutes';
  }

  if (minutes < 60) {
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  const hourText = hours === 1 ? '1 hour' : `${hours} hours`;
  
  if (remainingMinutes === 0) {
    return hourText;
  }
  
  const minText = remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
  return `${hourText} ${minText}`;
};