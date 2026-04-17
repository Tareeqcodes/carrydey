'use client';
import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Loader2,
  Package,
  Phone,
  Navigation,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';
import { formatDistanceToNow } from 'date-fns';

const RouteVisual = ({
  pickup,
  dropoff,
  dropoffInstructions,
  pickupContactName,
  guestName,
}) => (
  <div className="rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
    <div className="flex items-start gap-2.5 px-3 py-2.5">
      <div className="flex flex-col items-center gap-0.5 pt-0.5">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 bg-green-100 flex-shrink-0" />
        <div className="w-px h-5 border-l border-dashed border-black/20 dark:border-white/20" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-0.5">
          Pickup
        </p>
        <p className="text-xs text-black dark:text-white font-medium leading-snug">
          {pickup}
        </p>
        {(guestName || pickupContactName) && (
          <p className="text-[10px] text-black/50 dark:text-white/50 mt-0.5">
            Sender: {guestName || pickupContactName}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-start gap-2.5 px-3 pb-2.5">
      <div className="pt-0.5 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400 bg-red-100" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-0.5">
          Dropoff
        </p>
        <p className="text-xs text-black dark:text-white font-medium leading-snug">
          {dropoff}
        </p>
        {dropoffInstructions && (
          <div className="mt-1.5 flex items-start gap-1.5 rounded-lg px-2 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30">
            <Navigation className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-[10px] leading-snug text-amber-900 dark:text-amber-300">
              {dropoffInstructions}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const DeliveryRequestCard = ({ request, onAccept }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const formattedPayout = formatNairaSimple(request.offeredFare);
  const timeAgo = formatDistanceToNow(new Date(request.$createdAt), {
    addSuffix: true,
  });

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const result = await onAccept(request.$id);
      if (!result?.success) {
        alert(result?.error || 'Failed to accept delivery. Please try again.');
      }
    } catch (error) {
      alert(
        'An error occurred while accepting the delivery. Please try again.'
      );
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-black/40 dark:text-white/40" />
            <span className="text-[10px] text-black/40 dark:text-white/40 font-medium">
              {timeAgo}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {request.isFragile && (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
                Fragile
              </span>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
              Pending
            </span>
          </div>
        </div>

        <RouteVisual
          pickup={request.pickupAddress}
          dropoff={request.dropoffAddress}
          dropoffInstructions={request.dropoffInstructions}
          pickupContactName={request.pickupContactName}
          guestName={request.guestName}
        />

        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 flex items-center gap-1.5 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <Package className="w-3 h-3 text-black/50 dark:text-white/50" />
            <span className="text-xs text-black dark:text-white font-medium">
              {request.packageSize || 'Standard'}
            </span>
          </div>
          {(request.guestPhone || request.pickupPhone) && (
            <div className="flex-1 flex items-center gap-1.5 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <Phone className="w-3 h-3 text-black/50 dark:text-white/50" />
              <span className="text-xs text-black dark:text-white font-medium truncate">
                {request.guestPhone || request.pickupPhone}
              </span>
            </div>
          )}
        </div>

        {request.packageDescription && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
            <p className="text-[9px] font-bold uppercase tracking-widest text-blue-400 mb-0.5">
              Instructions
            </p>
            <p className="text-xs text-blue-900 dark:text-blue-300 leading-snug">
              {request.packageDescription}
            </p>
          </div>
        )}

        <div
          className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: '1px dashed rgba(0,0,0,0.1)' }}
        >
          <div>
            <p className="text-[9px] text-black/40 dark:text-white/40 uppercase font-bold tracking-widest mb-0.5">
              Payout
            </p>
            <p
              className="text-2xl font-black text-green-600"
              style={{ letterSpacing: '-0.5px' }}
            >
              {formattedPayout}
            </p>
          </div>
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isAccepting
                ? '#DCFCE7'
                : 'linear-gradient(135deg, #16A34A, #15803D)',
              color: isAccepting ? '#16A34A' : 'white',
              boxShadow: isAccepting
                ? 'none'
                : '0 4px 14px rgba(22,163,74,0.35)',
            }}
          >
            {isAccepting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Accept
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequestCard;
