'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';

export default function Setting() {
  const { user } = useAuth();
  const [step, setStep]         = useState('idle'); // idle | confirm | typing
  const [input, setInput]       = useState('');

  const name    = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = name[0].toUpperCase();
  const canDelete = input.toLowerCase() === 'delete my account';

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

        {/* Header row */}
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

            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Warning box */}
                <div className="flex gap-2.5 bg-red-50 rounded-xl p-3">
                  <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-red-500 leading-relaxed">
                    Type <span className="font-bold">delete my account</span> below to confirm.
                  </p>
                </div>

                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="delete my account"
                  autoFocus
                  className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-[#1a1a1a] placeholder-red-200 focus:outline-none focus:border-red-400 transition-colors"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => { setStep('idle'); setInput(''); }}
                    className="flex-1 py-3.5 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-500"
                  >
                    Cancel
                  </button>
                  <motion.button
                    disabled={!canDelete}
                    whileTap={canDelete ? { scale: 0.97 } : {}}
                    className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-200
                      ${canDelete
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-300 cursor-not-allowed'
                      }`}
                  >
                    Delete Forever
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