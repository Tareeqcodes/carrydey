"use client";
import { Package, Plane, Wallet, Star, CheckCircle, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Authcontext";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  const handleRoleSelection = (role) => {
    if (user) {
      // If already logged in, go straight to dashboard
      router.push('/dashboard');
    } else {
      // If not logged in, go to login with role parameter
      router.push(`/login?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 justify-center p-6 text-white">
      <div className="flex justify-between items-center mb-12">
        <span className="text-white text-xl font-bold">PacMate</span>
        {user ? (
          <Link
            href="/dashboard"
            className="text-white font-semibold hover:text-gray-200"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-white font-semibold hover:text-gray-200"
          >
            Sign In
          </Link>
        )}
      </div>
      
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold mb-6">
            Send packages with
            <span className="block text-yellow-300">fellow travelers</span>
          </h1>
          <p className="text-lg text-white/90">
            Connect senders with travelers for seamless package delivery across Nigeria
          </p>
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
              onClick={() => handleRoleSelection('sender')}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors"
            >
              I want to send packages
            </button>
            <button
              onClick={() => handleRoleSelection('traveler')}
              className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white py-4 rounded-2xl font-semibold hover:bg-white/30 transition-colors"
            >
              I'm a traveler
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center w-full">
        <div className="flex justify-center items-center space-x-3 text-white/80">
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Verified Users</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">Secure Payments</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span className="text-xs">Trusted Reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}