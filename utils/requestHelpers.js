export const getInitials = (name) => {
  if (!name || name === 'Unknown Traveler') return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

