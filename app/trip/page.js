'use client';
import { useState } from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Header from '@/components/Header';
import { databases, ID } from '@/config/Appwriteconfig';
import { useAuth } from '@/context/Authcontext';

export default function PostTrip() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    travelDate: '',
    travelTime: '',
    transportMode: 'Flight',
    totalCapacity: '',
    pricePerKg: '',
    additionalNotes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to post a trip');
      return;
    }

    // Validate required fields
    const requiredFields = ['fromCity', 'toCity', 'travelDate', 'travelTime', 'totalCapacity', 'pricePerKg'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate that travel date is not in the past
    const selectedDate = new Date(formData.travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('Travel date cannot be in the past');
      return;
    }

    setLoading(true);
    
    try {
      // Combine date and time for the datetime field
      const travelDateTime = new Date(`${formData.travelDate}T${formData.travelTime}`);
      
      const tripData = {
        fromCity: formData.fromCity.trim(),
        toCity: formData.toCity.trim(),
        travelDate: travelDateTime.toISOString(),
        travelTime: formData.travelTime,
        transportMode: formData.transportMode,
        totalCapacity: parseFloat(formData.totalCapacity),
        availableCapacity: parseFloat(formData.totalCapacity), // Initially same as total
        pricePerKg: parseInt(formData.pricePerKg),
        additionalNotes: formData.additionalNotes.trim(),
        userId: user.$id,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_TRIP_COLLECTION_ID,
        ID.unique(),
        tripData
      );

      console.log('Trip posted successfully:', response);
      setSuccess("Trip posted successfully!");
      
      setFormData({
        fromCity: '',
        toCity: '',
        travelDate: '',
        travelTime: '',
        transportMode: 'Flight',
        totalCapacity: '',
        pricePerKg: '',
        additionalNotes: ''
      });
      
    } catch (error) {
      console.error('Error posting trip:', error);
      alert('Failed to post trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Post Trip" showBack />
      
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Trip Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From *
              </label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  name="fromCity"
                  value={formData.fromCity}
                  onChange={handleInputChange}
                  placeholder="Departure city"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To *
              </label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  name="toCity"
                  value={formData.toCity}
                  onChange={handleInputChange}
                  placeholder="Destination city"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date *
                </label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="date" 
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <div className="relative">
                  <Clock size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="time" 
                    name="travelTime"
                    value={formData.travelTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transport Mode
              </label>
              <select 
                name="transportMode"
                value={formData.transportMode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Flight">Flight</option>
                <option value="Road (Car/Bus)">Road (Car/Bus)</option>
                <option value="Train">Train</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Capacity (kg) *
                </label>
                <input 
                  type="number" 
                  name="totalCapacity"
                  value={formData.totalCapacity}
                  onChange={handleInputChange}
                  placeholder="20"
                  min="0.1"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per kg (₦) *
                </label>
                <input 
                  type="number" 
                  name="pricePerKg"
                  value={formData.pricePerKg}
                  onChange={handleInputChange}
                  placeholder="3000"
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea 
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any special instructions or requirements"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-50 text-red-600 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-green-50 text-green-600 rounded-lg text-sm"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting Trip...' : 'Post Trip'}
          </button>
        </div>
      </form>
      <div className="h-20"></div>
    </div>
  );
}