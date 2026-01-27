'use client';
import React, { useState } from 'react';
import { X, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

const DropoffotpModal = ({ isOpen, onClose, delivery, onConfirmDelivery }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await onConfirmDelivery(delivery.$id, otp);
      
      if (result.success) {
        setOtp('');
        onClose();
      } else {
        setError(result.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setOtp('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Confirm Delivery</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Delivery Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Dropoff Location</p>
            <p className="font-semibold text-gray-900">{delivery?.dropoffAddress}</p>
            {delivery?.dropoffContactName && (
              <p className="text-sm text-gray-600 mt-2">
                Recipient: {delivery.dropoffContactName}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h3 className="font-semibold text-purple-900 mb-2">Instructions</h3>
            <p className="text-sm text-purple-700">
              Ask the recipient for their 6-digit OTP code. Enter the code below to confirm successful delivery.
            </p>
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery OTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={handleChange}
              placeholder="123456"
              maxLength={6}
              className={`w-full px-4 py-3 text-2xl font-bold tracking-widest text-center border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                error
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#3A0A21]'
              }`}
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Enter the 6-digit OTP provided by the recipient
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Benefits */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Secure Delivery Confirmation
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ No GPS tracking required</li>
              <li>✓ Prevents delivery fraud</li>
              <li>✓ Confirms recipient received package</li>
              <li>✓ Driver payment will be processed</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || otp.length !== 6}
              className="flex-1 px-4 py-3 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Complete Delivery
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropoffotpModal;