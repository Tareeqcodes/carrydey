'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit3, Save, CheckCircle, User, Mail, Phone, Calendar } from 'lucide-react';
import { account, databases, ID, Query, storage } from '@/config/Appwriteconfig';
import { useAuth } from '@/context/Authcontext';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const usercll = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const profileBucket = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_BUCKET_ID;

const Profile = () => {
  const { user: authUser } = useAuth();
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: '',
    phone: '',
    email: '',
    avatar: ''
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    if (!authUser || !authUser.email) return;
    fetchUserProfile();
  }, [authUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(db, usercll, [
        Query.equal('userId', authUser.$id)
      ]);

      if (response.documents.length > 0) {
        const profileDoc = response.documents[0];
        setDocId(profileDoc.$id);
        setProfileData({
          userName: profileDoc.userName || authUser.name || '',
          phone: profileDoc.phone || '',
          email: profileDoc.email || authUser.email || '',
          avatar: profileDoc.avatar || ''
        });
      } else {
        setProfileData({
          userName: authUser.name || '',
          phone: '',
          email: authUser.email || '',
          avatar: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await storage.createFile(profileBucket, ID.unique(), file);
      const fileUrl = storage.getFileView(profileBucket, response.$id).href;

      setProfileData((prev) => ({ ...prev, avatar: fileUrl }));

      if (docId) {
        await databases.updateDocument(db, usercll, docId, { avatar: fileUrl });
      } else {
        const payload = {
          userId: authUser.$id,
          userName: profileData.userName,
          phone: profileData.phone,
          email: profileData.email,
          avatar: fileUrl
        };
        const newDoc = await databases.createDocument(db, usercll, ID.unique(), payload);
        setDocId(newDoc.$id);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const payload = {
        userId: authUser.$id,
        userName: profileData.userName,
        phone: profileData.phone,
        email: profileData.email,
        avatar: profileData.avatar,
        // updatedAt: new Date().toISOString()
      };

      if (docId) {
        await databases.updateDocument(db, usercll, docId, payload);
      } else {
        const newDoc = await databases.createDocument(db, usercll, ID.unique(), payload);
        setDocId(newDoc.$id);
      }

      if (profileData.userName !== authUser.name) {
        await account.updateName(profileData.userName);
      }

      setEditMode(false);
      alert('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!authUser) {
    return <div className="text-red-500">User not logged in</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-md mx-auto">
        <motion.div variants={itemVariants} className="bg-white p-4 m-2 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="relative mr-5">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden"
              >
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profileData.userName.charAt(0).toUpperCase()
                )}
              </motion.div>
              <motion.label
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              >
                <Camera size={14} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </motion.label>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">{profileData.userName}</h2>
              <p className="text-gray-600 text-sm mb-2 flex items-center">
                <Calendar size={14} className="mr-1" />
                Member since Dec 2023
              </p>
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle size={14} className="mr-1" />
                Verified Account
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={profileData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                disabled={!editMode}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  editMode
                    ? 'border-blue-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    : 'border-gray-200 bg-gray-50'
                } focus:outline-none`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone Number
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!editMode}
                className={`w-full px-4 py-3 border rounded-lg transition-all ${
                  editMode
                    ? 'border-blue-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    : 'border-gray-200 bg-gray-50'
                } focus:outline-none`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="p-4 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
            disabled={saving}
            className={`w-full py-4 rounded-xl font-medium transition-all ${
              editMode
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:opacity-50`}
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
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Saving...
                </motion.div>
              ) : (
                <motion.div
                  key="button-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  {editMode ? (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 size={18} className="mr-2" />
                      Edit Profile
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;