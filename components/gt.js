import { CreditCard } from 'lucide-react';

export const RequestAction = ({
  request,
  processingId,
  escrowStatus,
  onAccept,
  onDecline, 
  onPayment,
  // onConfirmDelivery,
  // onRefund,
}) => {
  const currentEscrowStatus = escrowStatus[request.escrowId] || request.escrowStatus;

  if (request.status === 'pending') {
    return (
      <div className="flex items-center gap-2"> 
        <button
          onClick={() => onAccept(request)}
          disabled={processingId === request.applicationId}
          className="flex-1 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {processingId === request.applicationId ? 'Processing...' : 'Accept'}
        </button>
        <button
          onClick={() => onDecline(request.applicationId)}
          disabled={processingId === request.applicationId}
          className="flex-1 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {processingId === request.applicationId ? 'Processing...' : 'Decline'}
        </button>
      </div>
    );
  }

  if (request.status === 'Awaiting payment') {
    return (
      <div className="w-full space-y-3">
        {(!currentEscrowStatus || currentEscrowStatus === 'pending') && (
          <button
            onClick={() => onPayment(request)}
            className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard size={16} />
            Pay ₦{request.reward?.toLocaleString() || '0'} to Escrow
          </button>
        )}

        

        {/* {currentEscrowStatus === 'funded' && (
          <button
            onClick={() => onConfirmDelivery(request.escrowId)}
            disabled={processingId === request.escrowId}
            className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {processingId === request.escrowId ? 'Processing...' : 'Confirm Delivery & Release Payment'}
          </button>
        )}

        {request.status === 'disputed' && currentEscrowStatus === 'funded' && (
          <button
            onClick={() => onRefund(request.escrowId, 'Package dispute')}
            disabled={processingId === request.escrowId}
            className="w-full py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {processingId === request.escrowId ? 'Processing...' : 'Request Refund'}
          </button>
        )} */}
      </div>
    );
  }

  return (
    <div className="flex-1 py-2 text-center text-sm text-gray-500">
      Request accepted ✓
    </div>
  );
};