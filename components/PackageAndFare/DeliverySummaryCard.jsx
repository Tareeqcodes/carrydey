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
  onDropoffContactChange
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
    <div className="bg-white p-4">
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Pickup</p>
                <p className="text-sm text-gray-600 truncate">
                  {delivery.pickup?.place_name}
                </p>
                {pickupContact.pickupContactName ? (
                  <div className="mt-2 text-sm">
                    <p className="text-green-600 font-medium">✓ Contact details added</p>
                    <button
                      onClick={() => setShowPickupModal(true)}
                      className="font-semibold mt-1"
                      style={{ color: brandColors.primary }}
                    >
                      Edit details
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPickupModal(true)}
                    className="text-sm font-semibold mt-1"
                    style={{ color: brandColors.primary }}
                  >
                    Add pickup details
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Dropoff</p>
                <p className="text-sm text-gray-600 truncate">
                  {delivery.dropoff?.place_name}
                </p>
                {dropoffContact.dropoffContactName ? (
                  <div className="mt-2 text-sm">
                    <p className="text-green-600 font-medium">✓ Recipient details added</p>
                    <button
                      onClick={() => setShowDropoffModal(true)}
                      className="font-semibold mt-1"
                      style={{ color: brandColors.primary }}
                    >
                      Edit details
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDropoffModal(true)}
                    className="text-sm font-semibold mt-1"
                    style={{ color: brandColors.primary }}
                  >
                    Add recipient details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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