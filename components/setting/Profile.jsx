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
} from 'lucide-react';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const usercll = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

const Profile = () => {
  const { user } = useAuth();
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const { status, role, loading: roleLoading } = useUserRole();

  const [profileData, setProfileData] = useState({
    userName: '',
    phone: '',
    email: '',
  });

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
        });
      } else {
        setProfileData({
          userName: user.name || '',
          phone: '',
          email: user.email || '',
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

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        userId: user.$id,
        userName: profileData.userName.trim(),
        phone: profileData.phone.trim(),
        email: profileData.email.trim(),
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
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
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
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30"
            >
              {profileData.userName
                ? profileData.userName.charAt(0).toUpperCase()
                : user.name?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">
                {profileData.userName || user.name || 'User'}
              </h1>
              <p className="text-white/80">{profileData.email}</p>
            </div>
          </div>
        </div>
      </div>

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
            <Shield className="w-4 h-4 text-[#3A0A21]" />
            <span className="text-sm font-medium text-gray-700">
              Account Security
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Your account is secured with email verification.
              {status === 'verified'
                ? ' ✓ Account verified'
                : ' ⏳ Verification pending'}
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
                  fetchUserProfile(); // Reset to original data
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
