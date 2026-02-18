'use client';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useBrandColors } from '@/hooks/BrandColors';

export default function PickupDetailsModal({
  isOpen,
  onClose,
  delivery,
  userData,
  initialData,
  onSave,
}) {
  const { brandColors } = useBrandColors();
  
  const [formData, setFormData] = useState({
    pickupContactName:
      initialData?.pickupContactName || userData?.userName || '',
    pickupPhone: initialData?.pickupPhone || userData?.phone || '',
    // pickupInstructions: initialData?.pickupInstructions || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
              <h2 
                className="text-xl font-bold"
                style={{ color: brandColors.primary }}
              >
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all"
                    onFocus={(e) => {
                      e.target.style.borderColor = brandColors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${brandColors.primary}10`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all"
                    onFocus={(e) => {
                      e.target.style.borderColor = brandColors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${brandColors.primary}10`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
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
            </div>

            {/* <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Helps the courier locate you faster (recommended)
              </label>
              <input
                type="text"
                name="pickupInstructions"
                value={formData.pickupInstructions}
                onChange={handleInputChange}
                placeholder="E.g. Behind Shoprite, Plaza, Floor 2 Room 12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition-all"
                onFocus={(e) => {
                  e.target.style.borderColor = brandColors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${brandColors.primary}10`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Add nearby landmarks, building names, or specific location details
              </p>
            </div> */}

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full text-sm text-white font-semibold py-4 rounded-lg transition"
                style={{
                  background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
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