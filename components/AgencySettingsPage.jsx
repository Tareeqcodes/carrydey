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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgencyLinkGenerator from '@/hooks/AgencyLinkGenerator';
import { useAuth } from '@/hooks/Authcontext';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import { Switch } from '@headlessui/react';

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
      // Update local state immediately
      setFormData((prev) => ({ ...prev, isAvailable: newValue }));

      // Update in database
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        rowId: agencyData.$id,
        data: {
          isAvailable: newValue,
        },
      });

      // Update local agency data
      setAgencyData((prev) => ({ ...prev, isAvailable: newValue }));

      setSuccessMessage(
        newValue
          ? 'Your agency is now visible to customers'
          : 'Your agency is now hidden from customers'
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating availability:', error);
      // Revert on error
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

      // Update local state
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A0A21]"></div>
      </div>
    );
  }

  if (!agencyData) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Agency Profile Not Found
        </h3>
        <p className="text-gray-600">
          Please complete your agency registration first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3"
        >
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-700 text-sm">{successMessage}</p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Booking Link Generator - Main Feature */}
      <div className="bg-gradient-to-br from-[#3A0A21] to-[#4A0A31] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Your Booking Link</h2>
            <p className="text-white/80 text-sm">
              Share this link with customers to receive bookings directly
            </p>
          </div>
        </div>

        <AgencyLinkGenerator agencyId={agencyData.$id} />
      </div>

      {/* Availability Toggle Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="w-5 h-5 text-[#3A0A21]" />
                <span className="text-sm font-semibold text-gray-800">
                  Agency Availability Status
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {formData.isAvailable
                  ? 'Your agency is visible to customers for booking'
                  : 'Turn on to make your agency visible to customers'}
              </p>
            </div>
            <Switch
              checked={formData.isAvailable}
              onChange={handleAvailabilityToggle}
              className={`${
                formData.isAvailable ? 'bg-green-600' : 'bg-gray-300'
              } relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:ring-offset-2`}
            >
              <span
                className={`${
                  formData.isAvailable ? 'translate-x-7' : 'translate-x-1'
                } inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg`}
              />
            </Switch>
          </div>
        </div>
      </div>

      {/* Agency Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">
              Agency Information
            </h3>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-[#3A0A21] text-[#3A0A21] rounded-lg hover:bg-[#3A0A21] hover:text-white transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Info
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Agency Name</p>
            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-[#3A0A21]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]/30"
                placeholder="Enter agency name"
              />
            ) : (
              <p className="font-medium text-gray-900">
                {agencyData.name || agencyData.contactPerson}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600">Contact Person</p>
            <p className="font-medium text-gray-900">
              {agencyData.contactPerson || 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">Phone</p>
            </div>
            {editMode ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-[#3A0A21]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]/30"
                placeholder="+234 800 000 0000"
              />
            ) : (
              <p className="font-medium text-gray-900">
                {agencyData.phone || 'N/A'}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">Email</p>
            </div>
            <p className="font-medium text-gray-900">
              {agencyData.email || 'N/A'}
            </p>
          </div>

         <div className="space-y-1">
  <div className="flex items-center gap-2">
    <MapPin className="w-4 h-4 text-gray-500" />
    <p className="text-sm text-gray-600">Service Cities</p>
  </div>
  {editMode ? (
    <input
      type="text"
      value={formData.serviceCities}
      onChange={(e) =>
        handleInputChange('serviceCities', e.target.value)
      }
      className="w-full px-3 py-2 border border-[#3A0A21]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A0A21]/30"
      placeholder="e.g., Lagos, Abuja, Kano"
    />
  ) : (
    <div>
      <p className="font-medium text-gray-900 mb-2">
        {agencyData.serviceCities || 'N/A'}
      </p>
      {/* Display as badges when not in edit mode */}
      {agencyData.serviceCities && (
        <div className="flex flex-wrap gap-2">
          {agencyData.serviceCities
            .split(',')
            .map((city) => city.trim())
            .filter((city) => city !== '')
            .map((city, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full font-medium"
              >
                {city}
              </span>
            ))}
        </div>
      )}
    </div>
  )}
</div>
        </div>

        {/* Save/Cancel Buttons */}
        {editMode && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
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
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={saving || !formData.name.trim()}
              className="flex-1 py-3 px-4 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#4A1A31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span className='text-xs'>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Stats</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {agencyData.totalDeliveries || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {agencyData.rating || '4.5'}⭐
            </p>
            <p className="text-sm text-gray-600 mt-1">Rating</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {agencyData.verified ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Verified</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-xl font-bold text-orange-600">
              {agencyData.type || 'Agency'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Type</p>
          </div>
        </div>
      </div>

      {/* Marketing Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          📱 Marketing Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Share your booking link on WhatsApp Business Status</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Add the link to your Instagram and Facebook bio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Include it in your email signature</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Print QR codes linking to your booking page</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Customers don't need to sign up - just click and book!</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AgencySettingsPage;
