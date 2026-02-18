'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  MapPin,
  CheckCircle,
  AlertCircle,
  Star,
  Phone,
  X,
  Truck,
  User,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const SenderTrackingView = ({ delivery, onClose, onUpdateDelivery }) => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [pickupCode, setPickupCode] = useState('');
  const [dropoffOTP, setDropoffOTP] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [courierRating, setCourierRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [copiedPickup, setCopiedPickup] = useState(false);
  const [copiedDropoff, setCopiedDropoff] = useState(false);

  useEffect(() => {
    setError('');
  }, [activeTab]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'pickup') {
      setCopiedPickup(true);
      setTimeout(() => setCopiedPickup(false), 2000);
    } else {
      setCopiedDropoff(true);
      setTimeout(() => setCopiedDropoff(false), 2000);
    }
  };

  const getStatusProgress = () => {
    const statuses = {
      pending: 0,
      accepted: 20,
      assigned: 40,
      picked_up: 60,
      in_transit: 80,
      delivered: 100,
    };
    return statuses[delivery?.status] || 0;
  };

  const handlePickupCodeSubmit = async () => {
    if (pickupCode.length !== 6) {
      setError('Please enter the complete 6-character pickup code');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (pickupCode.toUpperCase() === delivery?.pickupCode) {
        await onUpdateDelivery(delivery.$id, 'picked_up');
        setPickupCode('');
        setActiveTab('tracking');
      } else {
        setError('Invalid pickup code. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDropoffOTPSubmit = async () => {
    if (dropoffOTP.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (dropoffOTP === delivery?.dropoffOTP) {
        await onUpdateDelivery(delivery.$id, 'delivered');
        setDropoffOTP('');
        setShowRating(true);
      } else {
        setError('Invalid OTP code. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitRating = async () => {
    if (courierRating === 0) return;

    try {
      console.log('Rating submitted:', { courierRating, ratingComment });
      setShowRating(false);
      onClose();
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };

  const renderTracking = () => {
    const progress = getStatusProgress();
    const canPickup = delivery?.status === 'assigned' || delivery?.status === 'accepted';
    const canDropoff = delivery?.status === 'picked_up' || delivery?.status === 'in_transit';
    const isDelivered = delivery?.status === 'delivered';

    const timelineSteps = [
      { label: 'Order Placed', status: 'pending', icon: Package, progress: 0 },
      { label: 'Courier Assigned', status: 'assigned', icon: User, progress: 40 },
      { label: 'Picked Up', status: 'picked_up', icon: CheckCircle, progress: 60 },
      { label: 'In Transit', status: 'in_transit', icon: Truck, progress: 80 },
      { label: 'Delivered', status: 'delivered', icon: MapPin, progress: 100 },
    ];

    const currentStepIndex = timelineSteps.findIndex((step) => step.progress >= progress);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Status Banner */}
        <div className="bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-xs font-medium mb-1">Current Status</p>
              <p className="text-xl font-bold capitalize">
                {delivery?.status?.replace('_', ' ')}
              </p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              {isDelivered ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <Truck className="w-8 h-8" />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-white rounded-full shadow-lg"
              />
            </div>
            <p className="text-white/90 text-sm font-medium mt-2">{progress}% Complete</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Delivery Timeline</h3>
          <div className="space-y-6">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = progress >= step.progress;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="relative flex items-center gap-4">
                  {/* Connector Line */}
                  {index < timelineSteps.length - 1 && (
                    <div
                      className={`absolute left-6 top-12 w-0.5 h-6 ${
                        isActive ? 'bg-[#3A0A21]' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-xl border-2 transition-all ${
                      isActive
                        ? 'bg-[#3A0A21] border-[#3A0A21] text-white shadow-lg shadow-[#3A0A21]/30'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-[#3A0A21] font-medium mt-0.5">In Progress</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Route Details</h3>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <div>
                <MapPin className=" w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-900 mb-1">Pickup Location</p>
                <p className="text-sm text-blue-800">{delivery?.pickupAddress}</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div >
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-900 mb-1">Dropoff Location</p>
                <p className="text-sm text-emerald-800">{delivery?.dropoffAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {delivery?.driverName && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Assigned Courier</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {delivery.driverName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">{delivery.driverName}</p>
                {delivery.driverPhone && (
                  <a
                    href={`tel:${delivery.driverPhone}`}
                    className="inline-flex items-center gap-2 mt-2 text-sm text-[#3A0A21] font-medium hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {delivery.driverPhone}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {canPickup && (
          <button
            onClick={() => setActiveTab('pickup')}
            className="w-full py-4 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Confirm Pickup
          </button>
        )}

        {canDropoff && (
          <button
            onClick={() => setActiveTab('dropoff')}
            className="w-full py-4 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirm Delivery
          </button>
        )}

        {isDelivered && (
          <button
            onClick={() => setShowRating(true)}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Rate Courier
          </button>
        )}
      </motion.div>
    );
  };

  const renderPickupCode = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Instructions */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl border border-blue-200 p-6">
          <div className="flex gap-4">
            <div >
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-blue-900 mb-2">Pickup Confirmation</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Share this code with your courier at the pickup location to confirm they have
                received your package securely.
              </p>
            </div>
          </div>
        </div>

        {/* Pickup Code Display */}
        <div className="relative bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-3xl p-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-3">Your Pickup Code</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-4">
              <p className="text-3xl font-bold text-white tracking-wider font-mono">
                {delivery?.pickupCode || 'N/A'}
              </p>
            </div>
            <button
              onClick={() => handleCopy(delivery?.pickupCode, 'pickup')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-all"
            >
              {copiedPickup ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Verify Pickup Code
          </label>
          <input
            type="text"
            value={pickupCode}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (value.length <= 6) {
                setPickupCode(value);
                setError('');
              }
            }}
            placeholder="Enter code"
            maxLength={6}
            className={`w-full px-6 py-5 text-3xl font-bold tracking-widest text-center border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
              error
                ? 'border-red-300 focus:ring-red-100'
                : 'border-gray-300 focus:ring-[#3A0A21]/20 focus:border-[#3A0A21]'
            }`}
            disabled={isSubmitting}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handlePickupCodeSubmit}
          disabled={isSubmitting || pickupCode.length !== 6}
          className="w-full py-4 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Confirm Pickup
            </>
          )}
        </button>
      </motion.div>
    );
  };

  const renderDropoffOTP = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Instructions */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl border border-emerald-200 p-6">
          <div className="flex gap-4">
            <div >
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 mb-2">Delivery Confirmation</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Share this OTP with the recipient to confirm safe delivery of your package.
              </p>
            </div>
          </div>
        </div>

        {/* OTP Display */}
        <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-3">Delivery OTP</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-4">
              <p className="text-3xl font-bold text-white tracking-wider font-mono">
                {delivery?.dropoffOTP || 'N/A'}
              </p>
            </div>
            <button
              onClick={() => handleCopy(delivery?.dropoffOTP, 'dropoff')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-all"
            >
              {copiedDropoff ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy OTP
                </>
              )}
            </button>
          </div>
        </div>

        {/* Verification Input */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">Verify OTP</label>
          <input
            type="text"
            inputMode="numeric"
            value={dropoffOTP}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value.length <= 6) {
                setDropoffOTP(value);
                setError('');
              }
            }}
            placeholder="Enter OTP"
            maxLength={6}
            className={`w-full px-6 py-5 text-3xl font-bold tracking-widest text-center border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
              error
                ? 'border-red-300 focus:ring-red-100'
                : 'border-gray-300 focus:ring-emerald-100 focus:border-emerald-600'
            }`}
            disabled={isSubmitting}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleDropoffOTPSubmit}
          disabled={isSubmitting || dropoffOTP.length !== 6}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Complete Delivery
            </>
          )}
        </button>
      </motion.div>
    );
  };

  const renderDetails = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-3xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Delivery Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Package Size</span>
            <span className="font-bold text-gray-900">{delivery?.packageSize || 'Standard'}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Delivery Fee</span>
            <span className="font-bold text-gray-900">
              {formatNairaSimple(delivery?.offeredFare || delivery?.suggestedFare)}
            </span>
          </div>
          {delivery?.isFragile && (
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Special Handling</span>
              <span className="px-3 py-1 text-xs font-bold bg-orange-100 text-orange-700 rounded-lg border border-orange-200">
                Fragile Item
              </span>
            </div>
          )}
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600 font-medium">Order Date</span>
            <span className="font-bold text-gray-900">
              {new Date(delivery?.$createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Delivery Tracking</h2>
           
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex gap-2">
            {['tracking', 'details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'tracking' && renderTracking()}
            {activeTab === 'pickup' && renderPickupCode()}
            {activeTab === 'dropoff' && renderDropoffOTP()}
            {activeTab === 'details' && renderDetails()}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowRating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Experience</h3>
              <p className="text-gray-600 mb-8">
                How was your delivery with {delivery?.driverName}?
              </p>

              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCourierRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-14 h-14 ${
                        star <= courierRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Share your feedback (optional)"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl p-4 mb-6 resize-none focus:outline-none focus:border-[#3A0A21] focus:ring-4 focus:ring-[#3A0A21]/10"
                rows={3}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRating(false)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={courierRating === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SenderTrackingView;