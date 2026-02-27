'use client';
import { useRef } from 'react';
import {
  Building2,
  Save,
  Upload,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { tablesDB, storage, ID } from '@/lib/config/Appwriteconfig';

const COLOR_PRESETS = [
  {
    name: 'Ocean Blue',
    primary: '#0A2A3A',
    secondary: '#1A4A6A',
    accent: '#2E6B8B',
  },
  {
    name: 'Forest Green',
    primary: '#0A3A1A',
    secondary: '#1A5A2A',
    accent: '#2E8B4A',
  },
  {
    name: 'Bright Yellow',
    primary: '#3A3A00',
    secondary: '#5A5A00',
    accent: '#FFFF00',
  },
];

const BrandingSettings = ({
  agencyData,
  formData,
  setFormData,
  setAgencyData,
  onSuccess,
  onError,
}) => {
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (colorType, value) => {
    setFormData((prev) => ({
      ...prev,
      brandColors: { ...prev.brandColors, [colorType]: value },
    }));
  };

  const applyColorPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      brandColors: {
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent,
      },
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      onError('Image size should be less than 2MB');
      return;
    }

    try {
      setFormData((prev) => ({ ...prev, uploadingLogo: true }));

      if (agencyData.logoFileId) {
        try {
          await storage.deleteFile({
            bucketId: process.env.NEXT_PUBLIC_APPWRITE_LOGO_BUCKET_ID,
            fileId: agencyData.logoFileId,
          });
        } catch (err) {
          console.log('Old logo deletion failed:', err);
        }
      }

      const fileId = ID.unique();
      const uploadedFile = await storage.createFile({
        bucketId: process.env.NEXT_PUBLIC_APPWRITE_LOGO_BUCKET_ID,
        fileId,
        file,
      });

      const fileUrl = storage.getFileView({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        bucketId: process.env.NEXT_PUBLIC_APPWRITE_LOGO_BUCKET_ID,
        fileId: uploadedFile.$id,
      });

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data: { logoUrl: fileUrl.href, logoFileId: uploadedFile.$id },
      });

      setFormData((prev) => ({
        ...prev,
        logoUrl: fileUrl.href,
        uploadingLogo: false,
      }));
      setAgencyData((prev) => ({
        ...prev,
        logoUrl: fileUrl.href,
        logoFileId: uploadedFile.$id,
      }));
      onSuccess('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      setFormData((prev) => ({ ...prev, uploadingLogo: false }));
      onError('Failed to upload logo');
    }
  };

  const handleSaveBranding = async () => {
    try {
      setFormData((prev) => ({ ...prev, saving: true }));

      const dataToUpdate = {
        brandColors: JSON.stringify(formData.brandColors),
        tagline: formData.tagline.trim(),
      };

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data: dataToUpdate,
      });

      setAgencyData((prev) => ({ ...prev, ...dataToUpdate }));
      onSuccess('Branding updated successfully!');
    } catch (error) {
      console.error('Error saving branding:', error);
      onError('Failed to save branding. Please try again.');
    } finally {
      setFormData((prev) => ({ ...prev, saving: false }));
    }
  };

  const uploadingLogo = formData.uploadingLogo || false;
  const saving = formData.saving || false;

  return (
    <>
      {/* Logo Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              {formData.logoUrl ? (
                <div className="w-20 h-20 rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-sm">
                  <img
                    src={formData.logoUrl}
                    alt="Agency Logo"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="flex items-center gap-2 px-6 py-3 bg-[#3A0A21] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all disabled:opacity-50"
              >
                {uploadingLogo ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">
                      {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </span>
                  </>
                )}
              </motion.button>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG up to 2MB. Recommended: 500x500px
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Color Customization Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-[11px] md:text-sm font-semibold text-gray-900 tracking-tight">
                Customize your brand colors to match your identity
              </h3>
            </div>
          </div>

          <div className="space-y-6">
            {/* Presets */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COLOR_PRESETS.map((preset) => (
                  <motion.button
                    key={preset.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyColorPreset(preset)}
                    className="group relative p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-all"
                  >
                    <div className="flex gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: preset.secondary }}
                      />
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-700 text-left">
                      {preset.name}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['primary', 'secondary', 'accent'].map((colorKey) => (
                <div key={colorKey}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {colorKey} Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.brandColors[colorKey]}
                      onChange={(e) =>
                        handleColorChange(colorKey, e.target.value)
                      }
                      className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.brandColors[colorKey]}
                      onChange={(e) =>
                        handleColorChange(colorKey, e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="p-6 rounded-2xl border-2 border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                Preview
              </p>
              <div
                className="p-6 rounded-xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${formData.brandColors.primary} 0%, ${formData.brandColors.secondary} 100%)`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {formData.logoUrl ? (
                    <div className="w-12 h-12 bg-white rounded-xl p-1.5">
                      <img
                        src={formData.logoUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white text-xs tracking-tight">
                      {formData.name || 'Your Agency'}
                    </p>
                    <p className="text-white/80 text-xs">
                      {formData.tagline || 'Professional Logistics'}
                    </p>
                  </div>
                </div>
                <div
                  className="px-4 py-2 rounded-lg inline-block shadow-lg"
                  style={{ backgroundColor: formData.brandColors.accent }}
                >
                  <span className="text-white font-semibold text-sm">
                    Book Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="e.g., Fast & Reliable Deliveries"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSaveBranding}
              disabled={saving}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#3A0A21]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Branding</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default BrandingSettings;
