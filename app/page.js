"use client";
import {
  Package,
  Plane,
  Wallet,
  Star,
  CheckCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/Authcontext";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  const handleRoleSelection = (role) => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push(`/login?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 text-gray-900 flex flex-col relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center p-8 max-w-6xl mx-auto w-full">
          <Link
            href="/setting"
            className="text-3xl font-light tracking-tight bg-gradient-to-r from-gray-900 via-slate-800 to-blue-900 bg-clip-text text-transparent"
          >
            Sendr
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-full border border-gray-200/60 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-50/80 hover:border-blue-200/60 hover:text-blue-900 transition-all duration-300 font-medium shadow-sm"
            >
              Dashboard
            </Link>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center sm:px-2 md:px-8">
          <div className="max-w-md w-full space-y-12 text-center">
            {/* Hero Section */}
            <div className="space-y-6">
              <h1 className="text-4xl font-light leading-tight tracking-tight text-gray-900">
                Send packages with
                <span className="block font-medium mt-2 bg-gradient-to-r from-gray-700 to-blue-800 bg-clip-text text-transparent">
                  fellow travelers
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                Connect senders with travelers for seamless package delivery
                across Nigeria
              </p>
            </div>

            {/* Features Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 via-blue-200 to-slate-200 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 space-y-6 shadow-xl shadow-gray-100/50">
                <div className="space-y-6">
                  <div className="flex cursor-pointer  items-center justify-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-blue-50/60 hover:from-blue-50/80 hover:to-slate-50/80 transition-all duration-300 group/item border border-gray-100/50">
                    <div className="p-3 rounded-full bg-gradient-to-r from-gray-600 to-blue-600 shadow-lg group-hover/item:shadow-blue-500/25 transition-all duration-300">
                      <Package size={20} className="text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">
                      Send packages safely
                    </span>
                  </div>

                  <div className="flex cursor-pointer  items-center justify-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-blue-50/60 hover:from-blue-50/80 hover:to-slate-50/80 transition-all duration-300 group/item border border-gray-100/50">
                    <div className="p-3 rounded-full bg-gradient-to-r from-slate-600 to-blue-700 shadow-lg group-hover/item:shadow-slate-500/25 transition-all duration-300">
                      <Plane size={20} className="text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">
                      Travel and earn money
                    </span>
                  </div>

                  <div className="flex cursor-pointer items-center justify-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-blue-50/60 hover:from-blue-50/80 hover:to-slate-50/80 transition-all duration-300 group/item border border-gray-100/50">
                    <div className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-slate-700 shadow-lg group-hover/item:shadow-blue-500/25 transition-all duration-300">
                      <Wallet size={20} className="text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">
                      Secure payments
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelection("sender")}
                className="w-full relative group overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-blue-300 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative cursor-pointer bg-gradient-to-r from-gray-900 to-blue-900 text-white py-5 px-8 rounded-2xl font-medium shadow-2xl shadow-gray-900/25 group-hover:shadow-blue-900/30 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-[1.02]">
                  <span>I want to send packages</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("traveler")}
                className="w-full relative group overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-200/50 to-blue-200/50 rounded-2xl"></div>
                <div className="relative cursor-pointer border-2 border-gray-300/60 bg-white/80 backdrop-blur-sm text-gray-800 py-5 px-8 rounded-2xl font-medium hover:bg-blue-50/80 hover:border-blue-300/60 hover:text-blue-900 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-gray-100/50 group-hover:shadow-blue-100/50">
                  <span>I'm a traveler</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </div>
              </button>
            </div>
          </div>
        </main>

        <footer className="p-8">
          <div className="text-center max-w-6xl mx-auto">
            <div className="relative inline-block">
              <span className="text-lg font-light bg-gradient-to-r from-gray-700 via-blue-800 to-slate-700 bg-clip-text text-transparent tracking-wide">
                Send smarter • Travel richer
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
