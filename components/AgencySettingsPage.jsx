'use client';
import React, { useState, useEffect } from 'react';
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
  Sparkles,
  TrendingUp,
  Award,
  Shield,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@headlessui/react';
import AgencyLinkGenerator from '@/hooks/AgencyLinkGenerator';
import AgencySettingLoading from './Agencytrack/AgencySettingLoading';
import { useAuth } from '@/hooks/Authcontext';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

const AgencySettingsPage = () => {
  const { user } = useAuth();
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceCities: '',
    isAvailable: false,
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
        setFormData({
          name: agency.name || agency.contactPerson || '',
          phone: agency.phone || '',
          serviceCities: agency.serviceCities || '',
          isAvailable: agency.isAvailable || false,
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

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          serviceCities: formData.serviceCities.trim(),
          isAvailable: formData.isAvailable,
        },
      });

      setAgencyData((prev) => ({
        ...prev,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        serviceCities: formData.serviceCities.trim(),
        isAvailable: formData.isAvailable,
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
      <div className=" mx-auto px-4 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          
          <h2 className="text-gray-900 font-semibold text-xl ">
            Manage your agency settings
          </h2>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Link Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A0A21] via-[#4A1A31] to-[#2A0A21] rounded-3xl" />
           
              
              <div className="relative z-10 p-4 md:p-6">
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl"
                  >
                    <Link2 className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight">
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
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A0A21] to-[#5A1A41] flex items-center justify-center shadow-lg shadow-[#3A0A21]/20">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
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
                      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Name & Contact Grid */}
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
                        <p className="text-base sm:text-lg font-semibold text-gray-900 py-3">
                          {agencyData.name || agencyData.contactPerson}
                        </p>
                      )}
                    </div>

                    {/* Contact Person */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Contact Person
                      </label>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 py-3">
                        {agencyData.contactPerson || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Phone & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        <p className="text-base sm:text-lg font-semibold text-gray-900 py-3">
                          {agencyData.phone || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Mail className="w-3.5 h-3.5" />
                        Email Address
                      </label>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 py-3 truncate">
                        {agencyData.email || 'N/A'}
                      </p>
                    </div>
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

                {/* Edit Mode Actions */}
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
                          setFormData({
                            name: agencyData.name || agencyData.contactPerson || '',
                            phone: agencyData.phone || '',
                            serviceCities: agencyData.serviceCities || '',
                            isAvailable: agencyData.isAvailable || false,
                          });
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    formData.isAvailable
                      ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30'
                      : 'bg-gray-200'
                  }`}>
                    {formData.isAvailable ? (
                      <Eye className="w-5 h-5 text-white" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Visibility
                    </h3>
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
                <h3 className="text-base font-bold text-gray-900 mb-6">
                  Quick Stats
                </h3>

                <div className="space-y-4">
                  {/* <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">
                        {agencyData.totalDeliveries || 0}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Total Bookings
                    </p>
                  </motion.div> */}

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