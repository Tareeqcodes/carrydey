'use client';
import { useState } from 'react';
import { CheckCircle, Clock, Loader2, Package, Phone, AlertTriangle, Navigation } from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';
import { formatDistanceToNow } from 'date-fns';

const RouteVisual = ({ pickup, dropoff, dropoffInstructions, pickupContactName, guestName }) => (
  <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
    {/* Pickup Row */}
    <div className="flex items-start gap-2.5 px-3 py-2.5">
      <div className="flex flex-col items-center gap-0.5 pt-0.5">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 bg-green-100 flex-shrink-0" />
        <div className="w-px h-5 border-l border-dashed border-gray-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Pickup</p>
        <p className="text-xs text-gray-900 font-medium leading-snug">{pickup}</p>
        {(guestName || pickupContactName) && (
          <p className="text-[10px] text-gray-500 mt-0.5">
            Sender: {guestName || pickupContactName}
          </p>
        )}
      </div>
    </div>

    {/* Dropoff Row */}
    <div className="flex items-start gap-2.5 px-3 pb-2.5">
      <div className="pt-0.5 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-red-400 bg-red-100" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Dropoff</p>
        <p className="text-xs text-gray-900 font-medium leading-snug">{dropoff}</p>
        {dropoffInstructions && (
          <div className="mt-1.5 flex items-start gap-1.5 rounded-lg px-2 py-1.5 bg-amber-50 border border-amber-200">
            <Navigation className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-[10px] leading-snug text-amber-900">{dropoffInstructions}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const DeliveryRequestCard = ({ request, onAccept }) => {
  const [isAccepting, setIsAccepting] = useState(false);

  const formattedPayout = formatNairaSimple(request.suggestedFare);

  const timeAgo = formatDistanceToNow(
    new Date(request.createdAt || request.$createdAt),
    { addSuffix: true }
  );

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const result = await onAccept(request.id || request.$id);
      if (result?.success) {
        console.log('Delivery accepted successfully');
      } else {
        console.error('Failed to accept delivery:', result?.error);
        alert(result?.error || 'Failed to accept delivery. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting delivery:', error);
      alert('An error occurred while accepting the delivery. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 font-medium">{timeAgo}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {request.isFragile && (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-2.5 h-2.5" />
                Fragile
              </span>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
              Pending
            </span>
          </div>
        </div>

        {/* Route Visual with Dropoff Instructions */}
        <RouteVisual
          pickup={request.pickupAddress}
          dropoff={request.dropoffAddress}
          dropoffInstructions={request.dropoffInstructions}
          pickupContactName={request.pickupContactName}
          guestName={request.guestName}
        />

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 flex items-center gap-1.5 p-2 rounded-lg bg-gray-50 border border-gray-200">
            <Package className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-700 font-medium">{request.packageSize || 'Standard'}</span>
          </div>
          {(request.guestPhone || request.pickupPhone) && (
            <div className="flex-1 flex items-center gap-1.5 p-2 rounded-lg bg-gray-50 border border-gray-200">
              <Phone className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-700 font-medium truncate">
                {request.guestPhone || request.pickupPhone}
              </span>
            </div>
          )}
        </div>

        {/* Package Instructions */}
        {(request.instructions || request.packageDescription) && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-[9px] font-bold uppercase tracking-widest text-blue-400 mb-0.5">Instructions</p>
            <p className="text-xs text-blue-900 leading-snug">
              {request.instructions || request.packageDescription}
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: '1px dashed #E5E7EB' }}
        >
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">
              Estimated Payout
            </p>
            <p className="text-2xl font-black text-green-600" style={{ letterSpacing: '-0.5px' }}>
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
              boxShadow: isAccepting ? 'none' : '0 4px 14px rgba(22,163,74,0.35)',
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