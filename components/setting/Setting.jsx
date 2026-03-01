'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';

export default function Setting() {
  const { user, deleteAccount } = useAuth();

  const [step,    setStep]    = useState('idle'); // idle | confirm
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const name    = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = name[0].toUpperCase();
  const canDelete = input.toLowerCase() === 'delete my account';

  const handleDelete = async () => {
    if (!canDelete) return;
    setLoading(true);
    setError('');
    try {
      await deleteAccount();
      // redirect happens inside deleteAccount — nothing needed here
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-bold text-[#1a1a1a]">Account Settings</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Manage your Carrydey account</p>
      </div>

      {/* Profile summary — read only */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#3A0A21] rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xl">{initial}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-[#1a1a1a] truncate">{name}</p>
          <p className="text-[12px] text-gray-400 truncate">{user?.email}</p>
          <p className="text-[11px] text-gray-300 mt-0.5">To update your info, contact support</p>
        </div>
      </div>

      {/* Delete account */}
      <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-red-50">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trash2 size={15} className="text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-[13.5px] font-bold text-red-500">Delete Account</p>
            <p className="text-[11px] text-gray-400">Permanent and cannot be undone</p>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          <p className="text-[12.5px] text-gray-500 leading-relaxed">
            Deleting your account will permanently remove all your data — deliveries, history, payment info, and profile. You will not be able to recover it.
          </p>

          <AnimatePresence mode="wait">

            {/* Step 1 — idle */}
            {step === 'idle' && (
              <motion.button
                key="idle"
                exit={{ opacity: 0, y: -4 }}
                onClick={() => setStep('confirm')}
                className="text-[12px] font-semibold text-red-400 underline underline-offset-2"
              >
                I understand, delete my account
              </motion.button>
            )}

            {/* Step 2 — confirm + type */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex gap-2.5 bg-red-50 rounded-xl p-3">
                  <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-red-500 leading-relaxed">
                    Type <span className="font-bold">delete my account</span> below to confirm.
                  </p>
                </div>

                <input
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(''); }}
                  placeholder="delete my account"
                  autoFocus
                  disabled={loading}
                  className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-[#1a1a1a] placeholder-red-200 focus:outline-none focus:border-red-400 transition-colors disabled:opacity-50"
                />

                {/* API error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[12px] text-red-500 flex items-center gap-1.5"
                    >
                      <AlertTriangle size={12} /> {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setStep('idle'); setInput(''); setError(''); }}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <motion.button
                    onClick={handleDelete}
                    disabled={!canDelete || loading}
                    whileTap={canDelete && !loading ? { scale: 0.97 } : {}}
                    className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-2
                      ${canDelete && !loading
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-300 cursor-not-allowed'
                      }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      'Delete Forever'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}