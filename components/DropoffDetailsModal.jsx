'use client';
import { useState } from 'react';
import { tablesDB } from '@/lib/config/Appwriteconfig';
import { MapPin } from 'lucide-react';

export default function DropoffDetailsModal({
  isOpen,
  onClose,
  delivery,
  onSave,
}) {
  const [formData, setFormData] = useState({
    dropoffContactName: delivery?.dropoffContactName || '',
    dropoffPhone: delivery?.dropoffPhone || '',
    dropoffStoreName: delivery?.dropoffStoreName || '',
    dropoffUnitFloor: delivery?.dropoffUnitFloor || '',
    dropoffOption: delivery?.dropoffOption || 'door',
    dropoffInstructions: delivery?.dropoffInstructions || '',
    recipientPermission: delivery?.recipientPermission || false,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleOptionChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      dropoffOption: option,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recipientPermission) {
      alert(
        "Please confirm you have permission to share the recipient's phone number."
      );
      return;
    }

    setLoading(true);

    try {
      const updatedData = {
        dropoffContactName: formData.dropoffContactName,
        dropoffPhone: formData.dropoffPhone,
        dropoffStoreName: formData.dropoffStoreName,
        dropoffUnitFloor: formData.dropoffUnitFloor,
        dropoffOption: formData.dropoffOption,
        dropoffInstructions: formData.dropoffInstructions,
        recipientPermission: formData.recipientPermission,
      };

      const result = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: delivery.$id,
        data: updatedData,
      });

      console.log('Dropoff details updated:', result);

      if (onSave) {
        onSave(result);
      }

      onClose();
    } catch (error) {
      console.error('Error updating dropoff details:', error);
      alert('Failed to save dropoff details. Please try again.');
    } finally {
      setLoading(false);
    }
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
            {/* Recipient Information */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]"
                />
                <input
                  type="tel"
                  name="dropoffPhone"
                  value={formData.dropoffPhone}
                  onChange={handleInputChange}
                  placeholder="Recipient's phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
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
                      {delivery.dropoff.address || 'No address provided'}
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
                    name="dropoffStoreName"
                    value={formData.dropoffStoreName}
                    onChange={handleInputChange}
                    placeholder="E.g. Mosque, School, Hospital"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit/Floor (optional)
                  </label>
                  <input
                    type="text"
                    name="dropoffUnitFloor"
                    value={formData.dropoffUnitFloor}
                    onChange={handleInputChange}
                    placeholder="E.g. Room 12, Floor 2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Dropoff options
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.dropoffOption === 'curb'}
                    onChange={() => handleOptionChange('curb')}
                    className="h-5 w-5 text-[#3A0A21]"
                  />
                  <span>Meet at curb</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.dropoffOption === 'door'}
                    onChange={() => handleOptionChange('door')}
                    className="h-5 w-5 text-[#3A0A21]"
                  />
                  <span>Meet at door</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Instructions for driver
              </h3>
              <textarea
                name="dropoffInstructions"
                value={formData.dropoffInstructions}
                onChange={handleInputChange}
                placeholder="E.g.: Call recipient before arrival, leave at security..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21] resize-none"
              />
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="recipientPermission"
                checked={formData.recipientPermission}
                onChange={handleInputChange}
                className="h-5 w-5 text-[#3A0A21] mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-gray-600">
                I have permission from the recipient to share their phone number
                for delivery updates.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3A0A21] text-white font-semibold py-4 rounded-lg hover:bg-[#2d0719] transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save dropoff details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
