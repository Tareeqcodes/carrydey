'use client';
import { useRouter } from 'next/navigation';
import { formatNairaSimple } from '@/hooks/currency';
import { useBrandColors } from '@/hooks/BrandColors';
import { useAuth } from '@/hooks/Authcontext';

export default function StickyConfirmBar({
  isValid,
  loading,
  onConfirm,        // called with no args — Screen's handleConfirm closes over the data
  fareDetails,
  deliverySnapshot, // full snapshot for localStorage if user not logged in
}) {
  const { brandColors } = useBrandColors();
  const { user } = useAuth();
  const router = useRouter();

  const paymentLabel = {
    cash_on_pickup: 'Cash on pickup',
    pay_now:        'Card · Pay now',
  }[fareDetails?.paymentMethod] || '';

  const handleClick = () => {
    if (!isValid || loading) return;

    if (!user) {
      if (deliverySnapshot) {
        localStorage.setItem('pendingDelivery', JSON.stringify(deliverySnapshot));
      }
      localStorage.setItem('postAuthRedirect', '/check');
      router.push('/login');
      return;
    }

    // ✅ Call with no arguments — Screen's handleConfirm already has packageDetails
    // and fareDetails closed over from its own state
    onConfirm();
  };

  return (
    <div
      className="sticky bottom-0 left-0 right-0 px-5 pt-6 max-w-md mx-auto"
      style={{ background: 'linear-gradient(to top, white 75%, transparent)' }}
    >
      {isValid && paymentLabel && (
        <div className="flex justify-between items-center mb-3 px-1">
          <p className="text-xs text-gray-400">{paymentLabel}</p>
          <p className="text-sm font-bold text-gray-900">
            {formatNairaSimple(fareDetails?.offeredFare)}
          </p>
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={!isValid || loading}
        className="w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:cursor-not-allowed"
        style={{
          background: isValid && !loading ? brandColors.primary : '#e5e7eb',
          color:      isValid && !loading ? 'white' : '#9ca3af',
        }}
      >
        {loading ? 'Creating…' : 'Confirm & continue'}
      </button>
    </div>
  );
}