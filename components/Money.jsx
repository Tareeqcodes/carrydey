'use client';
import { Wallet, Package, Plane, TrendingUp } from 'lucide-react';

export default function Money() {
  return (
    <>
     <div className="grid grid-cols-1 gap-4 pt-4">
          {/* Wallet Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm">Wallet Balance</p>
                <h3 className="text-2xl font-bold text-gray-900">₦2,500.75</h3>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-xl">
                <Wallet size={24} className="text-white" />
              </div>
            </div>
            <button 
             
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Manage Wallet
            </button>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Packages</p>
                  <p className="text-xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-green-600">+2 this week</p>
                </div>
   
                  <Package size={20} className="text-blue-500" /> 
                  <Plane size={20} className="text-green-500" />
                
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">This Month</p>
                  <p className="text-xl font-bold text-gray-900">₦45k</p>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </div>
                <TrendingUp size={20} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
