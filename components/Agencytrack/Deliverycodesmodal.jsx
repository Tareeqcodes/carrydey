'use client';
import React, { useState } from 'react';
import { X, Copy, Phone, CheckCircle, Package, MapPin, User } from 'lucide-react';

const DeliveryCodesModal = ({ isOpen, onClose, delivery, pickupCode, dropoffOTP, driverPhone }) => {
  const [copiedPickup, setCopiedPickup] = useState(false);
  const [copiedDropoff, setCopiedDropoff] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Delivery Codes & Info</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Delivery Accepted!</p>
              <p className="text-sm text-green-700 mt-1">
                Your delivery has been accepted. Share these codes with the sender and recipient.
              </p>
            </div>
          </div>

          {/* Pickup Code Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Pickup Code</h3>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              The sender will provide this code to the driver at pickup to confirm package handover.
            </p>
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-blue-600 tracking-wider">
                  {pickupCode}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(pickupCode, setCopiedPickup)}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {copiedPickup ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Dropoff OTP Section */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Dropoff OTP</h3>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              The recipient will provide this OTP to confirm delivery completion.
            </p>
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-purple-600 tracking-wider">
                  {dropoffOTP}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(dropoffOTP, setCopiedDropoff)}
                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
              >
                {copiedDropoff ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-purple-600" />
                )}
              </button>
            </div>
          </div>

          {/* Driver Phone Section */}
          {driverPhone && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Driver Contact</h3>
              </div>
              <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span className="text-lg font-semibold text-gray-900">
                    {driverPhone}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(driverPhone, setCopiedPhone)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedPhone ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Instructions</h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Share the <strong>Pickup Code</strong> with the sender</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Share the <strong>Dropoff OTP</strong> with the recipient</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Share the <strong>Driver's Phone</strong> with both parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Driver will request the pickup code from sender before taking the package</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">5.</span>
                <span>Driver will provide the dropoff OTP to recipient upon delivery</span>
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors font-medium"
          >
            I've Saved These Codes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCodesModal;