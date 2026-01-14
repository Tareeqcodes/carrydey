'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { WalletService } from '@/lib/WalletService';

export default function Onboarding() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const roles = [
    {
      id: 'sender',
      title: 'Sender',
      description: 'Send packages & items',
      icon: User,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      activeColor: 'bg-blue-600 border-blue-600 text-white',
    },
    {
      id: 'courier',
      title: 'Independent Courier',
      description: 'Deliver & earn money',
      icon: Package,
      color: 'bg-green-50 border-green-200 text-green-700',
      activeColor: 'bg-green-600 border-green-600 text-white',
    },
    {
      id: 'agency',
      title: 'Agency',
      description: 'Manage couriers & logistics',
      icon: Building,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      activeColor: 'bg-purple-600 border-purple-600 text-white',
    },
  ];

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

      if (response.rows.length > 0 && response.rows[0].onboardingCompleted) {
        // If already onboarded, redirect based on role
        const userRole = response.rows[0].role;
        handleRoleBasedRedirect(userRole);
      }
    } catch (err) {
      console.error('Failed to check onboarding status:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleRoleBasedRedirect = (userRole) => {
    switch (userRole) {
      case 'sender':
        router.push('/send');
        break;
      case 'courier':
      case 'agency':
        router.push('/onboardagency');
        break;
      default:
        router.push('/');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!role) return;

    try {
      setIsLoading(true);
      
      await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        rowId: ID.unique(),
        data: {
          userId: user.$id,
          userName: user.email.split('@')[0], 
          role,
          phone: null,
          onboardingCompleted: true,
        },
      });

      // Create wallet for user
      const walletResult = await WalletService.createWallet(
        user.$id,
        user.email,
        user.email.split('@')[0] 
      );

      if (!walletResult.success) {
        console.error('Wallet creation failed:', walletResult.error);
      }

      if (role === 'sender') {
        router.push('/send');
      } else if (role === 'courier' || role === 'agency') {
        router.push('/onboardagency');
      } else {
        router.push('/');
      }
      
    } catch (err) {
      console.error('Failed to save onboarding:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || checkingProfile || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 pt-5 md:py-20">
      <div className="max-w-md mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-[#3A0A21]">
            Welcome to Carrydey 🖐️
          </h1>
          <p className="text-gray-600 text-sm font-semibold mt-1">
            Let's set up your account
          </p>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            What describes you best?
          </label>
          <div className="space-y-3">
            {roles.map((item) => {
              const Icon = item.icon;
              const isActive = role === item.id;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    isActive
                      ? item.activeColor
                      : `${item.color} hover:opacity-90`
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-white/20' : 'bg-white'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div
                      className={`text-xs ${
                        isActive ? 'text-white/90' : 'opacity-70'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-current"></div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
          
        
        </div>

        <div className="mt-12 pt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading || !role}
            className={`w-full py-3.5 rounded-lg font-medium transition-colors ${
              !role
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#3A0A21] text-white hover:bg-[#4A0A31]'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Setting up...
              </span>
            ) : (
              `Continue as ${role === 'sender' ? 'Sender' : role === 'courier' ? 'Independent Courier' : 'Agency'}`
            )}
          </motion.button>

          <button
            onClick={() => router.push('/')}
            className="w-full mt-3 py-3 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}