'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Weight, AlertCircle } from 'lucide-react';
import PickupDetailsModal from '@/components/PickupDetailsModal';
import DropoffDetailsModal from '@/components/DropoffDetailsModal';
import { useUserRole } from '@/hooks/useUserRole';

export default function DeliveryReview({ delivery, onNext }) {
  const [pinConfirmation, setPinConfirmation] = useState(false);
  const [pickupTime, setPickupTime] = useState('courier');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDropoffModal, setShowDropoffModal] = useState(false);
  
  // Package details
  const [packageSize, setPackageSize] = useState('');
  const [packageWeight, setPackageWeight] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  
  const { userData } = useUserRole();
  const router = useRouter();

  const handlePickupSave = (updatedDelivery) => {
    console.log('Pickup details saved:', updatedDelivery);
  };

  const handleDropoffSave = (updatedDelivery) => {
    console.log('Dropoff details saved:', updatedDelivery);
  };

  const handleContinue = () => {
    // Validate required fields
    if (!packageSize || !packageWeight) {
      alert('Please select package size and weight');
      return;
    }

    // Pass package details to next screen (fare offer)
    const packageDetails = {
      size: packageSize,
      weight: packageWeight,
      description: packageDescription,
      isFragile,
      pinConfirmation,
      pickupTime,
    };

    // Navigate to fare offer screen with package details
    router.push(`/offer-fare?deliveryId=${delivery.$id}`);
    
    // Or call parent function if using state management
    if (onNext) {
      onNext(packageDetails);
    }
  };

  const packageSizes = [
    {
      id: 'small',
      label: 'Small',
      description: 'Fits in a backpack',
      icon: '📦',
      examples: 'Documents, phone, keys',
    },
    {
      id: 'medium',
      label: 'Medium',
      description: 'Fits in a large bag',
      icon: '📫',
      examples: 'Clothes, shoes, books',
    },
    {
      id: 'large',
      label: 'Large',
      description: 'Requires car trunk',
      icon: '📮',
      examples: 'Electronics, multiple items',
    },
  ];

  const weightRanges = [
    { id: 'light', label: 'Under 2 kg', value: '<2' },
    { id: 'medium', label: '2-5 kg', value: '2-5' },
    { id: 'heavy', label: '5-10 kg', value: '5-10' },
    { id: 'very-heavy', label: '10-15 kg', value: '10-15' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-white max-w-2xl mx-auto items-center border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#3A0A21]">Delivery Details</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Contact Details */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-900">Contact Information</h3>
          <div className="space-y-4">
            {/* Sender Details */}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-semibold">
                  {userData?.userName || userData?.name || delivery.pickupContactName || 'Sender'}
                </p>
                <p className="text-sm text-gray-600">{delivery.pickup.address}</p>
                {delivery.pickupStoreName && (
                  <p className="text-sm text-gray-500 mt-1">
                    {delivery.pickupStoreName}
                    {delivery.pickupUnitFloor && ` • ${delivery.pickupUnitFloor}`}
                  </p>
                )}
                <button
                  onClick={() => setShowPickupModal(true)}
                  className="text-[#3A0A21] text-sm font-semibold mt-2"
                >
                  {delivery.pickupContactName ? 'Edit pickup details' : 'Add pickup details'}
                </button>
              </div>
            </div>

            {/* Receiver Details */}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-semibold">{delivery.dropoffContactName || 'Recipient'}</p>
                <p className="text-sm text-gray-600">{delivery.dropoff.address}</p>
                {delivery.dropoffStoreName && (
                  <p className="text-sm text-gray-500 mt-1">
                    {delivery.dropoffStoreName}
                    {delivery.dropoffUnitFloor && ` • ${delivery.dropoffUnitFloor}`}
                  </p>
                )}
                <button
                  onClick={() => setShowDropoffModal(true)}
                  className="text-[#3A0A21] text-sm font-semibold mt-2"
                >
                  {delivery.dropoffContactName ? 'Edit recipient details' : 'Add recipient details'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Package Size */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[#3A0A21]" />
            <h3 className="font-semibold text-gray-900">Package Size</h3>
            <span className="text-red-500">*</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {packageSizes.map((size) => (
              <label
                key={size.id}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  packageSize === size.id
                    ? 'border-[#3A0A21] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="packageSize"
                  value={size.id}
                  checked={packageSize === size.id}
                  onChange={() => setPackageSize(size.id)}
                  className="mt-1 mr-3 text-[#3A0A21]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{size.icon}</span>
                    <p className="font-semibold text-gray-900">{size.label}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{size.description}</p>
                  <p className="text-xs text-gray-500">e.g., {size.examples}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Package Weight */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Weight className="w-5 h-5 text-[#3A0A21]" />
            <h3 className="font-semibold text-gray-900">Package Weight</h3>
            <span className="text-red-500">*</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {weightRanges.map((weight) => (
              <label
                key={weight.id}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  packageWeight === weight.id
                    ? 'border-[#3A0A21] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="packageWeight"
                  value={weight.id}
                  checked={packageWeight === weight.id}
                  onChange={() => setPackageWeight(weight.id)}
                  className="sr-only"
                />
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{weight.label}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Package Description */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold mb-3 text-gray-900">What are you sending? (Optional)</h3>
          <textarea
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
            placeholder="e.g., Birthday gift, documents, laptop..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent outline-none resize-none"
            rows="3"
          />
          <p className="text-xs text-gray-500 mt-2">
            This helps travelers understand what they're carrying
          </p>
        </div>

        {/* Fragile Toggle */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Fragile / Handle with care</p>
                <p className="text-sm text-gray-500">
                  Item requires extra careful handling
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFragile(!isFragile)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isFragile ? 'bg-[#3A0A21]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isFragile ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Pickup Time */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-900">Pickup Time</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
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
                  <p className="font-semibold text-gray-900">ASAP</p>
                  <p className="text-sm text-gray-500">Match with available travelers now</p>
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
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
                  <p className="font-semibold text-gray-900">Schedule for later</p>
                  <p className="text-sm text-gray-500">Choose specific pickup time</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* PIN Confirmation */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">PIN confirmation</p>
              <p className="text-sm text-gray-500">
                Recipient must enter 4-digit PIN to confirm delivery
              </p>
            </div>
            <button
              onClick={() => setPinConfirmation(!pinConfirmation)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pinConfirmation ? 'bg-[#3A0A21]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pinConfirmation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Package Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-blue-900">Package Guidelines</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
              Maximum 15 kg weight
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
              Maximum ₦50,000 value
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
              Must be securely sealed and ready for pickup
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
              No prohibited items (weapons, drugs, etc.)
            </li>
          </ul>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 max-w-2xl mx-auto">
        <button
          onClick={handleContinue}
          disabled={!packageSize || !packageWeight}
          className="w-full bg-[#3A0A21] hover:bg-[#4A0A31] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
        >
          Continue to Set Fare
        </button>
        {(!packageSize || !packageWeight) && (
          <p className="text-center text-sm text-red-500 mt-2">
            Please select package size and weight
          </p>
        )}
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
  );
}