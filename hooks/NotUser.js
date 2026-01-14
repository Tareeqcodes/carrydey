'use client';
import { Lock, LogIn, ArrowRight, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotUser() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#3A0A21]/10 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-[#3A0A21]" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#3A0A21] mb-3">
              Sign in Required
            </h1>
            <p className="text-gray-600 text-sm font-semibold">
              Please sign in to create a delivery and send your package
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full flex items-center justify-center space-x-2 bg-[#3A0A21] text-white px-6 py-4 rounded-xl hover:bg-[#4A0A31] transition-colors font-medium shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => router.push('/login')}
              className="w-full flex items-center justify-center space-x-2 bg-white text-[#3A0A21] px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium border-2 border-[#3A0A21]"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      </div>
  )
}
