'use client';
import React, { useState } from 'react';
import { X, User, Phone, Mail, Car, Shield, AlertCircle } from 'lucide-react';

const DriverOnboardingModal = ({ onClose, onDriverAdded }) => {
  const [driverData, setDriverData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    licenseNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!driverData.name.trim()) newErrors.name = 'Name is required';
    if (!driverData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!driverData.email.trim()) newErrors.email = 'Email is required';
    if (!driverData.vehicle.trim()) newErrors.vehicle = 'Vehicle info is required';
    if (!driverData.password) newErrors.password = 'Password is required';
    if (driverData.password !== driverData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onDriverAdded(driverData);
      onClose();
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Add New Driver</h3>
              <p className="text-gray-500">Driver will receive login credentials</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Personal Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={driverData.name}
                    onChange={(e) => setDriverData({...driverData, name: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={driverData.phone}
                      onChange={(e) => setDriverData({...driverData, phone: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+1234567890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={driverData.email}
                      onChange={(e) => setDriverData({...driverData, email: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="driver@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Vehicle Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Vehicle Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type & Number *
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={driverData.vehicle}
                    onChange={(e) => setDriverData({...driverData, vehicle: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                      errors.vehicle ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Toyota Camry - ABC123"
                  />
                </div>
                {errors.vehicle && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicle}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver's License Number
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={driverData.licenseNumber}
                    onChange={(e) => setDriverData({...driverData, licenseNumber: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                    placeholder="DL123456789"
                  />
                </div>
              </div>
            </div>
            
            {/* Account Credentials */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Account Credentials</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={driverData.password}
                    onChange={(e) => setDriverData({...driverData, password: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={driverData.confirmPassword}
                    onChange={(e) => setDriverData({...driverData, confirmPassword: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Note:</span> Driver will receive their login credentials via email/SMS. They can download the driver app from the app store or use the web portal.
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#3A0A21] text-white rounded-xl font-medium hover:bg-[#2A0819] transition-colors"
              >
                Add Driver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverOnboardingModal;