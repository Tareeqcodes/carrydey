'use client';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useBrandColors } from '@/hooks/BrandColors';

export default function DropoffDetailsModal({
  isOpen,
  onClose,
  delivery,
  initialData,
  onSave,
}) {
  const { brandColors } = useBrandColors();
  
  const [formData, setFormData] = useState({
    dropoffContactName: initialData?.dropoffContactName || '',
    dropoffPhone: initialData?.dropoffPhone || '',
    dropoffInstructions: initialData?.dropoffInstructions || '',
    recipientPermission: initialData?.recipientPermission || false,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        dropoffContactName: initialData?.dropoffContactName || '',
        dropoffPhone: initialData?.dropoffPhone || '',
        dropoffInstructions: initialData?.dropoffInstructions || '',
        recipientPermission: initialData?.recipientPermission || false,
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.dropoffContactName.trim()) {
      alert("Please enter the recipient's name");
      return;
    }

    if (!formData.dropoffPhone.trim()) {
      alert("Please enter the recipient's phone number");
      return;
    }

    if (!formData.recipientPermission) {
      alert(
        "Please confirm you have permission to share the recipient's phone number."
      );
      return;
    }

    onSave(formData);
    onClose();
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
                Dropoff details
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
            {/* RECIPIENT INFORMATION */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Who's receiving the package?
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="dropoffContactName"
                  value={formData.dropoffContactName}
                  onChange={handleInputChange}
                  placeholder="Recipient's name"
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
                <input
                  type="tel"
                  name="dropoffPhone"
                  value={formData.dropoffPhone}
                  onChange={handleInputChange}
                  placeholder="Recipient's phone number"
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

            {/* DELIVERY LOCATION */}
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-4">
                Delivery Location
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-gray-900">
                      {delivery.dropoff?.place_name || 'No address provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional dropoff instructions (optional)
                </label>
                <input
                  type="text"
                  name="dropoffInstructions"
                  value={formData.dropoffInstructions}
                  onChange={handleInputChange}
                  placeholder="Near Central Mosque, call recipient before arrival"
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
              </div>
            </div>

            {/* PERMISSION CHECKBOX */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="recipientPermission"
                checked={formData.recipientPermission}
                onChange={handleInputChange}
                required
                className="h-5 w-5 mt-0.5 flex-shrink-0"
                style={{
                  accentColor: brandColors.primary,
                }}
              />
              <p className="text-sm text-gray-600">
                I have permission from the recipient to share their phone number
                for delivery updates.
              </p>
            </div>

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
                Save dropoff details
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}