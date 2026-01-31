'use client';
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const PickupCodeModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  deliveryId 
}) => {
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (pickupCodeInput.length !== 6) {
      alert('Please enter the complete 6-character pickup code');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(deliveryId, pickupCodeInput);
      setPickupCodeInput('');
      onClose();
    } catch (error) {
      console.error('Error confirming pickup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPickupCodeInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold">Verify Pickup Code</h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-4">
          Ask the sender for the pickup code and enter it below to confirm package collection.
        </p>
        
        {/* Input */}
        <input
          type="text"
          value={pickupCodeInput}
          onChange={(e) => setPickupCodeInput(e.target.value.toUpperCase())}
          placeholder="Enter 6-character code"
          maxLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 text-center text-2xl font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={pickupCodeInput.length !== 6 || isSubmitting}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Pickup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupCodeModal;