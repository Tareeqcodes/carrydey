'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
// import { WalletService } from '@/lib/WalletService';

const roles = [
  {
    id: 'sender',
    title: 'Sender',
    sub: 'Book deliveries & track packages',
    icon: User,
  },
  {
    id: 'courier',
    title: 'Independent Courier',
    sub: 'Receive jobs & earn money',
    icon: User,
  },
  {
    id: 'agency',
    title: 'Agency',
    sub: 'Manage couriers & operations',
    icon: User,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [role, setRole] = useState('');
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
      if (response.rows.length > 0 && response.rows[0].onboardingCompleted) {
        handleRoleBasedRedirect(response.rows[0].role);
      }
    } catch (err) {
      console.error('Failed to check onboarding status:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleRoleBasedRedirect = (userRole) => {
    const routes = { sender: '/send', courier: '/track', agency: '/track' };
    router.push(routes[userRole] || '/');
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
          isAvailable: true,
        },
      });
      // const walletResult = await WalletService.createWallet(
      //   user.$id,
      //   user.email,
      //   user.email.split('@')[0]
      // );
      // if (!walletResult.success)
      //   console.error('Wallet creation failed:', walletResult.error);

      if (role === 'sender') router.push('/send');
      else if (role === 'courier') router.push('/track');
      else if (role === 'agency') router.push('/onboardagency');
      else router.push('/');
    } catch (err) {
      console.error('Failed to save onboarding:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || checkingProfile || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#faf9f7]">
        <div className="w-5 h-5 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6 py-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#bbb] mb-4">
            Welcome
          </p>
          <h1
            className="text-[2.2rem] font-normal leading-[1.15] text-[#1a1a1a]"
            style={{
              fontFamily: "'DM Serif Display', serif",
              letterSpacing: '-0.02em',
            }}
          >
            How will you
            <br />
            <em>use Carrydey?</em>
          </h1>
        </div>

        {/* Role cards */}
        <div className="space-y-2.5 mb-10">
          {roles.map((item, i) => {
            const Icon = item.icon;
            const isActive = role === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + i * 0.07,
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                whileTap={{ scale: 0.985 }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-[#3A0A21] border-[#3A0A21]'
                    : 'bg-white border-[#e8e2e5] hover:border-[#3A0A21]/30'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-white/15' : 'bg-[#3A0A21]/7'
                  }`}
                >
                  <Icon
                    size={17}
                    className={isActive ? 'text-white' : 'text-[#3A0A21]'}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold leading-tight ${isActive ? 'text-white' : 'text-[#1a1a1a]'}`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 leading-snug ${isActive ? 'text-white/60' : 'text-[#aaa]'}`}
                  >
                    {item.sub}
                  </p>
                </div>

                {/* Selection indicator */}
                <div
                  className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'border-white bg-white'
                      : 'border-[#ddd] bg-transparent'
                  }`}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                        className="w-full h-full rounded-full bg-[#3A0A21]"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleSubmit}
          disabled={isLoading || !role}
          whileTap={role ? { scale: 0.97 } : {}}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            !role
              ? 'bg-[#f0ecee] text-[#ccc] cursor-not-allowed'
              : 'bg-[#3A0A21] text-white hover:bg-[#521229]'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Continue
              {role && <ArrowRight size={15} />}
            </>
          )}
        </motion.button>

        {/* Terms note */}
        <p className="text-center text-xs text-[#bbb] mt-5 leading-relaxed">
          By continuing you agree to our{' '}
          <a href="/terms" className="text-[#3A0A21] hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-[#3A0A21] hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
}
