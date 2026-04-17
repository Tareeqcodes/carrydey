'use client';
import { useRouter } from 'next/navigation';
import { formatNairaSimple } from '@/hooks/currency';
import { useBrandColors } from '@/hooks/BrandColors';
import { useAuth } from '@/hooks/Authcontext';

export default function StickyConfirmBar({ isValid, loading, onConfirm, fareDetails, deliverySnapshot, isAgencyBooking = false }) {
  const { brandColors } = useBrandColors();
  const { user } = useAuth();
  const router = useRouter();

  const paymentLabel = { cash_on_pickup: 'Cash on pickup', pay_now: 'Card · Pay now' }[fareDetails?.paymentMethod] || '';

  const handleClick = () => {
    if (!isValid || loading) return;
    if (!user) {
      if (deliverySnapshot) {
        const snapshotToSave = {
          ...deliverySnapshot,
          fareDetails: {
            offeredFare: fareDetails?.offeredFare ?? 0,
            paymentMethod: fareDetails?.paymentMethod ?? null,
            isLongDistance: fareDetails?.isLongDistance ?? false,
            fareMode: fareDetails?.fareMode ?? null,
          },
        };
        localStorage.setItem('pendingDelivery', JSON.stringify(snapshotToSave));
      }
      localStorage.setItem('postAuthRedirect', '/send');
      router.push('/login');
      return;
    }
    onConfirm();
  };

  return (
    <div
      className="sticky bottom-0 left-0 right-0 px-5 pt-6 pb-6 max-w-md mx-auto"
      style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95) 75%, transparent) ' }}
    >
      {/* dark mode gradient overlay via a sibling — handled with a wrapper */}
      <div className="dark:[background:linear-gradient(to_top,rgba(0,0,0,0.95)_75%,transparent)] absolute inset-0 pointer-events-none hidden dark:block rounded-t-2xl" />

      {isValid && paymentLabel && (
        <div className="relative flex justify-between items-center mb-3 px-1">
          <p className="text-xs text-black/40 dark:text-white/40">{paymentLabel}</p>
          <p className="text-sm font-bold text-black dark:text-white">{formatNairaSimple(fareDetails?.offeredFare)}</p>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={!isValid || loading}
        className="relative w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:cursor-not-allowed active:scale-[0.98]"
        style={{
          background: isValid && !loading ? 'linear-gradient(135deg, #00C896 0%, #00E5AD 100%)' : undefined,
          color: isValid && !loading ? '#000' : undefined,
          boxShadow: isValid && !loading ? '0 8px 24px rgba(0,200,150,0.2)' : 'none',
        }}
        {...(!(isValid && !loading) && { className: 'relative w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:cursor-not-allowed active:scale-[0.98] bg-black/10 dark:bg-white/10 text-black/40 dark:text-white/40' })}
      >
        {loading
          ? isAgencyBooking ? 'Confirming...' : 'Finding...'
          : !user ? 'Login to Continue'
          : isAgencyBooking ? 'Continue' : 'Find couriers'}
      </button>

      {isValid && !user && (
        <p className="relative text-center text-xs text-black/40 dark:text-white/40 mt-2">
          Your delivery details will be saved
        </p>
      )}
    </div>
  );
}