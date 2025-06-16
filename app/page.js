"use client";
import { Package, Plane, Wallet } from "lucide-react";

export default function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500  justify-center p-6 text-white">
        <div className="flex justify-between items-center mb-12">
            <span className="text-white text-xl font-bold">SendMate</span>
          <button 
            className="text-white hover:text-gray-200"
          >
            Sign In
          </button>
        </div>
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
            <Package size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold">SendMate</h1>
          <p className="text-lg text-white/90">Connect senders with travelers for seamless package delivery across Nigeria</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Package size={24} className="text-blue-200" />
              <span>Send packages safely</span>
            </div>
            <div className="flex items-center space-x-3">
              <Plane size={24} className="text-green-200" />
              <span>Travel and earn money</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wallet size={24} className="text-yellow-200" />
              <span>Secure payments</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => { setUserType('sender'); setCurrentScreen('dashboard'); }}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors"
            >
              I want to send packages
            </button>
            <button 
              onClick={() => { setUserType('traveler'); setCurrentScreen('dashboard'); }}
              className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white py-4 rounded-2xl font-semibold hover:bg-white/30 transition-colors"
            >
              I'm a traveler
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
