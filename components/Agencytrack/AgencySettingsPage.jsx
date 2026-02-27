'use client';
import { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle,
  AlertCircle,
  X,
  Award,
  Shield,
  Eye,
  EyeOff,
  Package,
  Settings,
  Palette,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@headlessui/react';
import AgencySettingLoading from './AgencySettingLoading';
import { useAuth } from '@/hooks/Authcontext';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import GeneralSettings from './GeneralSettings';
import BrandingSettings from './BrandingSettings';
import OperationalSettings from './OperationalSettings';

const AgencySettingsPage = () => {
  const { user } = useAuth();
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
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
    minFare: '',
    fragilePremium: '',
    showPricing: true,
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

        let brandColors = {
          primary: '#3A0A21',
          secondary: '#5A1A41',
          accent: '#8B2E5A',
        };
        if (agency.brandColors) {
          try {
            brandColors = JSON.parse(agency.brandColors);
          } catch (e) {}
        }

        setFormData({
          name: agency.name || agency.contactPerson || '',
          phone: agency.phone || '',
          serviceCities: agency.serviceCities || '',
          isAvailable: agency.isAvailable || false,
          logoUrl: agency.logoUrl || '',
          brandColors,
          tagline: agency.tagline || '',
          operationalHours: agency.operationalHours || '',
          baseDeliveryFee: agency.baseDeliveryFee || '',
          pricePerKm: agency.pricePerKm || '',
          minFare: agency.minFare || '',
          fragilePremium: agency.fragilePremium || '',
          showPricing: agency.showPricing ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching agency data:', error);
      setError('Failed to load agency data');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  const handleAvailabilityToggle = async (newValue) => {
    try {
      setFormData((prev) => ({ ...prev, isAvailable: newValue }));
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data: { isAvailable: newValue },
      });
      setAgencyData((prev) => ({ ...prev, isAvailable: newValue }));
      showSuccess(
        newValue
          ? 'Your agency is now visible to our customers'
          : 'Your agency is now hidden from our customers'
      );
    } catch (error) {
      setFormData((prev) => ({ ...prev, isAvailable: !newValue }));
      showError('Failed to update availability');
    }
  };

  if (loading) return <AgencySettingLoading />;

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

  const TABS = [
    {
      key: 'general',
      label: 'General',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      key: 'branding',
      label: 'Branding',
      icon: <Palette className="w-4 h-4" />,
    },
    {
      key: 'operational',
      label: 'Operations',
      icon: <Briefcase className="w-4 h-4" />,
    },
  ];

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
            Manage your logistics operations center
          </h1>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'general' && (
              <GeneralSettings
                agencyData={agencyData}
                formData={formData}
                setFormData={setFormData}
                setAgencyData={setAgencyData}
                user={user}
                onSuccess={showSuccess}
                onError={showError}
              />
            )}
            {activeTab === 'branding' && (
              <BrandingSettings
                agencyData={agencyData}
                formData={formData}
                setFormData={setFormData}
                setAgencyData={setAgencyData}
                onSuccess={showSuccess}
                onError={showError}
              />
            )}
            {activeTab === 'operational' && (
              <OperationalSettings
                agencyData={agencyData}
                formData={formData}
                setFormData={setFormData}
                setAgencyData={setAgencyData}
                onSuccess={showSuccess}
                onError={showError}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
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
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Visibility
                    </h3>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      {formData.isAvailable
                        ? 'Accepting new bookings from us'
                        : 'Hidden from from our customers'}
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
            {/* <motion.div
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
            </motion.div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencySettingsPage;
