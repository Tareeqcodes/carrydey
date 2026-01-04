'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PickupDetailsModal from '@/components/PickupDetailsModal';
import DropoffDetailsModal from '@/components/DropoffDetailsModal';
import { useUserRole } from '@/hooks/useUserRole';

export default function DeliveryReview({ delivery }) {
  const [pinConfirmation, setPinConfirmation] = useState(false);
  const [pickupTime, setPickupTime] = useState('courier');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDropoffModal, setShowDropoffModal] = useState(false);
  const { userData } = useUserRole();
  const router = useRouter();


  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-NG', {
  //     style: 'currency',
  //     currency: 'NGN',
  //     minimumFractionDigits: 0,
  //   }).format(amount);
  // };

  const handlePickupSave = (updatedDelivery) => {
    // Delivery object is updated in place via the modal
    console.log('Pickup details saved:', updatedDelivery);
  };

  const handleDropoffSave = (updatedDelivery) => {
    // Delivery object is updated in place via the modal
    console.log('Dropoff details saved:', updatedDelivery);
  };

  const handleTraveler = () => {
    router.push('/check');
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="bg-white mt-20 max-w-2xl mx-auto items-center border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#3A0A21]">Delivery details</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="space-y-4">
            {/* Sender Details */}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-semibold">
                   {userData?.userName || userData?.name || delivery.pickupContactName || 'Sender'}
                </p>
                <p className="text-sm text-gray-600">
                  {delivery.pickup.address}
                </p>
                {delivery.pickupStoreName && (
                  <p className="text-sm text-gray-500 mt-1">
                    {delivery.pickupStoreName}{' '}
                    {delivery.pickupUnitFloor &&
                      `• ${delivery.pickupUnitFloor}`}
                  </p>
                )}
                <button
                  onClick={() => setShowPickupModal(true)}
                  className="text-[#3A0A21] text-sm font-semibold mt-2"
                >
                  {delivery.pickupContactName
                    ? 'Edit pickup details'
                    : 'Add pickup details'}
                </button>
              </div>
            </div>

            {/* Receiver Details */}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-semibold">
                  {delivery.dropoffContactName || 'Recipient'}
                </p>
                <p className="text-sm text-gray-600">
                  {delivery.dropoff.address}
                </p>
                {delivery.dropoffStoreName && (
                  <p className="text-sm text-gray-500 mt-1">
                    {delivery.dropoffStoreName}{' '}
                    {delivery.dropoffUnitFloor &&
                      `• ${delivery.dropoffUnitFloor}`}
                  </p>
                )}
                <button
                  onClick={() => setShowDropoffModal(true)}
                  className="text-[#3A0A21] text-sm font-semibold mt-2"
                >
                  {delivery.dropoffContactName
                    ? 'Edit recipient details'
                    : 'Add recipient details'}
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Delivered by car or bike</span>
                <span className="text-sm text-gray-500">
                  Based on item size
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold mb-4">Pickup time</h3>

          <div className="space-y-3">
            {/* Courier Option */}
            <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="pickupTime"
                  value="courier"
                  checked={pickupTime === 'courier'}
                  onChange={() => setPickupTime('courier')}
                  className="mr-3 text-[#3A0A21]"
                />
                <div>
                  <p className="font-semibold">Courier</p>
                  <p className="text-sm text-gray-500">Pickup in 5 min</p>
                </div>
              </div>
            </label>

            {/* Schedule Option */}
            <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="pickupTime"
                  value="schedule"
                  checked={pickupTime === 'schedule'}
                  onChange={() => setPickupTime('schedule')}
                  className="mr-3 text-[#3A0A21]"
                />
                <div>
                  <p className="font-semibold">Schedule for later</p>
                  <p className="text-sm text-gray-500">Fare may change</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Peace of Mind */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold mb-4">Add peace of mind?</h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">PIN confirmation</p>
              <p className="text-sm text-gray-500">
                Turn on to confirm delivery with a 4-digit PIN
              </p>
            </div>
            <button
              onClick={() => setPinConfirmation(!pinConfirmation)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                pinConfirmation ? 'bg-[#3A0A21]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  pinConfirmation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Package Guidelines */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold mb-4">Review package guidelines</h3>

          <p className="text-sm text-gray-600 mb-3">
            For a successful delivery, make sure your package is:
          </p>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-[#3A0A21] rounded-full mr-3"></div>
              15 kg or less
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-[#3A0A21] rounded-full mr-3"></div>
              ₦50,000 or less in value
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-[#3A0A21] rounded-full mr-3"></div>
              Securely sealed and ready for pickup
            </li>
          </ul>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button onClick={handleTraveler} className="w-full bg-[#3A0A21] text-white font-semibold py-4 rounded-lg text-center">
            Pick your Ride
          </button>
        </div>

        {/* Modals */}
        <PickupDetailsModal
          isOpen={showPickupModal}
          onClose={() => setShowPickupModal(false)}
          delivery={delivery}
          userData={userData}
          onSave={handlePickupSave}
        />

        <DropoffDetailsModal
          isOpen={showDropoffModal}
          onClose={() => setShowDropoffModal(false)}
          delivery={delivery}
          onSave={handleDropoffSave}
        />
      </div>
    </div>
  );
}
