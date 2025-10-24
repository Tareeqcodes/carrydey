import { TravelerProfile } from './TravelerProfile';
import { EscrowBadge } from './StatusBadge';
import { RequestAction } from './RequestAction';

export const RequestCard = ({ request, actions }) => {
  return (
    <div className="border border-gray-100 rounded-2xl p-2 hover:border-gray-200 transition-colors bg-white">
      <div className="flex items-start justify-between mb-3">
        <TravelerProfile request={request} />
        
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-gray-400">{request.appliedAt}</span>
        </div>
      </div>

      <EscrowBadge escrowStatus={actions.escrowStatus[request.escrowId] || request.escrowStatus} />

      <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 rounded-lg p-3">
        {request.message}
      </p>

      <RequestAction
        request={request}
        processingId={actions.processingId}
        escrowStatus={actions.escrowStatus}
        onAccept={actions.onAccept}
        onDecline={actions.onDecline}
        onPayment={actions.onPayment}
        onConfirmDelivery={actions.onConfirmDelivery}
        onRefund={actions.onRefund}
      />
    </div>
  );
};