import { Shield, CreditCard } from 'lucide-react';

export const PaymentModal = ({ 
  isOpen, 
  request, 
  processingId, 
  onClose, 
  onConfirm 
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Secure Payment Required
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Traveler:</span>
            <span className="font-medium">{request.traveler}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Package:</span>
            <span className="font-medium">{request.packageTitle}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-600">Amount to pay:</span>
            <span className="font-semibold text-blue-700">
              ₦{request.packageReward?.toLocaleString() || '0'}
            </span>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield size={16} className="text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Funds held securely in escrow
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Payment will only be released to the traveler after you confirm successful delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={processingId === `payment_${request.applicationId}`}
            className="flex-1 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processingId === `payment_${request.applicationId}` ? (
              'Processing...'
            ) : (
              <>
                <CreditCard size={16} />
                Pay Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};