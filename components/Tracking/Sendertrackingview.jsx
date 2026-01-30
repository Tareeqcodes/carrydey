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
  ChevronRight,
  TrendingUp,
  X,
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

  // Reset codes when switching tabs
  useEffect(() => {
    setError('');
  }, [activeTab]);

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

  const getStatusColor = () => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50',
      accepted: 'text-blue-600 bg-blue-50',
      assigned: 'text-indigo-600 bg-indigo-50',
      picked_up: 'text-purple-600 bg-purple-50',
      in_transit: 'text-orange-600 bg-orange-50',
      delivered: 'text-green-600 bg-green-50',
    };
    return colors[delivery?.status] || 'text-gray-600 bg-gray-50';
  };

  const handlePickupCodeSubmit = async () => {
    if (pickupCode.length !== 6) {
      setError('Please enter the complete 6-character pickup code');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Verify pickup code matches
      if (pickupCode.toUpperCase() === delivery?.pickupCode) {
        // Update delivery status to picked_up
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
      // Verify OTP matches
      if (dropoffOTP === delivery?.dropoffOTP) {
        // Update delivery status to delivered
        await onUpdateDelivery(delivery.$id, 'delivered');
        setDropoffOTP('');
        // Show rating modal
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
    if (courierRating === 0) {
      return;
    }

    try {
      // Submit rating to backend
      // await submitCourierRating(delivery.driverId, courierRating, ratingComment);
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
    const canDropoff =
      delivery?.status === 'picked_up' || delivery?.status === 'in_transit';
    const isDelivered = delivery?.status === 'delivered';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Status Header */}
        <div className="text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}
          >
            {isDelivered ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            {delivery?.status?.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            {progress}% Complete
          </p>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Journey</h3>
          <div className="space-y-4">
            {/* Pickup */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 40
                      ? 'bg-[#3A0A21] text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Pickup</p>
                <p className="text-sm text-gray-500">{delivery?.pickupAddress}</p>
                {/* {delivery?.pickupContactName && (
                  <p className="text-xs text-gray-400 mt-1">
                    {delivery.pickupContactName}
                  </p>
                )} */}
              </div>
            </div>

            {/* Connecting Line */}
            <div className="ml-4 h-8 w-0.5 bg-gray-200"></div>

            {/* Dropoff */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 100
                      ? 'bg-[#3A0A21] text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Dropoff</p>
                <p className="text-sm text-gray-500">{delivery?.dropoffAddress}</p>
                {/* {delivery?.dropoffContactName && (
                  <p className="text-xs text-gray-400 mt-1">
                    {delivery.dropoffContactName}
                  </p>
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/* Courier Info */}
        {delivery?.driverName && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Courier</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-full flex items-center justify-center text-white text-lg font-bold">
                {delivery.driverName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{delivery.driverName}</p>
                {delivery.driverPhone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {delivery.driverPhone}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {canPickup && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('pickup')}
            className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Confirm Pickup
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}

        {canDropoff && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('dropoff')}
            className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirm Delivery
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}

        {isDelivered && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRating(true)}
            className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Rate Courier
          </motion.button>
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
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <Package className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm text-blue-900 mb-2">
                Pickup Confirmation
              </h3>
              <p className="text-xs text-blue-700">
                Your courier has arrived at the pickup location. Share your 6-character
                pickup code with them to confirm they have received your package.
              </p>
            </div>
          </div>
        </div>

        {/* Pickup Code Display */}
        <div className="bg-white rounded-2xl border-2 border-[#3A0A21] p-8 text-center">
          <p className="text-sm text-gray-500 mb-2">Your Pickup Code</p>
          <p className="text-5xl font-bold text-[#3A0A21] tracking-wider font-mono">
            {delivery?.pickupCode || 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Share this code with your courier
          </p>
        </div>

        {/* Verification Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter code to confirm pickup
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
            placeholder="ABC123"
            maxLength={6}
            className={`w-full px-4 py-4 text-2xl font-bold tracking-widest text-center border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-[#3A0A21]'
            }`}
            disabled={isSubmitting}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handlePickupCodeSubmit}
          disabled={isSubmitting || pickupCode.length !== 6}
          className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Confirming...
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
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">
                Delivery Confirmation
              </h3>
              <p className="text-sm text-purple-700">
                Your package is ready for delivery. Share your 6-digit OTP with the
                recipient so they can confirm receipt.
              </p>
            </div>
          </div>
        </div>

        {/* OTP Display */}
        <div className="bg-white rounded-2xl border-2 border-[#3A0A21] p-8 text-center">
          <p className="text-sm text-gray-500 mb-2">Delivery OTP</p>
          <p className="text-5xl font-bold text-[#3A0A21] tracking-wider font-mono">
            {delivery?.dropoffOTP || 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Share this code with the recipient
          </p>
        </div>

        {/* Verification Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP to confirm delivery
          </label>
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
            placeholder="123456"
            maxLength={6}
            className={`w-full px-4 py-4 text-2xl font-bold tracking-widest text-center border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-[#3A0A21]'
            }`}
            disabled={isSubmitting}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleDropoffOTPSubmit}
          disabled={isSubmitting || dropoffOTP.length !== 6}
          className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Confirming...
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Track Delivery</h2>
            {/* <p className="text-sm text-gray-500">ID: {delivery?.$id?.slice(-8)}</p> */}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white px-6 py-3 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'tracking'
                  ? 'bg-[#3A0A21] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tracking
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'bg-[#3A0A21] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Details
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'tracking' && renderTracking()}
            {activeTab === 'pickup' && renderPickupCode()}
            {activeTab === 'dropoff' && renderDropoffOTP()}
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Delivery Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package Size</span>
                      <span className="font-medium">
                        {delivery?.packageSize || 'Standard'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">
                        {formatNairaSimple(
                          delivery?.offeredFare || delivery?.suggestedFare
                        )}
                      </span>
                    </div>
                    {delivery?.isFragile && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Special</span>
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                          Fragile
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium">
                        {new Date(delivery?.$createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
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
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowRating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Rate Your Courier
              </h3>
              <p className="text-gray-600 mb-6">
                How was your delivery experience with {delivery?.driverName}?
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCourierRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= courierRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Additional feedback (optional)"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 mb-4 resize-none focus:outline-none focus:border-[#3A0A21]"
                rows={3}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRating(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={courierRating === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Submit Rating
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