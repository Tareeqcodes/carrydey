'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Phone,
  Package,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Truck,
  MapPin,
  Clock,
  Share2,
} from 'lucide-react';

export default function GuestTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = params.deliveryId;

  const [token, setToken] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPickupCode, setShowPickupCode] = useState(false);
  const [showDropoffOTP, setShowDropoffOTP] = useState(false);
  const [copied, setCopied] = useState({ type: '', active: false });
  const [trackingUrl, setTrackingUrl] = useState('');
  const [showShareLink, setShowShareLink] = useState(false);

  // Extract token from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        setToken(urlToken);
        // Set tracking URL immediately
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/track/${deliveryId}?token=${urlToken}`;
        setTrackingUrl(url);
      } else {
        setError('Invalid tracking link. Token missing.');
      }
    }
  }, [deliveryId]);

  // Fetch delivery when both deliveryId and token are available
  useEffect(() => {
    if (deliveryId && token) {
      fetchDeliveryStatus();
    }
  }, [deliveryId, token]);

  const fetchDeliveryStatus = async () => {
    if (!token) {
      setError('Invalid tracking link. Token missing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/${deliveryId}?token=${token}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch delivery');
      }

      const data = await res.json();
      setDelivery(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to load delivery. Check your link and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ type, active: true });
    setTimeout(() => setCopied({ type: '', active: false }), 2000);
  };

  const shareTrackingLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Track Delivery',
          text: `Track your Carrydey delivery - ID: ${deliveryId?.slice(0, 8).toUpperCase()}`,
          url: trackingUrl,
        });
      } catch (err) {
        // User cancelled or share failed, show copy fallback
        setShowShareLink(true);
      }
    } else {
      // Web Share API not supported, show copy fallback
      setShowShareLink(true);
    }
  };

  // Show loading state while token is being extracted
  if (!token && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show error if token is missing
  if (!token && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-9 h-9 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Tracking Link
          </h1>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#2d0719] transition-colors"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // PENDING or ACCEPTED
  if (!delivery || ['pending', 'accepted'].includes(delivery?.status)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Delivery Booked
          </h1>

          <p className="text-sm text-gray-600 mb-6 text-center">
            Track your delivery progress below. No login required.
          </p>

          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono font-medium text-gray-900">
                #{deliveryId?.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Finding a courier</p>
                <p className="text-xs text-gray-600 mt-1">
                  An agency is reviewing your request. This usually takes a few minutes.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Share Link Section */}
          {showShareLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                📍 Share Tracking Link:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={trackingUrl}
                  readOnly
                  className="flex-1 text-xs bg-white px-3 py-2 rounded border border-gray-200 text-gray-700 truncate"
                />
                <button
                  onClick={() => copyToClipboard(trackingUrl, 'link')}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex-shrink-0"
                >
                  {copied.type === 'link' && copied.active ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={fetchDeliveryStatus}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-3 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">
              {loading ? 'Checking...' : 'Refresh status'}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={shareTrackingLink}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share Tracking Link</span>
          </button>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-6">
            <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-gray-600">Need help?</p>
              <p className="text-sm font-medium text-gray-900">
                The agency will contact you if needed
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#2d0719] transition-colors"
          >
            Done
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            💡 Save this link or screenshot this page for reference
          </p>
        </motion.div>
      </div>
    );
  }

  // ASSIGNED or PICKED_UP or IN_TRANSIT
  if (['assigned', 'picked_up', 'in_transit'].includes(delivery.status)) {
    const isPickedUp = ['picked_up', 'in_transit'].includes(delivery.status);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              <Truck className="w-4 h-4" />
              {delivery.status === 'assigned' && 'Courier Assigned'}
              {delivery.status === 'picked_up' && 'Package Picked Up'}
              {delivery.status === 'in_transit' && 'In Transit'}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Delivery in Progress
          </h1>

          <p className="text-sm text-gray-600 mb-6 text-center">
            {delivery.status === 'assigned' && 'Your courier is on the way to pickup location.'}
            {(delivery.status === 'picked_up' || delivery.status === 'in_transit') &&
              'Package is on its way to the recipient.'}
          </p>

          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono font-medium text-gray-900">
                #{deliveryId?.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
          

          {/* Pickup Code */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Pickup Code</span>
              </div>
              <button
                onClick={() => setShowPickupCode(!showPickupCode)}
                className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
              >
                {showPickupCode ? (
                  <EyeOff className="w-4 h-4 text-gray-600" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>

            {showPickupCode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                  <span className="text-xl font-bold font-mono text-[#3A0A21] tracking-wider">
                    {delivery.pickupCode}
                  </span>
                  <button
                    onClick={() => copyToClipboard(delivery.pickupCode, 'pickup')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copied.type === 'pickup' && copied.active ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-blue-700">
                  Share this code with the courier at pickup
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Tap the eye icon to reveal</p>
            )}
          </div>

          {/* Dropoff OTP */}
          {isPickedUp && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-900">Delivery OTP</span>
                </div>
                <button
                  onClick={() => setShowDropoffOTP(!showDropoffOTP)}
                  className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  {showDropoffOTP ? (
                    <EyeOff className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>

              {showDropoffOTP ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                    <span className="text-xl font-bold font-mono text-[#3A0A21] tracking-wider">
                      {delivery.dropoffOTP}
                    </span>
                    <button
                      onClick={() => copyToClipboard(delivery.dropoffOTP, 'dropoff')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copied.type === 'dropoff' && copied.active ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-purple-700">
                    Share this OTP with the recipient only
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Tap the eye icon to reveal</p>
              )}
            </div>
          )}

          {/* Courier Info */}
          {delivery.driverName && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-500 mb-3">Your Courier</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-full flex items-center justify-center text-white font-bold">
                  {delivery.driverName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{delivery.driverName}</p>
                  {delivery.driverPhone && (
                    <a
                      href={`tel:${delivery.driverPhone}`}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      Call courier
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={fetchDeliveryStatus}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">
              {loading ? 'Checking...' : 'Refresh status'}
            </span>
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#2d0719] transition-colors"
          >
            Done
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            💡 Courier and recipient will confirm status updates
          </p>
        </motion.div>
      </div>
    );
  }

  // DELIVERED
  if (delivery.status === 'delivered') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivered! 🎉</h1>

          <p className="text-gray-600 mb-8">
            Your package has been successfully delivered.
          </p>

          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono font-medium text-gray-900">
                #{deliveryId?.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#2d0719] transition-colors mb-4"
          >
            Book Another Delivery
          </button>

          <p className="text-xs text-gray-500">Thank you for using Carrydey</p>
        </motion.div>
      </div>
    );
  }

  return null;
}