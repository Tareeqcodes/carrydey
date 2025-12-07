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
import Payment from "@/components/setting/Payment";
import Notification from "@/components/setting/Notification";
import Setting from "@/components/setting/Setting";
import Help from "@/components/setting/Help";
import VerificationCenter from "@/components/setting/VerificationCenter";

const SettingsComponent = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { logout } = useAuth();

  const menuItems = [
    { 
      id: "profile", 
      label: "Profile", 
      icon: User, 
      color: "bg-[#4A1A31]",
      gradient: "from-[#5A2A41] to-[#3A0A21]"
    },
    { 
      id: "verification", 
      label: "Verification Center", 
      icon: Shield, 
      color: "bg-[#5A3A31]",
      gradient: "from-[#6A4A41] to-[#4A2A21]"
    },
    { 
      id: "payment", 
      label: "Payment Methods", 
      icon: CreditCard, 
      color: "bg-[#4A2A31]",
      gradient: "from-[#5A3A41] to-[#3A1A21]"
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: Bell, 
      color: "bg-[#3A1A21]",
      gradient: "from-[#4A2A31] to-[#2A0A11]"
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings, 
      color: "bg-[#2A0A11]",
      gradient: "from-[#3A1A21] to-[#1A0001]"
    },
    { 
      id: "help", 
      label: "Help & Support", 
      icon: HelpCircle, 
      color: "bg-[#4A0A31]",
      gradient: "from-[#5A1A41] to-[#3A0011]"
    },
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
      verification: (
        <VerificationCenter />
      ),
      payment: (
        <Payment />
      ),
      notifications: (
        <Notification />
      ),
      settings: (
        <Setting />
      ),
      help: ( 
        <Help />
      ),
    };

    return content[sectionId] || <div>Content not found</div>;
  };

  return (
    <div className="max-w-full my-20 mx-4 md:mx-48 min-h-screen relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(#3A0A21 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F8F5F7] to-[#F0EBEF]" />

      {/* Main Settings Screen */}
      <div className="relative z-10 p-4 md:p-6 space-y-8">

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#3A0A21] rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3A0A21]">Settings</h2>
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
                className="w-full bg-white p-4 md:p-5 rounded-xl border border-gray-200 hover:border-[#E8DDE3] hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 ${item.color} rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">{item.label}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
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
          className="w-full bg-[#3A0A21] text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-[#4A1A31] transition-colors"
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
              className="absolute inset-0 opacity-3"
              style={{
                backgroundImage: `radial-gradient(#3A0A21 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FCFAFC] to-[#F8F5F7]" />
            
            <div className="relative z-10 p-4 md:p-6 h-full overflow-y-auto">
              {/* Header */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActiveSection(null)}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <h1 className="text-xl font-bold text-[#3A0A21]">Back</h1>
                </div>
              </div>

              {/* Content */}
              <div className="pb-8">
                <div className="max-w-3xl mx-auto">
                  {renderSectionContent(activeSection)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsComponent;