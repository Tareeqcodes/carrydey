'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Link2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Edit3,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Award,
  Shield,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Settings,
  Zap,
  BarChart3,
  Users,
  Package,
  TrendingUp,
  Briefcase,
  Globe,
  Clock,
  DollarSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@headlessui/react';
import AgencyLinkGenerator from '@/hooks/AgencyLinkGenerator';
import AgencySettingLoading from './AgencySettingLoading';
import { useAuth } from '@/hooks/Authcontext';
import { tablesDB, Query, storage, ID } from '@/lib/config/Appwriteconfig';

const COLOR_PRESETS = [
  { name: 'Ocean Blue', primary: '#0A2A3A', secondary: '#1A4A6A', accent: '#2E6B8B' },
  { name: 'Forest Green', primary: '#0A3A1A', secondary: '#1A5A2A', accent: '#2E8B4A' },
  { name: 'Midnight Navy', primary: '#0A0A3A', secondary: '#1A1A5A', accent: '#2E2E8B' },
  
];

const AgencySettingsPage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // general, branding, operational

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceCities: '',
    isAvailable: false,
    logoUrl: '',
    brandColors: {
      primary: '#3A0A21',
      secondary: '#5A1A41',
      accent: '#8B2E5A',
    },
    tagline: '',
    operationalHours: '',
    baseDeliveryFee: '',
    pricePerKm: '',
  });

  useEffect(() => {
    fetchAgencyData();
  }, [user]);

  const fetchAgencyData = async () => {
    if (!user?.$id) return;

    try {
      setLoading(true);
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        queries: [Query.equal('userId', user.$id)],
      });

      if (response.rows.length > 0) {
        const agency = response.rows[0];
        setAgencyData(agency);
        
        // Parse brand colors if they exist
        let brandColors = {
          primary: '#3A0A21',
          secondary: '#5A1A41',
          accent: '#8B2E5A',
        };
        
        if (agency.brandColors) {
          try {
            brandColors = JSON.parse(agency.brandColors);
          } catch (e) {
            console.error('Error parsing brand colors:', e);
          }
        }

        setFormData({
          name: agency.name || agency.contactPerson || '',
          phone: agency.phone || '',
          serviceCities: agency.serviceCities || '',
          isAvailable: agency.isAvailable || false,
          logoUrl: agency.logoUrl || '',
          brandColors: brandColors,
          tagline: agency.tagline || '',
          operationalHours: agency.operationalHours || '',
          baseDeliveryFee: agency.baseDeliveryFee || '',
          pricePerKm: agency.pricePerKm || '',
        });
      }
    } catch (error) {
      console.error('Error fetching agency data:', error);
      setError('Failed to load agency data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (colorType, value) => {
    setFormData((prev) => ({
      ...prev,
      brandColors: {
        ...prev.brandColors,
        [colorType]: value,
      },
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setUploadingLogo(true);

      // Delete old logo if exists
      if (agencyData.logoFileId) {
        try {
          await storage.deleteFile({
            bucketId: process.env.NEXT_PUBLIC_APPWRITE_LOGO_BUCKET_ID,
            fileId: agencyData.logoFileId,
          }
          );
        } catch (err) {
          console.log('Old logo deletion failed:', err);
        }
      }

      // Upload new logo
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile({
        bucketId: process.env.NEXT_PUBLIC_APPWRITE_LOGO_BUCKET_ID,
        fileId: fileId,
        file: file,
      });

      // Get file URL
      const fileUrl = storage.getFileView({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        bucketId: process.env.NEXT_PUBLIC_APPWRITE_LOGO_BUCKET_ID,
        fileId: uploadedFile.$id,
      });
      // Update in database
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data: {
          logoUrl: fileUrl.href,
          logoFileId: uploadedFile.$id,
        },
      });

      setFormData((prev) => ({ ...prev, logoUrl: fileUrl.href }));
      setAgencyData((prev) => ({ ...prev, logoUrl: fileUrl.href, logoFileId: uploadedFile.$id }));
      setSuccessMessage('Logo uploaded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setError('Failed to upload logo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAvailabilityToggle = async (newValue) => {
    try {
      setFormData((prev) => ({ ...prev, isAvailable: newValue }));

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data: {
          isAvailable: newValue,
        },
      });

      setAgencyData((prev) => ({ ...prev, isAvailable: newValue }));

      setSuccessMessage(
        newValue
          ? 'Your agency is now visible to customers'
          : 'Your agency is now hidden from customers'
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating availability:', error);
      setFormData((prev) => ({ ...prev, isAvailable: !newValue }));
      setError('Failed to update availability');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError(null);

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

      setAgencyData((prev) => ({
        ...prev,
        ...dataToUpdate,
      }));

      setEditMode(false);
      setSuccessMessage('Agency information updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AgencySettingLoading />;
  }

  if (!agencyData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            No Agency Profile
          </h3>
          <p className="text-gray-500 leading-relaxed">
            Complete your agency registration to get started
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Toast Notifications */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-green-100/50 p-5 flex items-center gap-4 backdrop-blur-xl">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Success</p>
                <p className="text-xs text-gray-600 mt-0.5">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-red-100/50 p-5 flex items-center gap-4 backdrop-blur-xl">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Error</p>
                <p className="text-xs text-gray-600 mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="mx-auto px-4 mb-28 lg:px-8 py-8 sm:py-12 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">Manage your logistics operations center</h1>
            </div>
            {/* <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Operational</span>
                </div>
              </div>
            </div> */}
          </div>
        </motion.div>

        {/* Tabs Navigation - Notion Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'general'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                General
              </div>
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'branding'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Branding
              </div>
            </button>
            <button
              onClick={() => setActiveTab('operational')}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'operational'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Operations
              </div>
            </button>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Tab */}
            {activeTab === 'general' && (
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
                        <h2 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                          Your Booking Link
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed">
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
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                            Agency Information
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Keep your details up to date
                          </p>
                        </div>
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
                        <div className="space-y-2.5">
                          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <Mail className="w-3.5 h-3.5" />
                            Email Address
                          </label>
                          <p className="text-lg font-semibold text-gray-900 py-3 truncate">
                            {user.email || 'N/A'}
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <MapPin className="w-3.5 h-3.5" />
                            Service Cities
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={formData.serviceCities}
                              onChange={(e) =>
                                handleInputChange('serviceCities', e.target.value)
                              }
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
                            onClick={() => {
                              setEditMode(false);
                              fetchAgencyData();
                            }}
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
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <>
                {/* Logo Upload Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                          Agency Logo
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Upload your brand logo
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Logo Preview */}
                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          {formData.logoUrl ? (
                            <div className="w-32 h-32 rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-sm">
                              <img
                                src={formData.logoUrl}
                                alt="Agency Logo"
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
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
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                          >
                            {uploadingLogo ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-5 h-5" />
                                <span>{formData.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                              </>
                            )}
                          </motion.button>
                          <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG up to 2MB. Recommended: 500x500px
                          </p>
                        </div>
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
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                          Brand Colors
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Customize your brand palette
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Color Presets */}
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
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Primary Color
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.brandColors.primary}
                              onChange={(e) => handleColorChange('primary', e.target.value)}
                              className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.brandColors.primary}
                              onChange={(e) => handleColorChange('primary', e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Secondary Color
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.brandColors.secondary}
                              onChange={(e) => handleColorChange('secondary', e.target.value)}
                              className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.brandColors.secondary}
                              onChange={(e) => handleColorChange('secondary', e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Accent Color
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.brandColors.accent}
                              onChange={(e) => handleColorChange('accent', e.target.value)}
                              className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.brandColors.accent}
                              onChange={(e) => handleColorChange('accent', e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="p-6 rounded-2xl border-2 border-gray-200 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700 mb-4">Preview</p>
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
                              <p className="font-bold text-white text-lg">
                                {formData.name || 'Your Agency'}
                              </p>
                              <p className="text-white/80 text-sm">
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
                          Agency Tagline
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
                        onClick={handleSaveChanges}
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
            )}

            {/* Operational Tab */}
            {activeTab === 'operational' && (
              <>
                {/* Operational Hours & Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                          Operational Details
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Set your business hours and emergency contacts
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Operational Hours
                        </label>
                        <input
                          type="text"
                          value={formData.operationalHours}
                          onChange={(e) => handleInputChange('operationalHours', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                          placeholder="e.g., Mon-Fri: 8AM-6PM, Sat: 9AM-2PM"
                        />
                      </div>

                   

                     
                    </div>
                  </div>
                </motion.div>

                {/* Pricing Configuration */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                          Pricing Structure
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Configure your delivery fees
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Base Delivery Fee (₦)
                          </label>
                          <input
                            type="number"
                            value={formData.baseDeliveryFee}
                            onChange={(e) => handleInputChange('baseDeliveryFee', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                            placeholder="1000"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Starting fee for all deliveries
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Price per KM (₦)
                          </label>
                          <input
                            type="number"
                            value={formData.pricePerKm}
                            onChange={(e) => handleInputChange('pricePerKm', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
                            placeholder="100"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Additional cost per kilometer
                          </p>
                        </div>
                      </div>

                      {formData.baseDeliveryFee && formData.pricePerKm && (
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                          <p className="text-sm font-semibold text-gray-900 mb-2">
                            Pricing Example
                          </p>
                          <div className="space-y-1 text-sm text-gray-700">
                            <p>
                              5km delivery: ₦{parseInt(formData.baseDeliveryFee) + (5 * parseInt(formData.pricePerKm))}
                            </p>
                            <p>
                              10km delivery: ₦{parseInt(formData.baseDeliveryFee) + (10 * parseInt(formData.pricePerKm))}
                            </p>
                            <p>
                              20km delivery: ₦{parseInt(formData.baseDeliveryFee) + (20 * parseInt(formData.pricePerKm))}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[#3A0A21]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {saving ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </motion.button>
              </>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      formData.isAvailable
                        ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30'
                        : 'bg-gray-200'
                    }`}
                  >
                    {formData.isAvailable ? (
                      <Eye className="w-5 h-5 text-white" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Visibility</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {formData.isAvailable
                        ? 'Accepting new bookings'
                        : 'Hidden from customers'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl">
                  <span className="text-sm font-semibold text-gray-700">
                    {formData.isAvailable ? 'Online' : 'Offline'}
                  </span>
                  <Switch
                    checked={formData.isAvailable}
                    onChange={handleAvailabilityToggle}
                    className={`${
                      formData.isAvailable ? 'bg-green-500' : 'bg-gray-300'
                    } relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:ring-offset-2`}
                  >
                    <motion.span
                      layout
                      className={`${
                        formData.isAvailable ? 'translate-x-7' : 'translate-x-1'
                      } inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform`}
                    />
                  </Switch>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-6">Quick Stats</h3>

                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-100/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        {agencyData.rating || '4.5'}⭐
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Rating
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-100/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-bold text-purple-600">
                        {agencyData.verified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Verified Status
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">
                        {agencyData.totalDeliveries || '0'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Total Deliveries
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencySettingsPage;