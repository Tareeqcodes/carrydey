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
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        dropoffContactName: initialData?.dropoffContactName || '',
        dropoffPhone: initialData?.dropoffPhone || '',
        dropoffInstructions: initialData?.dropoffInstructions || '',
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

    

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-black/50 backdrop-blur border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Dropoff details
              </h2>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* RECIPIENT INFORMATION */}
            <div>
              <h3 className="font-semibold text-white mb-4">
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
                  className="w-full px-4 py-3 border border-white/10 bg-white/5 rounded-xl focus:border-[#00C896] focus:bg-white/10 focus:outline-none transition-all text-white placeholder-white/30 backdrop-blur-sm"
                />
                <input
                  type="tel"
                  name="dropoffPhone"
                  value={formData.dropoffPhone}
                  onChange={handleInputChange}
                  placeholder="Recipient's phone number"
                  required
                  className="w-full px-4 py-3 border border-white/10 bg-white/5 rounded-xl focus:border-[#00C896] focus:bg-white/10 focus:outline-none transition-all text-white placeholder-white/30 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* DELIVERY LOCATION */}
            <div>
              <h3 className="font-semibold text-sm text-white mb-4">
                Delivery Location
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#00C896] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/70 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-white">
                      {delivery.dropoff?.place_name || 'No address provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                  Additional dropoff instructions (optional)
                </label>
                <input
                  type="text"
                  name="dropoffInstructions"
                  value={formData.dropoffInstructions}
                  onChange={handleInputChange}
                  placeholder="Near Central Mosque, call recipient before arrival"
                  className="w-full px-4 py-3 border border-white/10 bg-white/5 rounded-xl focus:border-[#00C896] focus:bg-white/10 focus:outline-none transition-all text-white placeholder-white/30 backdrop-blur-sm"
                />
                <p className="text-xs text-white/40 mt-1">
                  Add nearby landmarks, building names, or specific location details
                </p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full text-sm text-black font-bold py-4 rounded-xl bg-gradient-to-r from-[#00C896] to-[#00E5AD] hover:from-[#00E5AD] hover:to-[#00C896] transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-xl shadow-[#00C896]/20"
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