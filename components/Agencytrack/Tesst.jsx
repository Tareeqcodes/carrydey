'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, User, Star, CheckCircle, AlertCircle, Home, Receipt, ArrowLeft } from 'lucide-react';

// Mock data - Replace with Appwrite data
const mockDeliveryData = {
  packageId: 'PKG-2024-001',
  senderName: 'John Doe',
  receiverName: 'Jane Smith',
  receiverPhone: '+234 801 234 5678',
  packageDescription: 'Electronics - Laptop',
  courierName: 'Michael Obi',
  courierPhone: '+234 802 345 6789',
  courierRating: 4.8,
  pickupAddress: '15 Victoria Island, Lagos',
  deliveryAddress: '42 Lekki Phase 1, Lagos',
  estimatedTime: '25 mins',
  actualOtp: '548392'
};

const CourierDeliveryScreen = ({ onSuccess, deliveryData }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (otp === deliveryData.actualOtp) {
        // Success - Update Appwrite
        // const databases = new Databases(client);
        // await databases.updateDocument(
        //   'DATABASE_ID',
        //   'COLLECTION_ID',
        //   deliveryData.packageId,
        //   {
        //     status: 'delivered',
        //     deliveredAt: new Date().toISOString()
        //   }
        // );
        onSuccess();
      } else {
        setError('Invalid OTP code. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    >
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Delivery</h1>
          <p className="text-gray-600">Enter the OTP to complete delivery</p>
        </motion.div>

        {/* Package Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 mb-1">{deliveryData.packageDescription}</h2>
              <p className="text-sm text-gray-500">ID: {deliveryData.packageId}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Receiver</p>
                <p className="font-medium text-gray-900">{deliveryData.receiverName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Delivery Address</p>
                <p className="font-medium text-gray-900">{deliveryData.deliveryAddress}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* OTP Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter 6-Digit OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="000000"
            className="w-full text-center text-3xl font-bold tracking-widest border-2 border-gray-200 rounded-xl px-4 py-4 focus:border-blue-500 focus:outline-none transition-colors"
            maxLength={6}
          />
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Ask the receiver for their delivery code
          </p>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleSubmit}
          disabled={loading || otp.length !== 6}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Confirming...</span>
            </div>
          ) : (
            'Confirm Delivery'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const SuccessScreen = ({ onViewReceipt, onRateSender, onGoHome, deliveryData }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-500 rounded-full p-6 shadow-2xl">
            <CheckCircle className="w-20 h-20 text-white" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Delivery Completed!</h1>
          <p className="text-gray-600 text-lg">
            Package successfully delivered to {deliveryData.receiverName}
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Package ID</span>
              <span className="font-semibold text-gray-900">{deliveryData.packageId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivered At</span>
              <span className="font-semibold text-gray-900">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Receiver</span>
              <span className="font-semibold text-gray-900">{deliveryData.receiverName}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button
            onClick={onViewReceipt}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Receipt className="w-5 h-5" />
            View Receipt
          </button>
          
          <button
            onClick={onRateSender}
            className="w-full bg-white text-gray-900 font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-gray-200"
          >
            <Star className="w-5 h-5" />
            Rate Sender
          </button>
          
          <button
            onClick={onGoHome}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Back Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SenderConfirmationScreen = ({ onRateCourier, onClose, deliveryData }) => {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 p-4"
    >
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Complete</h1>
            <p className="text-gray-600">Your package has been delivered</p>
          </div>
        </motion.div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 mb-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <CheckCircle className="w-12 h-12" />
            <div>
              <h2 className="text-xl font-bold mb-1">Successfully Delivered!</h2>
              <p className="text-green-100">Delivered at {new Date().toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Map Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Delivery Route
            </h3>
            
            {/* Mock Map */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium">Route Map</p>
                <p className="text-sm text-gray-600">Integrate with Maps API</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">From</p>
                <p className="text-sm font-medium text-gray-900">{deliveryData.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">To</p>
                <p className="text-sm font-medium text-gray-900">{deliveryData.deliveryAddress}</p>
              </div>
            </div>
          </motion.div>

          {/* Courier Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Courier Details
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {deliveryData.courierName.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{deliveryData.courierName}</h4>
                <p className="text-sm text-gray-600">{deliveryData.courierPhone}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">{deliveryData.courierRating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Package ID</span>
                <span className="font-semibold text-gray-900">{deliveryData.packageId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivered To</span>
                <span className="font-semibold text-gray-900">{deliveryData.receiverName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Time</span>
                <span className="font-semibold text-gray-900">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowRating(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              Rate Courier
            </button>
          </motion.div>
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Courier</h3>
              <p className="text-gray-600 mb-6">How was your delivery experience?</p>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Additional feedback (optional)"
                className="w-full border border-gray-200 rounded-xl p-3 mb-4 resize-none focus:outline-none focus:border-blue-500"
                rows={3}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRating(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRateCourier(rating);
                    setShowRating(false);
                  }}
                  disabled={rating === 0}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Submit Rating
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main App Component
export default function CarrydeyDeliveryFlow() {
  const [currentScreen, setCurrentScreen] = useState('courier');

  const handleDeliverySuccess = () => {
    setCurrentScreen('success');
  };

  const handleViewReceipt = () => {
    alert('Navigate to Receipt Screen');
  };

  const handleRateSender = () => {
    alert('Open Rate Sender Modal');
  };

  const handleGoHome = () => {
    alert('Navigate to Home Screen');
  };

  const handleRateCourier = (rating) => {
    console.log('Courier rating:', rating);
    alert(`Thank you for rating ${rating} stars!`);
  };

  return (
    <div className="min-h-screen mt-20">
      {/* Demo Navigation */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <p className="text-xs font-semibold text-gray-600 mb-2">Demo Navigation</p>
        <button
          onClick={() => setCurrentScreen('courier')}
          className={`block w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
            currentScreen === 'courier' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          Courier Screen
        </button>
        <button
          onClick={() => setCurrentScreen('success')}
          className={`block w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
            currentScreen === 'success' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          Success Screen
        </button>
        <button
          onClick={() => setCurrentScreen('sender')}
          className={`block w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
            currentScreen === 'sender' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          Sender Screen
        </button>
        <p className="text-xs text-gray-500 pt-2 border-t">OTP: 548392</p>
      </div>

      <AnimatePresence mode="wait">
        {currentScreen === 'courier' && (
          <CourierDeliveryScreen
            key="courier"
            onSuccess={handleDeliverySuccess}
            deliveryData={mockDeliveryData}
          />
        )}
        {currentScreen === 'success' && (
          <SuccessScreen
            key="success"
            onViewReceipt={handleViewReceipt}
            onRateSender={handleRateSender}
            onGoHome={handleGoHome}
            deliveryData={mockDeliveryData}
          />
        )}
        {currentScreen === 'sender' && (
          <SenderConfirmationScreen
            key="sender"
            onRateCourier={handleRateCourier}
            onClose={handleGoHome}
            deliveryData={mockDeliveryData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}