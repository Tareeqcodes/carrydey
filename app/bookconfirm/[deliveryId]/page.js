'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBrandColors } from '@/hooks/BrandColors';
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
  const { brandColors } = useBrandColors();

  const [token, setToken] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPickupCode, setShowPickupCode] = useState(false);
  const [showDropoffOTP, setShowDropoffOTP] = useState(false);
  const [copied, setCopied] = useState({ type: '', active: false });
  const [trackingUrl, setTrackingUrl] = useState('');

  const isDelivered = delivery?.status === 'delivered';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        setToken(urlToken);
        const baseUrl = window.location.origin;
        setTrackingUrl(`${baseUrl}/bookconfirm/${deliveryId}?token=${urlToken}`);
      } else {
        setError('Invalid tracking link. Token missing.');
      }
    }
  }, [deliveryId]);

  useEffect(() => {
    if (deliveryId && token) fetchDeliveryStatus();
  }, [deliveryId, token]);

  const fetchDeliveryStatus = async () => {
    if (!token) { setError('Invalid tracking link. Token missing.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/${deliveryId}?token=${token}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch delivery');
      }
      setDelivery(await res.json());
    } catch (err) {
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
          text: `Track your delivery - ID: ${deliveryId?.slice(0, 8).toUpperCase()}`,
          url: trackingUrl,
        });
      } catch {}
    }
  };


  const BookingIdBadge = () => (
    <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Booking ID</span>
        <span className="font-mono font-semibold text-gray-900">
          #{deliveryId?.slice(0, 8).toUpperCase()}
        </span>
      </div>
    </div>
  );

  // Tracking link — always visible
  const TrackingLinkCard = () => (
    <div
      className="rounded-xl border p-4 mb-3"
      style={{ borderColor: `${brandColors.primary}30`, background: `${brandColors.primary}08` }}
    >
      <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
         Shared this with the Receiptent
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={trackingUrl}
          readOnly
          className="flex-1 text-xs bg-white px-3 py-2 rounded-lg border border-gray-200 text-gray-700 truncate"
        />
        <button
          onClick={() => copyToClipboard(trackingUrl, 'link')}
          className="p-2 rounded-lg text-white transition-all flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
        >
          {copied.type === 'link' && copied.active
            ? <Check className="w-4 h-4" />
            : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  const RefreshButton = () => (
    <button
      onClick={fetchDeliveryStatus}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-3 disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium text-gray-700">
        {loading ? 'Checking...' : 'Refresh status'}
      </span>
    </button>
  );

  const ShareButton = () => (
    <button
      onClick={shareTrackingLink}
      className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-3"
    >
      <Share2 className="w-4 h-4 text-gray-500" />
      <span className="text-sm font-medium text-gray-700">Share tracking link</span>
    </button>
  );

  // Done button — disabled until delivered
  const DoneButton = ({ label = 'Done' }) => (
    <button
      onClick={() => router.push('/')}
      disabled={!isDelivered}
      className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
      style={
        isDelivered
          ? {
              background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`,
              color: '#fff',
              opacity: 1,
            }
          : { background: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed' }
      }
    >
      {isDelivered ? label : 'Waiting for delivery…'}
    </button>
  );

  const ErrorBanner = () =>
    error ? (
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    ) : null;


  if (!token && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${brandColors.primary}40`, borderTopColor: brandColors.primary }}
        />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Tracking Link</h1>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 text-white rounded-xl font-medium transition-all"
            style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (!delivery || ['pending', 'accepted'].includes(delivery?.status)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          {/* Branded top bar */}
          <div
            className="h-1 rounded-full mb-6"
            style={{ background: `linear-gradient(90deg, ${brandColors.primary}, ${brandColors.accent}, ${brandColors.secondary})` }}
          />

          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: `${brandColors.primary}15` }}
          >
            <CheckCircle className="w-9 h-9" style={{ color: brandColors.primary }} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Delivery Booked</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Track your delivery progress below. No login required.
          </p>

          <BookingIdBadge />

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Finding a courier</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  An agency is reviewing your request. This usually takes a few minutes.
                </p>
              </div>
            </div>
          </div>

          <ErrorBanner />
          <TrackingLinkCard />
          <RefreshButton />
          <ShareButton />
          <DoneButton />

          <p className="text-xs text-gray-400 mt-4 text-center">
            💡 Save this link or screenshot this page for reference
          </p>
        </motion.div>
      </div>
    );
  }

  if (['assigned', 'picked_up', 'in_transit'].includes(delivery.status)) {
    const isPickedUp = ['picked_up', 'in_transit'].includes(delivery.status);

    const statusLabel = {
      assigned: 'Courier Assigned',
      picked_up: 'Package Picked Up',
      in_transit: 'In Transit',
    }[delivery.status];

    const statusDesc = {
      assigned: 'Your courier is on the way to the pickup location.',
      picked_up: 'Package is on its way to the recipient.',
      in_transit: 'Package is on its way to the recipient.',
    }[delivery.status];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          {/* Branded top bar */}
          <div
            className="h-1 rounded-full mb-6"
            style={{ background: `linear-gradient(90deg, ${brandColors.primary}, ${brandColors.accent}, ${brandColors.secondary})` }}
          />

          <div className="flex justify-center mb-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
            >
              <Truck className="w-4 h-4" />
              {statusLabel}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Delivery in Progress</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">{statusDesc}</p>

          <BookingIdBadge />

          {/* Pickup Code */}
          <div
            className="rounded-xl border p-4 mb-4"
            style={{ borderColor: `${brandColors.primary}30`, background: `${brandColors.primary}06` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" style={{ color: brandColors.primary }} />
                <span className="text-sm font-semibold text-gray-900">Pickup Code</span>
              </div>
              <button
                onClick={() => setShowPickupCode(!showPickupCode)}
                className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
              >
                {showPickupCode
                  ? <EyeOff className="w-4 h-4 text-gray-500" />
                  : <Eye className="w-4 h-4 text-gray-500" />}
              </button>
            </div>
            {showPickupCode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <span className="text-xl font-bold font-mono tracking-wider" style={{ color: brandColors.primary }}>
                    {delivery.pickupCode}
                  </span>
                  <button onClick={() => copyToClipboard(delivery.pickupCode, 'pickup')} className="p-2 hover:bg-gray-100 rounded-lg">
                    {copied.type === 'pickup' && copied.active
                      ? <Check className="w-4 h-4 text-green-600" />
                      : <Copy className="w-4 h-4 text-gray-500" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Share this code with the courier at pickup</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Tap the eye icon to reveal</p>
            )}
          </div>

          {/* Dropoff OTP */}
          {isPickedUp && (
            <div
              className="rounded-xl border p-4 mb-5"
              style={{ borderColor: `${brandColors.secondary}40`, background: `${brandColors.secondary}08` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: brandColors.secondary }} />
                  <span className="text-sm font-semibold text-gray-900">Delivery OTP</span>
                </div>
                <button
                  onClick={() => setShowDropoffOTP(!showDropoffOTP)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
                >
                  {showDropoffOTP
                    ? <EyeOff className="w-4 h-4 text-gray-500" />
                    : <Eye className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
              {showDropoffOTP ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                    <span className="text-xl font-bold font-mono tracking-wider" style={{ color: brandColors.secondary }}>
                      {delivery.dropoffOTP}
                    </span>
                    <button onClick={() => copyToClipboard(delivery.dropoffOTP, 'dropoff')} className="p-2 hover:bg-gray-100 rounded-lg">
                      {copied.type === 'dropoff' && copied.active
                        ? <Check className="w-4 h-4 text-green-600" />
                        : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Share this OTP with the recipient only</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Tap the eye icon to reveal</p>
              )}
            </div>
          )}

          {/* Courier Info */}
          {delivery.driverName && (
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Your Courier</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
                >
                  {delivery.driverName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{delivery.driverName}</p>
                  {delivery.driverPhone && (
                    <a
                      href={`tel:${delivery.driverPhone}`}
                      className="text-sm flex items-center gap-1 mt-0.5"
                      style={{ color: brandColors.primary }}
                    >
                      <Phone className="w-3 h-3" />
                      Call courier
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <ErrorBanner />
          <TrackingLinkCard />
          <RefreshButton />
          <ShareButton />
          <DoneButton />

          <p className="text-xs text-gray-400 mt-4 text-center">
            💡 Courier and recipient will confirm status updates
          </p>
        </motion.div>
      </div>
    );
  }

  
  if (delivery.status === 'delivered') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
        >
          {/* Branded top bar */}
          <div
            className="h-1 rounded-full mb-6"
            style={{ background: `linear-gradient(90deg, ${brandColors.primary}, ${brandColors.accent}, ${brandColors.secondary})` }}
          />

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivered! 🎉</h1>
          <p className="text-gray-500 mb-8">Your package has been successfully delivered.</p>

          <BookingIdBadge />
          <TrackingLinkCard />
          <ShareButton />

          {/* Done enabled on delivered */}
          <button
            onClick={() => router.push('/')}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all mt-1"
            style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})` }}
          >
            Book Another Delivery
          </button>

          <p className="text-xs text-gray-400 mt-4">Thank you for using our service</p>
        </motion.div>
      </div>
    );
  }

  return null;
}