'use client';
import { useRouter } from 'next/navigation';
import { formatNairaSimple } from '@/hooks/currency';
import { useBrandColors } from '@/hooks/BrandColors';
import { useAuth } from '@/hooks/Authcontext';

export default function StickyConfirmBar({
  isValid,
  loading,
  onConfirm,
  fareDetails,
  deliverySnapshot,
}) {
  const { brandColors } = useBrandColors();
  const { user } = useAuth();
  const router = useRouter();

  const paymentLabel = {
    cash_on_pickup: 'Cash on pickup',
    pay_now: 'Card · Pay now',
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

    onConfirm();
  };

  return (
    <div
      className="sticky bottom-0 left-0 right-0 px-5 pt-6 pb-6 max-w-md mx-auto"
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
          color: isValid && !loading ? 'white' : '#9ca3af',
        }}
      >
        {loading
          ? 'Finding...'
          : !user
          ? 'Login to Continue'   
          : 'find couriers'}
      </button>

      {/* Guest nudge — only show when form is valid and user is not logged in */}
      {isValid && !user && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Your delivery details will be saved
        </p>
      )}
    </div>
  );
}