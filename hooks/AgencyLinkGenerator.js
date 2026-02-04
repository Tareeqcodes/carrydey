'use client';
import { useState } from 'react';
import { Copy, Check, Share2, ExternalLink, Sparkles, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgencyLinkGenerator({ agencyId }) {
  const [copied, setCopied] = useState(false);
  
  // Generate the booking link
  const bookingLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/AgencyBooking/${agencyId}`
    : `https://carrydey.tech/AgencyBooking/${agencyId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link');
    }
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Book a Delivery',
          text: 'Book your delivery with us!',
          url: bookingLink,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="relative">
      {/* Link Display Section */}
      <di v className="relative group"> 
        {/* Glow Effect on Hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
        
        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Your Link
              </span>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
          </div>
          
          {/* Link Text */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-sm font-mono text-white break-all leading-relaxed">
              {bookingLink}
            </p>
          </div>
        </div>
      </di>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Copy Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyLink}
          className="relative overflow-hidden group bg-white rounded-xl px-4 py-3.5 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Gradient on hover */}
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
                  <span className="text-sm font-semibold text-green-600">Copied!</span>
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

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShareLink}
          className="relative overflow-hidden group bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl px-4 py-3.5 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
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
        className="mt-4 relative overflow-hidden"
      >
        {/* Animated Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-2xl opacity-50" />
        <div className="absolute inset-[1px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl" />
        
        <div className="relative p-4 flex items-start gap-3">
          {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div> */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900 mb-1">
              Quick Tip
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Share on WhatsApp, Instagram, or your website. Customers book instantly!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}