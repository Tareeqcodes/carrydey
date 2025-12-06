"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  Shield,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Profile from "@/components/setting/Profile";
import { useAuth } from "@/hooks/Authcontext";

const SettingsComponent = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { logout } = useAuth();

  const menuItems = [
    { id: "profile", label: "Profile", icon: User, color: "from-blue-500 to-purple-600" },
    { id: "packages", label: "My Packages", icon: Package, color: "from-emerald-500 to-teal-600" },
    { id: "verification", label: "Verification Center", icon: Shield, color: "from-amber-500 to-orange-600" },
    { id: "payment", label: "Payment Methods", icon: CreditCard, color: "from-rose-500 to-pink-600" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "from-violet-500 to-indigo-600" },
    { id: "settings", label: "Settings", icon: Settings, color: "from-slate-500 to-gray-600" },
    { id: "help", label: "Help & Support", icon: HelpCircle, color: "from-cyan-500 to-blue-600" },
  ];

  const slideVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const ProfileComponent = () => (
    <div className="space-y-6">
      <Profile />
    </div>
  );

  const renderSectionContent = (sectionId) => {
    const content = {
      profile: <ProfileComponent />,
      packages: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">My Packages</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((pkg) => (
              <div key={pkg} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Package #{pkg}</h3>
                    <p className="text-emerald-600 font-medium">Status: In Transit</p>
                  </div>
                  <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300">
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      verification: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Verification Center</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl shadow-lg border border-emerald-200/50">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-sm"></div>
                <span className="text-emerald-700 font-semibold text-lg">Account Verified</span>
              </div>
              <p className="text-emerald-600">Your account has been successfully verified</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Identity Verification</h3>
              <p className="text-gray-600 mb-4">Upload your government-issued ID</p>
              <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      ),
      payment: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
          <div className="space-y-4">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">•••• •••• •••• 1234</h3>
                  <p className="text-gray-600">Expires 12/25</p>
                </div>
                <button className="text-red-500 font-medium hover:text-red-600 transition-colors">Remove</button>
              </div>
            </div>
            <button className="w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-300">
              + Add New Payment Method
            </button>
          </div>
        </div>
      ),
      notifications: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: "Package Updates", desc: "Get notified about package status changes" },
              { label: "Payment Alerts", desc: "Notifications about payments and billing" },
              { label: "Marketing", desc: "Promotional offers and updates" },
              { label: "Security", desc: "Login alerts and security notifications" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:bg-gradient-to-r peer-checked:from-violet-500 peer-checked:to-indigo-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      settings: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <div className="space-y-4">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Language</h3>
              <select className="w-full p-3 border border-gray-200 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme</h3>
              <div className="flex space-x-3">
                {["Light", "Dark", "Auto"].map((theme) => (
                  <button
                    key={theme}
                    className="px-4 py-2 bg-white/80 border border-gray-200 rounded-xl font-medium hover:bg-slate-50 hover:shadow-md transition-all duration-300"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      help: ( 
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Help & Support</h2>
          <div className="space-y-4">
            {[
              { title: "FAQ", desc: "Find answers to common questions" },
              { title: "Contact Support", desc: "Get help from our support team" },
              { title: "Report an Issue", desc: "Let us know about any problems" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/80 cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    };

    return content[sectionId] || <div>Content not found</div>;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-hidden">
      {/* Animated Topography Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80"
      />

      {/* Main Settings Screen */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
        <Link href="/dashboard">
          <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors">
            <div className="p-2 bg-white/50 rounded-xl shadow-md">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-lg font-medium">Back to Dashboard</span>
          </button>
        </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/30">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              <p className="text-gray-600">Manage your account preferences</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="w-full bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/30 hover:bg-white/70 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">{item.label}</span>
                  </div>
                  <div className="p-2 bg-white/50 rounded-xl shadow-sm">
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={logout}
          className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </div>

      {/* Slide-in Panel */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            key={activeSection}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 left-0 w-full h-full z-20"
          >
            {/* Panel Background */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%238b5cf6' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-pink-50/90" />
            
            <div className="relative z-10 p-6 h-full overflow-y-auto">
              {/* Header */}
              <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/30 mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActiveSection(null)}
                    className="p-3 bg-white/60 hover:bg-white/80 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <h1 className="text-xl font-bold text-gray-800">Back</h1>
                </div>
              </div>

              {/* Content */}
              <div className="pb-8">{renderSectionContent(activeSection)}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsComponent;