
import { Shield } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const badges = {
    'Awaiting pickup': {
      bg: 'bg-yellow-700',
      text: 'text-yellow-100',
      label: 'Awaiting pickup',
      hasDot: false,
    },
    'declined': {
      bg: 'bg-gray-50',
      text: 'text-gray-500',
      label: 'Declined',
      hasDot: true,
      dotColor: 'bg-gray-400',
    },
    'default': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      label: 'Pending',
      hasDot: true,
      dotColor: 'bg-orange-400',
    },
  };

  const badge = badges[status] || badges.default;
  
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 ${badge.bg} rounded-lg`}>
      {badge.hasDot && <div className={`w-2 h-2 ${badge.dotColor} rounded-full`}></div>}
      <span className={`text-xs ${badge.text} font-medium`}>{badge.label}</span>
    </div>
  );
};

export const EscrowBadge = ({ escrowStatus }) => {
  if (!escrowStatus) return null;

  const statusConfig = {
    pending: { color: 'bg-orange-50 text-orange-700', label: 'Payment Pending' },
    funded: { color: 'bg-blue-50 text-blue-700', label: 'Funds in Escrow' },
    completed: { color: 'bg-green-50 text-green-700', label: 'Payment Released' },
    refunding: { color: 'bg-yellow-50 text-yellow-700', label: 'Refunding' },
    refunded: { color: 'bg-gray-50 text-gray-700', label: 'Refunded' },
    disputed: { color: 'bg-red-50 text-red-700', label: 'Disputed' },
  };

  const config = statusConfig[escrowStatus] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${config.color}`}>
      <Shield size={12} />
      {config.label}
    </div>
  );
};