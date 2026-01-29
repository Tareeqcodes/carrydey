'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import { Switch } from '@headlessui/react';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const usercll = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

const Profile = () => {
  const { user } = useAuth();
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { status, role, loading: roleLoading } = useUserRole();

  const [profileData, setProfileData] = useState({
    userName: '',
    phone: '',
    email: '',
    isAvailable: false,
  });

  // Check if user is a sender (hide availability for senders)
  const isSender = role === 'sender';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    if (!user || !user.email) {
      setLoading(false);
      return;
    }
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tablesDB.listRows({
        databaseId: db,
        tableId: usercll,
        queries: [Query.equal('userId', user.$id)],
      });
      
      if (response && response.rows && response.rows.length > 0) {
        const profileRow = response.rows[0];
        setDocId(profileRow.$id);
        setProfileData({
          userName: profileRow.userName || user.name || '',
          phone: profileRow.phone || '',
          email: profileRow.email || user.email || '',
          isAvailable: profileRow.isAvailable || false, 
        });
      } else {
        setProfileData({
          userName: user.name || '',
          phone: '',
          email: user.email || '',
          isAvailable: false,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle immediate availability toggle update
  const handleAvailabilityToggle = async (newValue) => {
    try {
      // Update local state immediately for responsive UI
      setProfileData((prev) => ({ ...prev, isAvailable: newValue }));

      // Update in database
      const payload = {
        userId: user.$id,
        userName: profileData.userName.trim(),
        phone: profileData.phone.trim(),
        email: profileData.email.trim(),
        isAvailable: newValue,
      };

      if (docId) {
        await tablesDB.updateRow({
          databaseId: db,
          tableId: usercll,
          rowId: docId,
          data: payload,
        });
      } else {
        const newDoc = await tablesDB.createRow({
          databaseId: db,
          tableId: usercll,
          rowId: ID.unique(),
          data: payload,
        });
        setDocId(newDoc.$id);
      }

      // Show success message
      setSuccessMessage(
        newValue
          ? 'You are now available for deliveries'
          : 'You are now unavailable for deliveries'
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating availability:', error);
      // Revert the toggle on error
      setProfileData((prev) => ({ ...prev, isAvailable: !newValue }));
      setError('Failed to update availability. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        userId: user.$id,
        userName: profileData.userName.trim(),
        phone: profileData.phone.trim(),
        email: profileData.email.trim(),
        isAvailable: profileData.isAvailable,
      };

      if (docId) {
        await tablesDB.updateRow({
          databaseId: db,
          tableId: usercll,
          rowId: docId,
          data: payload,
        });
      } else {
        const newDoc = await tablesDB.createRow({
          databaseId: db,
          tableId: usercll,
          rowId: ID.unique(),
          data: payload,
        });
        setDocId(newDoc.$id);
      }

      setEditMode(false);
      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-[#3A0A21] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Not Logged In
        </h2>
        <p className="text-gray-600 text-center">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#3A0A21] to-[#5A2A41] p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30 relative"
            >
              {profileData.userName
                ? profileData.userName.charAt(0).toUpperCase()
                : user.name?.charAt(0).toUpperCase() || 'U'}
              {!isSender && profileData.isAvailable && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">
                {profileData.userName || user.name || 'User'}
              </h1>
              <p className="text-white/80 text-xs md:text-md">{profileData.email}</p>
              {!isSender && profileData.isAvailable && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                  Available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3"
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
          className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Availability Toggle Section - Only show for non-senders */}
      {!isSender && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 border-b border-gray-100"
        >
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-[#3A0A21]" />
                  <span className="text-sm font-semibold text-gray-800">
                    Availability Status
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {profileData.isAvailable
                    ? 'Your profile is now visible to customers'
                    : 'Turn on to receive delivery requests'}
                </p>
              </div>
              <Switch
                checked={profileData.isAvailable}
                onChange={handleAvailabilityToggle}
                className={`${
                  profileData.isAvailable ? 'bg-green-600' : 'bg-gray-300'
                } relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    profileData.isAvailable ? 'translate-x-7' : 'translate-x-1'
                  } inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg`}
                />
              </Switch>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Profile Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-6"
      >
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-[#3A0A21]" />
              <span>NickName</span>
            </div>
          </label>
          <input
            type="text"
            value={profileData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            disabled={!editMode}
            className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#3A0A21]/30 ${
              editMode
                ? 'border-[#3A0A21]/30 bg-white'
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}
            placeholder="Enter your full name"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#3A0A21]" />
              <span>Email Address</span>
            </div>
          </label>
          <input
            type="email"
            value={profileData.email}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#3A0A21]" />
              <span>Phone Number</span>
            </div>
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!editMode}
            className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#3A0A21]/30 ${
              editMode
                ? 'border-[#3A0A21]/30 bg-white'
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}
            placeholder="+234 800 000 0000"
          />
        </motion.div>

        {/* Account Security Info */}
        <motion.div
          variants={itemVariants}
          className="pt-4 border-t border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="w-5 h-5  text-green-700" />
            <span className="text-sm font-semibold text-green-700">
              Account Security
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Your account is secured with email verification.
            
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex space-x-3">
          {editMode ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditMode(false);
                  fetchUserProfile();
                }}
                disabled={saving}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                disabled={saving || !profileData.userName.trim()}
                className="flex-1 py-3 px-4 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#4A1A31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {saving ? (
                    <motion.div
                      key="saving"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Saving...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="save"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEditMode(true)}
              className="w-full py-3 px-4 bg-white border border-[#3A0A21] text-[#3A0A21] rounded-lg font-medium hover:bg-[#3A0A21] hover:text-white transition-colors flex items-center justify-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;