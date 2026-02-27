'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, Link2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tablesDB } from '@/lib/config/Appwriteconfig';
import { slugify } from '@/utils/slugify';

export default function AgencyLinkGenerator({ agencyId, agencyName }) {
  const [copied, setCopied] = useState(false);
  const [bookingLink, setBookingLink] = useState('');

  useEffect(() => {
    if (!agencyId) return;

    async function resolveLink() {
      try {
        // Fetch the agency to check if shortCode already exists
        const res = await tablesDB.getRow({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
          rowId: agencyId,
        });

        let shortCode = res.shortCode;

        // First time: generate and save shortCode from agency name
        if (!shortCode && agencyName) {
          shortCode = slugify(agencyName);
          await tablesDB.updateRow({
            databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            tableId:
              process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
            rowId: agencyId,
            data: { shortCode },
          });
        }

        // Fallback to agencyId if name not available yet
        const resolvedSlug = shortCode || agencyId;
        setBookingLink(`${window.location.origin}/b/${resolvedSlug}`);
      } catch (err) {
        // Fallback silently
        const fallbackSlug = agencyName ? slugify(agencyName) : agencyId;
        setBookingLink(`${window.location.origin}/b/${fallbackSlug}`);
      }
    }

    resolveLink();
  }, [agencyId, agencyName]);

  const handleCopyLink = async () => {
    if (!bookingLink) return;
    try {
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Failed to copy link');
    }
  };

  const handleShareLink = async () => {
    if (navigator.share && bookingLink) {
      try {
        await navigator.share({
          title: 'Book a Delivery',
          text: 'Book your delivery with us!',
          url: bookingLink,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="relative">
      {/* Link Preview */}
      {bookingLink && (
        <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Link2 className="w-7 h-7 text-white" />
            <p className="text-white/50 text-[10px] font-medium mb-1 uppercase tracking-wider">
              Your booking link
            </p>
          </div>
          <p className="text-white text-sm font-semibold truncate">
            {bookingLink}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyLink}
          disabled={!bookingLink}
          className="relative overflow-hidden group bg-white rounded-xl px-4 py-3.5 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center gap-2">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    Copied!
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 text-gray-700 group-hover:text-blue-600 transition-colors" />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    Copy
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShareLink}
          disabled={!bookingLink}
          className="relative overflow-hidden group bg-white/15 border border-white/30 rounded-xl px-4 py-3.5 shadow-lg hover:shadow-xl hover:bg-white/25 transition-all duration-300 disabled:opacity-50"
        >
          <div className="relative flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Share</span>
          </div>
        </motion.button>
      </div>

      {/* Info Tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm"
      >
        <p className="text-xs font-semibold text-white mb-1">Quick Tip</p>
        <p className="text-xs text-white/60 leading-relaxed">
          Share this link with your customers to allow them to easily book
        </p>
      </motion.div>
    </div>
  );
}
