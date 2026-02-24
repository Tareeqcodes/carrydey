'use client';
import { useState } from 'react';
import { Building2, Phone, Mail, MapPin, Edit3, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgencyLinkGenerator from '@/hooks/AgencyLinkGenerator';
import { Link2 } from 'lucide-react';
import { tablesDB } from '@/lib/config/Appwriteconfig';

const GeneralSettings = ({ agencyData, formData, setFormData, setAgencyData, user, onSuccess, onError }) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      const dataToUpdate = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        serviceCities: formData.serviceCities.trim(),
        isAvailable: formData.isAvailable,
        brandColors: JSON.stringify(formData.brandColors),
        tagline: formData.tagline.trim(),
        operationalHours: formData.operationalHours.trim(),
        baseDeliveryFee: formData.baseDeliveryFee ? parseInt(formData.baseDeliveryFee) : null,
        pricePerKm: formData.pricePerKm ? parseInt(formData.pricePerKm) : null,
      };

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data: dataToUpdate,
      });

      setAgencyData((prev) => ({ ...prev, ...dataToUpdate }));
      setEditMode(false);
      onSuccess('Agency information updated successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      onError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Booking Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#3A0A21] via-[#4A1A31] to-[#2A0A21] rounded-3xl" />
        <div className="relative z-10 p-6">
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl"
            >
              <Link2 className="w-7 h-7 text-white" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-white mb-1.5 tracking-tight">
                Your Booking Link
              </h2>
              <p className="text-white/70 text-xs leading-relaxed">
                Share this link with customers to receive bookings
              </p>
            </div>
          </div>
          <AgencyLinkGenerator agencyId={agencyData.$id} />
        </div>
      </motion.div>

      {/* Agency Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A0A21] to-[#5A1A41] flex items-center justify-center shadow-lg shadow-[#3A0A21]/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                Agency Information
              </h3>
            </div>

            {!editMode && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </motion.button>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Agency Name */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Agency Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3A0A21] focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    placeholder="Enter agency name"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 py-3">
                    {agencyData.name || agencyData.contactPerson}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3A0A21] focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    placeholder="+234 800 000 0000"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 py-3">
                    {agencyData.phone || 'N/A'}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Email */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </label>
                <p className="text-lg font-semibold text-gray-900 py-3 truncate">
                  {user.email || 'N/A'}
                </p>
              </div>

              {/* Service Cities */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  Service Cities
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.serviceCities}
                    onChange={(e) => handleInputChange('serviceCities', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3A0A21] focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    placeholder="e.g., Lagos, Abuja, Kano"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {agencyData.serviceCities
                      ?.split(',')
                      .map((city) => city.trim())
                      .filter((city) => city !== '')
                      .map((city, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 rounded-full text-sm font-medium shadow-sm"
                        >
                          {city}
                        </motion.span>
                      ))}
                    {!agencyData.serviceCities && (
                      <span className="text-gray-500 py-2">N/A</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save / Cancel Buttons */}
          <AnimatePresence>
            {editMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-gray-100"
              >
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                  className="flex-1 py-3.5 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSaveChanges}
                  disabled={saving || !formData.name.trim()}
                  className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#3A0A21]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default GeneralSettings;