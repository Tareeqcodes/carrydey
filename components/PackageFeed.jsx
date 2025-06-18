'use client'
import { Plane } from 'lucide-react';

export default function PackageFeed() {
  return (
    <>
    <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Travelers
            </h3>
            <button 
          
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3 pt-2">
            
              <>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Plane size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Lagos → Abuja</p>
                        <p className="text-sm text-gray-600">Mike Johnson • ⭐ 4.7</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₦5,000/kg</p>
                      <p className="text-xs text-gray-600">12kg available</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>🛫 Flight • Tomorrow 9:00 AM</span>
                    <button className="text-blue-600 font-medium hover:text-blue-700">Connect</button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                        <Plane size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Abuja → Port Harcourt</p>
                        <p className="text-sm text-gray-600">Grace Okafor • ⭐ 4.9</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₦3,000/kg</p>
                      <p className="text-xs text-gray-600">18kg available</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>🚗 By Road • June 17, 2:00 PM</span>
                    <button className="text-blue-600 font-medium hover:text-blue-700">Connect</button>
                  </div>
                </div>
              </>
          </div>
        </div>
    </>
  )
}
