'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tablesDB, ID, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';

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

function consumePostOnboardingRoute(role) {
  const pendingRedirect = localStorage.getItem('postAuthRedirect');
  if (pendingRedirect) {
    localStorage.removeItem('postAuthRedirect');
    return pendingRedirect;
  }
  if (role === 'sender') return '/send';
  if (role === 'courier') return '/track';
  if (role === 'agency') return '/onboardagency';
  return '/';
}

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
        router.push(consumePostOnboardingRoute(response.rows[0].role));
      }
    } catch (err) {
      console.error('Failed to check onboarding status:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !role) return;
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
      router.push(consumePostOnboardingRoute(role));
    } catch (err) {
      console.error('Failed to save onboarding:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || checkingProfile || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-5 h-5 border-2 border-[#00C896] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6 py-16"
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
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-black/30 dark:text-white/30 mb-4">
            Welcome
          </p>
          <h1
            className="text-[2.2rem] font-normal leading-[1.15] text-black dark:text-white"
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
                    ? 'bg-[#00C896] border-[#00C896]'
                    : 'bg-white dark:bg-black border-black/10 dark:border-white/10 hover:border-[#00C896]/30'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-black/10' : 'bg-black/5 dark:bg-white/10'}`}
                >
                  <Icon
                    size={17}
                    className={
                      isActive
                        ? 'text-black'
                        : 'text-black/60 dark:text-white/60'
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold leading-tight ${isActive ? 'text-black' : 'text-black dark:text-white'}`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 leading-snug ${isActive ? 'text-black/60' : 'text-black/40 dark:text-white/40'}`}
                  >
                    {item.sub}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all duration-200 ${isActive ? 'border-black bg-black' : 'border-black/20 dark:border-white/20 bg-transparent'}`}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                        className="w-full h-full rounded-full bg-[#00C896]"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={isLoading || !role}
          whileTap={role ? { scale: 0.97 } : {}}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            !role
              ? 'bg-black/5 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed'
              : 'bg-[#00C896] text-black hover:bg-[#00E5AD]'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Continue {role && <ArrowRight size={15} />}</>
          )}
        </motion.button>

        <p className="text-center text-xs text-black/30 dark:text-white/30 mt-5 leading-relaxed">
          By continuing you agree to our{' '}
          <a href="/terms" className="text-[#00C896] hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-[#00C896] hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
}
