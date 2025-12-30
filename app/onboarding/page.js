'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';

export default function Onboarding() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (loading) {
      setCheckingProfile(true);
      return;
    }

    if (!user) {
      setCheckingProfile(false);
      router.push('/login');
      return;
    }

    checkOnboardingStatus();
  }, [user, loading]);

  const checkOnboardingStatus = async () => {
    try {
      setCheckingProfile(true);
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        queries: [Query.equal('userId', user.$id)],
      });

      if (
        response.documents.length > 0 &&
        response.documents[0].onboardingCompleted
      ) {
        router.push('/send');
      }
    } catch (err) {
      console.error('Failed to check onboarding status:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleSubmit = async () => {
    // Add null check at the beginning of handleSubmit
    if (!user) {
      console.error('No user found');
      router.push('/login');
      return;
    }

    if (!userName.trim() || !role) return;

    try {
      setIsLoading(true);
      await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        rowId: ID.unique(),
        data: {
          userId: user.$id,
          userName: userName || user.email.split('@')[0],
          role,
          phone,
          onboardingCompleted: true,
        },
      });

      router.push('/send');
    } catch (err) {
      console.error('Failed to save onboarding:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the form if user is null
  if (loading || checkingProfile || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 min-h-screen bg-white p-6 flex flex-col justify-between">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-10"
      >
        <h1 className="text-2xl font-bold text-[#3A0A21]">
          Welcome to Carrydey 👋
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Let's quickly set up your profile
        </p>
      </motion.div>

      <div className="space-y-4 mt-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-[#3A0A21]">
            Your Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3A0A21] text-[15px] text-[#3A0A21] placeholder:text-gray-400"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-[#3A0A21]">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3A0A21] text-[15px] text-[#3A0A21] placeholder:text-gray-400"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="text-sm font-semibold text-[#3A0A21]">
            Choose Your Role
          </label>

          <div className="grid grid-cols-2 gap-4 mt-3 pb-8 pt-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('sender')}
              className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col items-center justify-center transition-all ${
                role === 'sender'
                  ? 'border-[#3A0A21] bg-[#3A0A21] shadow-lg'
                  : 'border-[#3A0A21] bg-white hover:bg-gray-50'
              }`}
            >
              <User
                size={26}
                className={
                  role === 'sender' ? 'text-white mb-2' : 'text-[#3A0A21] mb-2'
                }
              />
              <span
                className={`font-medium ${
                  role === 'sender' ? 'text-white' : 'text-[#3A0A21]'
                }`}
              >
                Sender
              </span>
              <p
                className={`text-xs text-center mt-1 leading-tight ${
                  role === 'sender' ? 'text-white/80' : 'text-gray-500'
                }`}
              >
                Send packages fast & cheap
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('traveler')}
              className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col items-center justify-center transition-all ${
                role === 'traveler'
                  ? 'border-[#3A0A21] bg-[#3A0A21] shadow-lg'
                  : 'border-[#3A0A21] bg-white hover:bg-gray-50'
              }`}
            >
              <Package
                size={26}
                className={
                  role === 'traveler'
                    ? 'text-white mb-2'
                    : 'text-[#3A0A21] mb-2'
                }
              />
              <span
                className={`font-medium ${
                  role === 'traveler' ? 'text-white' : 'text-[#3A0A21]'
                }`}
              >
                Traveler
              </span>
              <p
                className={`text-xs text-center mt-1 leading-tight ${
                  role === 'traveler' ? 'text-white/80' : 'text-gray-500'
                }`}
              >
                Earn money delivering items
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-6"
      >
        <motion.button
          whileHover={
            !isLoading && userName.trim() && role ? { scale: 1.02 } : {}
          }
          whileTap={
            !isLoading && userName.trim() && role ? { scale: 0.98 } : {}
          }
          onClick={handleSubmit}
          disabled={isLoading || !userName.trim() || !role}
          className={`w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
            ${
              !userName.trim() || !role
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#3A0A21] text-white hover:bg-[#4A1231] active:scale-95 shadow-lg'
            }`}
        >
          {isLoading ? 'Saving...' : 'Continue'}
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}