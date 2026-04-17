'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Edit3, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgencyLinkGenerator from '@/hooks/AgencyLinkGenerator';
import { slugify } from '@/utils/slugify';
import { tablesDB } from '@/lib/config/Appwriteconfig';

const GeneralSettings = ({ agencyData, formData, setFormData, setAgencyData, user, onSuccess, onError }) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const dataToUpdate = {
        name: formData.name.trim(),
        shortCode: slugify(formData.name.trim()),
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
      onError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#00C896] focus:bg-white dark:focus:bg-white/10 transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-white/30";
  const labelClass = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider";

  return (
    <>
      {/* Booking Link Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C896] via-[#00C896] to-[#00C896] rounded-3xl" />
        <div className="relative z-10 p-6">
          <AgencyLinkGenerator agencyId={agencyData.$id} agencyName={agencyData.name} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">Your Information</h3>
            {!editMode && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-white/20 transition-all">
                <Edit3 className="w-4 h-4" /><span>Edit</span>
              </motion.button>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className={labelClass}>Agency Name</label>
                {editMode
                  ? <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={inputClass} placeholder="Enter agency name" />
                  : <p className="text-lg font-semibold text-gray-900 dark:text-white py-3">{agencyData.name || agencyData.contactPerson}</p>}
              </div>
              <div className="space-y-2.5">
                <label className={`flex items-center gap-2 ${labelClass}`}><Phone className="w-3.5 h-3.5" />Phone Number</label>
                {editMode
                  ? <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={inputClass} placeholder="+234 800 000 0000" />
                  : <p className="text-lg font-semibold text-gray-900 dark:text-white py-3">{agencyData.phone || 'N/A'}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2.5">
                <label className={`flex items-center gap-2 ${labelClass}`}><Mail className="w-3.5 h-3.5" />Email Address</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white py-3 truncate">{user.email || 'N/A'}</p>
              </div>
              <div className="space-y-2.5">
                <label className={`flex items-center gap-2 ${labelClass}`}><MapPin className="w-3.5 h-3.5" />Service Cities</label>
                {editMode
                  ? <input type="text" value={formData.serviceCities} onChange={(e) => handleInputChange('serviceCities', e.target.value)} className={inputClass} placeholder="e.g., Lagos, Abuja, Kano" />
                  : (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {agencyData.serviceCities?.split(',').map((c) => c.trim()).filter(Boolean).map((city, i) => (
                        <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                          className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/30 rounded-full text-sm font-medium">
                          {city}
                        </motion.span>
                      ))}
                      {!agencyData.serviceCities && <span className="text-gray-500 dark:text-gray-400 py-2">N/A</span>}
                    </div>
                  )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {editMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => setEditMode(false)} disabled={saving}
                  className="flex-1 py-3.5 px-6 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-white/15 transition-all disabled:opacity-50">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={handleSaveChanges} disabled={saving || !formData.name.trim()}
                  className="flex-1 py-3.5 px-6 bg-[#00C896] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#00C896]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving
                    ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
                    : <><Save className="w-4 h-4" /><span>Save Changes</span></>}
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