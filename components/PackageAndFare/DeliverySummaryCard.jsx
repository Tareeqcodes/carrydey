'use client';
import { useState } from 'react';
import PickupDetailsModal from '@/components/PickupDetailsModal';
import DropoffDetailsModal from '@/components/DropoffDetailsModal';
import { useUserRole } from '@/hooks/useUserRole';
import { useBrandColors } from '@/hooks/BrandColors';

export default function DeliverySummaryCard({
  delivery,
  pickupContact,
  dropoffContact,
  onPickupContactChange,
  onDropoffContactChange,
}) {
  const { brandColors } = useBrandColors();
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDropoffModal, setShowDropoffModal] = useState(false);
  const { userData } = useUserRole();

  const handlePickupSave = (contactDetails) => {
    onPickupContactChange(contactDetails);
    setShowPickupModal(false);
  };

  const handleDropoffSave = (contactDetails) => {
    onDropoffContactChange(contactDetails);
    setShowDropoffModal(false);
  };

  return (
    <div className="space-y-3">
      {/* Pickup */}
      <button
        onClick={() => setShowPickupModal(true)}
        className="w-full flex items-center gap-3 text-left"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">
            {delivery.pickup?.place_name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Pickup ·{' '}
            {pickupContact.pickupContactName ? (
              <span className="text-emerald-600 font-bold">✓ Contact Details</span>
            ) : (
              <span style={{ color: brandColors.primary }}>Add Details</span>
            )}
          </p>
        </div>
      </button>

      <div className="ml-[3px] w-px h-4 bg-gray-200" />

      {/* Dropoff */}
      <button
        onClick={() => setShowDropoffModal(true)}
        className="w-full flex items-center gap-3 text-left"
      >
        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">
            {delivery.dropoff?.place_name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Dropoff ·{' '}
            {dropoffContact.dropoffContactName ? (
              <span className="text-emerald-600 font-bold">✓ Details added</span>
            ) : (
              <span style={{ color: brandColors.primary }}>Add Details</span>
            )}
          </p>
        </div>
      </button>

      <PickupDetailsModal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        delivery={delivery}
        userData={userData}
        initialData={pickupContact}
        onSave={handlePickupSave}
      />

      <DropoffDetailsModal
        isOpen={showDropoffModal}
        onClose={() => setShowDropoffModal(false)}
        delivery={delivery}
        initialData={dropoffContact}
        onSave={handleDropoffSave}
      />
    </div>
  );
}