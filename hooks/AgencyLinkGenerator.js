'use client';
import { useState } from 'react';
import { Copy, Check, Share2, ExternalLink } from 'lucide-react';

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
      setTimeout(() => setCopied(false), 2000);
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#3A0A21] rounded-lg flex items-center justify-center">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Your Booking Link</h3>
          <p className="text-sm text-gray-600">Share with your customers</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink className="w-4 h-4 text-gray-500" />
          <p className="text-xs font-medium text-gray-600">BOOKING LINK</p>
        </div>
        <p className="text-sm font-mono text-gray-900 break-all">
          {bookingLink}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Copy Link</span>
            </>
          )}
        </button>

        <button
          onClick={handleShareLink}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#3A0A21] text-white rounded-lg hover:bg-[#4A0A31] transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Share this link on WhatsApp, social media, or your website. 
          Customers can book directly without signing up!
        </p>
      </div>
    </div>
  );
}