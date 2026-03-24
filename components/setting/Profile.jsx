'use client';
import { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
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
import ProfileSkeleton from '@/ui/ProfileSkeleton';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const usercll = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Field row ── */
const Field = ({
  icon: Icon,
  label,
  value,
  placeholder,
  type,
  editable,
  onChange,
  hint,
  isLast,
}) => (
  <motion.div
    layout
    className={`group relative flex items-start gap-4 py-5 ${!isLast ? 'border-b' : ''}`}
    style={{ borderColor: 'rgba(58,10,33,0.07)' }}
  >
    <div
      className="mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
      style={{
        background: 'rgba(255,107,53,0.08)',
        border: '1px solid rgba(255,107,53,0.15)',
      }}
    >
      <Icon className="w-4 h-4" style={{ color: '#FF6B35' }} />
    </div>
    <div className="flex-1 min-w-0">
      <p
        className="text-[10px] font-semibold uppercase tracking-widest mb-1"
        style={{ color: 'rgba(58,10,33,0.35)' }}
      >
        {label}
      </p>
      {editable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium focus:outline-none"
          style={{ color: '#3A0A21', caretColor: '#FF6B35' }}
        />
      ) : (
        <p
          className="text-sm font-medium truncate"
          style={{ color: hint ? 'rgba(58,10,33,0.3)' : '#3A0A21' }}
        >
          {value || placeholder || '—'}
        </p>
      )}
      {hint && (
        <p
          className="text-[10px] mt-0.5"
          style={{ color: 'rgba(58,10,33,0.25)' }}
        >
          {hint}
        </p>
      )}
    </div>
    
  </motion.div>
);

const Profile = () => {
  const { user } = useAuth();
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { role, loading: roleLoading } = useUserRole();

  const [profileData, setProfileData] = useState({
    userName: '',
    phone: '',
    email: '',
    isAvailable: false,
  });

  const isSender = role === 'sender';
  const initials = (profileData.userName || user?.name || 'U')
    .charAt(0)
    .toUpperCase();

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
      if (response?.rows?.length > 0) {
        const r = response.rows[0];
        setDocId(r.$id);
        setProfileData({
          userName: r.userName || user.name || '',
          phone: r.phone || '',
          email: r.email || user.email || '',
          isAvailable: r.isAvailable || false,
        });
      } else {
        setProfileData({
          userName: user.name || '',
          phone: '',
          email: user.email || '',
          isAvailable: false,
        });
      }
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const persistPayload = async (payload) => {
    if (docId) {
      await tablesDB.updateRow({
        databaseId: db,
        tableId: usercll,
        rowId: docId,
        data: payload,
      });
    } else {
      const d = await tablesDB.createRow({
        databaseId: db,
        tableId: usercll,
        rowId: ID.unique(),
        data: payload,
      });
      setDocId(d.$id);
    }
  };

  const handleInputChange = (field, value) =>
    setProfileData((p) => ({ ...p, [field]: value }));

  const handleAvailabilityToggle = async (v) => {
    try {
      setProfileData((p) => ({ ...p, isAvailable: v }));
      await persistPayload({
        userId: user.$id,
        userName: profileData.userName.trim(),
        phone: profileData.phone.trim(),
        email: profileData.email.trim(),
        isAvailable: v,
      });
      setSuccessMessage(
        v
          ? 'You are now available for deliveries'
          : 'You are now unavailable for deliveries'
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setProfileData((p) => ({ ...p, isAvailable: !v }));
      setError('Failed to update availability. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      await persistPayload({
        userId: user.$id,
        userName: profileData.userName.trim(),
        phone: profileData.phone.trim(),
        email: profileData.email.trim(),
        isAvailable: profileData.isAvailable,
      });
      setEditMode(false);
      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError('Failed to save profile. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  /* ── Skeleton ── */
  if (loading) return <ProfileSkeleton />;

  /* ── No user ── */
  if (!user)
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-24">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-sm text-gray-400">
          Please log in to view your profile
        </p>
      </div>
    );

  return (
    <div className="w-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Ambient blobs — subtle on white */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #3A0A21 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-1/2 -right-20 w-64 h-64 rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {(successMessage || error) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium shadow-lg"
            style={{
              background: successMessage
                ? 'rgba(16,185,129,0.1)'
                : 'rgba(239,68,68,0.08)',
              border: `1px solid ${successMessage ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`,
              backdropFilter: 'blur(16px)',
              color: successMessage ? '#059669' : '#dc2626',
            }}
          >
            {successMessage ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {successMessage || error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-col layout */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row">
        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:w-2/5 xl:w-1/3 flex flex-col justify-between p-8 lg:p-12"
          style={{ borderRight: '1px solid rgba(58,10,33,0.07)' }}
        >
          {/* Avatar + identity */}
          <div className="flex flex-col items-start gap-7 py-6 lg:py-0 lg:mt-8">
            <TiltCard className="cursor-default">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.15,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                {/* Glow ring */}
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -inset-4 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
                  }}
                />
                {/* Avatar */}
                <div
                  className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-3xl flex items-center justify-center text-4xl lg:text-5xl font-bold text-white select-none"
                  style={{
                    background:
                      'linear-gradient(135deg, #3A0A21 0%, #5A1A35 60%, #3A0A21 100%)',
                    boxShadow:
                      '0 20px 60px rgba(58,10,33,0.25), 0 0 0 1px rgba(255,107,53,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                    fontFamily: "'Fraunces', serif",
                  }}
                >
                  {initials}
                  {!isSender && profileData.isAvailable && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                      style={{
                        background: '#10b981',
                        boxShadow: '0 0 12px rgba(16,185,129,0.5)',
                      }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </TiltCard>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
            >
              <h1
                className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-1.5"
                style={{
                  color: '#3A0A21',
                  fontFamily: "'Fraunces', serif",
                  fontStyle: 'italic',
                }}
              >
                {profileData.userName || user.name || 'Your Name'}
              </h1>
              <p
                className="text-sm mb-4"
                style={{ color: 'rgba(58,10,33,0.4)' }}
              >
                {profileData.email}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
                  style={{
                    background: 'rgba(255,107,53,0.08)',
                    border: '1px solid rgba(255,107,53,0.2)',
                    color: '#FF6B35',
                  }}
                >
                  {role || 'User'}
                </span>
                {!isSender && (
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5"
                    style={{
                      background: profileData.isAvailable
                        ? 'rgba(16,185,129,0.08)'
                        : 'rgba(58,10,33,0.04)',
                      border: `1px solid ${profileData.isAvailable ? 'rgba(16,185,129,0.25)' : 'rgba(58,10,33,0.1)'}`,
                      color: profileData.isAvailable
                        ? '#059669'
                        : 'rgba(58,10,33,0.35)',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{
                        background: profileData.isAvailable
                          ? '#10b981'
                          : 'rgba(58,10,33,0.2)',
                      }}
                    />
                    {profileData.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Security badge — desktop only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="hidden lg:flex items-center gap-3 mt-12"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.18)',
              }}
            >
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600">
                Verified Account
              </p>
              <p
                className="text-[10px]"
                style={{ color: 'rgba(58,10,33,0.3)' }}
              >
                Email authentication active
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-12 xl:p-16"
        >
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 lg:mb-10"
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: 'rgba(255,107,53,0.7)' }}
            >
              Account Settings
            </p>
            <h2
              className="text-xl lg:text-2xl font-bold"
              style={{ color: '#3A0A21' }}
            >
              {editMode ? 'Edit your details' : 'Personal Information'}
            </h2>
          </motion.div>

          {/* Fields card */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-3xl p-6 lg:p-8 mb-5"
            style={{
              background: 'rgba(58,10,33,0.02)',
              border: '1px solid rgba(58,10,33,0.07)',
              boxShadow:
                '0 4px 24px rgba(58,10,33,0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          >
            <Field
              icon={User}
              label="Nickname"
              value={profileData.userName}
              placeholder="Enter your name"
              type="text"
              editable={editMode}
              onChange={(v) => handleInputChange('userName', v)}
            />
            <Field
              icon={Mail}
              label="Email Address"
              value={profileData.email}
              type="email"
              editable={false}
              hint="Cannot be changed"
            />
            <Field
              icon={Phone}
              label="Phone Number"
              value={profileData.phone}
              placeholder="+234 800 000 0000"
              type="tel"
              editable={editMode}
              onChange={(v) => handleInputChange('phone', v)}
              isLast
            />
          </motion.div>

          {/* Availability toggle — couriers only */}
          {!isSender && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="rounded-3xl px-6 py-5 mb-5 flex items-center justify-between"
              style={{
                background: profileData.isAvailable
                  ? 'rgba(16,185,129,0.05)'
                  : 'rgba(58,10,33,0.02)',
                border: `1px solid ${profileData.isAvailable ? 'rgba(16,185,129,0.18)' : 'rgba(58,10,33,0.07)'}`,
                boxShadow: profileData.isAvailable
                  ? '0 4px 20px rgba(16,185,129,0.08)'
                  : '0 4px 20px rgba(58,10,33,0.04)',
                transition: 'all 0.4s ease',
              }}
            >
              <div>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: '#3A0A21' }}
                >
                  Availability
                </p>
                <p className="text-xs" style={{ color: 'rgba(58,10,33,0.4)' }}>
                  {profileData.isAvailable
                    ? 'Visible to customers'
                    : 'Turn on to receive delivery requests'}
                </p>
              </div>
              <Switch
                checked={profileData.isAvailable}
                onChange={handleAvailabilityToggle}
                className="relative inline-flex h-7 w-14 items-center rounded-full transition-all focus:outline-none shrink-0"
                style={{
                  background: profileData.isAvailable
                    ? '#3A0A21'
                    : 'rgba(58,10,33,0.12)',
                  boxShadow: profileData.isAvailable
                    ? '0 0 16px rgba(58,10,33,0.25)'
                    : 'none',
                }}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="inline-block h-5 w-5 transform rounded-full bg-white shadow"
                  style={{
                    marginLeft: profileData.isAvailable ? '34px' : '4px',
                  }}
                />
              </Switch>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {editMode ? (
                <motion.div
                  key="edit-mode"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex gap-3"
                >
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setEditMode(false);
                      fetchUserProfile();
                    }}
                    disabled={saving}
                    className="flex-1 py-4 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40"
                    style={{
                      background: 'rgba(58,10,33,0.04)',
                      border: '1px solid rgba(58,10,33,0.1)',
                      color: 'rgba(58,10,33,0.6)',
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveProfile}
                    disabled={saving || !profileData.userName.trim()}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #3A0A21, #FF6B35)',
                      boxShadow: '0 10px 36px rgba(255,107,53,0.3)',
                    }}
                  >
                    {/* Shimmer sweep */}
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatDelay: 1.2,
                      }}
                      className="absolute inset-0 -skew-x-12"
                      
                    />
                    {saving ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key="view-mode"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditMode(true)}
                  className="w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: 'rgba(58,10,33,0.03)',
                    border: '1px solid rgba(58,10,33,0.12)',
                    color: '#3A0A21',
                    boxShadow: '0 2px 12px rgba(58,10,33,0.06)',
                  }}
                  
                >
                  <Edit3 className="w-4 h-4" style={{ color: '#FF6B35' }} />
                  Edit Profile
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile-only security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:hidden flex items-center gap-3 mt-8 pt-6"
            style={{ borderTop: '1px solid rgba(58,10,33,0.06)' }}
          >
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <p className="text-xs" style={{ color: 'rgba(58,10,33,0.3)' }}>
              Account secured with email verification
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
