'use client';
import { MapPin, Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';

export default function PostTrip() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Post Trip" showBack />
      
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Trip Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Departure city"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Destination city"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="date" 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <div className="relative">
                  <Clock size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="time" 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transport Mode</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Flight</option>
                <option>Road (Car/Bus)</option>
                <option>Train</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Capacity (kg)</label>
                <input 
                  type="number" 
                  placeholder="20"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per kg (₦)</label>
                <input 
                  type="number" 
                  placeholder="3000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea 
                placeholder="Any special instructions or requirements"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition-colors">
            Post Trip
          </button>
        </div>
      </div>
       <div className="h-20"></div>
    </div>
  )
}
