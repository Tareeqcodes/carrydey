'use client';
import { useState } from 'react';
import { MapPin } from 'lucide-react';

export default function PickupDetailsModal({
  isOpen,
  onClose,
  delivery,
  userData,
  initialData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    pickupContactName:
      initialData?.pickupContactName ||
      userData?.userName ||
      userData?.name ||
      '',
    pickupPhone: initialData?.pickupPhone || userData?.phone || '',
    pickupStoreName: initialData?.pickupStoreName || '',
    pickupUnitFloor: initialData?.pickupUnitFloor || '',
    pickupOption: initialData?.pickupOption || 'curb',
    pickupInstructions: initialData?.pickupInstructions || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      pickupOption: option,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#3A0A21]">
                Pickup details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div>
             

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="pickupContactName"
                    value={formData.pickupContactName}
                    onChange={handleInputChange}
                    placeholder="Enter contact name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pre-filled from your profile:{' '}
                    {userData?.userName || userData?.name || 'Not set'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="pickupPhone"
                    value={formData.pickupPhone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]"
                  />
                </div>
              </div>
            </div>

            {/* PICKUP LOCATION */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-4">
                Pickup Location
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Pickup Address
                    </p>
                    <p className="text-gray-900">
                      {delivery.pickup?.place_name || 'No address provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store or building name (optional)
                  </label>
                  <input
                    type="text"
                    name="pickupStoreName"
                    value={formData.pickupStoreName}
                    onChange={handleInputChange}
                    placeholder="E.g. Mall, Office Complex"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit/Floor (optional)
                  </label>
                  <input
                    type="text"
                    name="pickupUnitFloor"
                    value={formData.pickupUnitFloor}
                    onChange={handleInputChange}
                    placeholder="E.g. Unit 5, Floor 3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]"
                  />
                </div>
              </div>
            </div>

            {/* PICKUP OPTIONS */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-4">
                Pickup options
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.pickupOption === 'curb'}
                    onChange={() => handleOptionChange('curb')}
                    className="h-5 w-5 text-[#3A0A21]"
                  />
                  <span>Meet at curb</span>
                </label>
                <label className="flex text-sm items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.pickupOption === 'door'}
                    onChange={() => handleOptionChange('door')}
                    className="h-5 w-5 text-[#3A0A21]"
                  />
                  <span>Meet at door</span>
                </label>
              </div>
            </div>

            {/* INSTRUCTIONS */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-4">
                Instructions for courier (optional)
              </h3>
              <textarea
                name="pickupInstructions"
                value={formData.pickupInstructions}
                onChange={handleInputChange}
                placeholder="E.g.: Look for the blue gate, call when arrived..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21] resize-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full text-sm bg-[#3A0A21] text-white font-semibold py-4 rounded-lg hover:bg-[#2d0719] transition"
              >
                Save pickup details
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
