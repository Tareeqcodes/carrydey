'use client';
import React from 'react';
import { X, QrCode, Copy, Share2, Download, Mail, MessageSquare } from 'lucide-react';

const DriverQRModal = ({ driver, onClose }) => {
  const qrData = driver?.qrData || `deliveryapp://driver/login?id=${driver?.$id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrData);
    alert('Link copied to clipboard!');
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Driver Login',
          text: `Login link for ${driver.name}`,
          url: qrData
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">{driver?.name}'s Login QR</h3>
              <p className="text-gray-500">Share with driver for login</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Driver Info */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#3A0A21] rounded-xl flex items-center justify-center text-white">
                <span className="font-bold">{driver?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{driver?.name}</p>
                <p className="text-sm text-gray-600">{driver?.phone}</p>
                <p className="text-sm text-gray-600">{driver?.vehicle}</p>
              </div>
            </div>
          </div>
          
          {/* QR Code Display */}
          <div className="text-center mb-6">
            <div className="bg-gray-100 p-8 rounded-2xl inline-block">
              <div className="w-48 h-48 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-32 h-32 text-gray-800 mx-auto" />
                  <p className="text-xs text-gray-500 mt-2">Scan with driver app</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-4 mb-2">
              Scan this QR code with the driver app to login
            </p>
            
            {/* Link Display */}
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-500 mb-1 text-left">Login Link:</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono break-all flex-1 text-left">{qrData}</p>
                <button 
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleShare}
                className="py-3 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="py-3 bg-[#3A0A21] text-white rounded-xl flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Save QR
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button className="py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Instructions for driver:</p>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Download the driver app from app store</li>
              <li>2. Scan QR code or click login link</li>
              <li>3. Enter provided credentials</li>
              <li>4. Start accepting deliveries!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverQRModal;