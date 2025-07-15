'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  LogOut
} from 'lucide-react';
import Profile from '@/components/setting/Profile';

const page = () => {
  const [activeSection, setActiveSection] = useState(null);

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'packages', label: 'My Packages', icon: Package },
    { id: 'verification', label: 'Verification Center', icon: Shield },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const slideVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  // const modalVariants = {
  //   hidden: { 
  //     opacity: 0,
  //     scale: 0.8,
  //     y: 20
  //   },
  //   visible: { 
  //     opacity: 1,
  //     scale: 1,
  //     y: 0,
  //     transition: { 
  //       type: 'spring',
  //       stiffness: 400,
  //       damping: 25
  //     }
  //   },
  //   exit: { 
  //     opacity: 0,
  //     scale: 0.8,
  //     y: 20,
  //     transition: { 
  //       duration: 0.2
  //     }
  //   }
  // };

  const renderSectionContent = (sectionId) => {
    const content = {
      profile: (
        <div className="space-y-6">
          <Profile />
        </div>
      ),
      packages: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">My Packages</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((pkg) => (
              <div key={pkg} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Package #{pkg}</h3>
                    <p className="text-sm text-gray-600">Status: In Transit</p>
                  </div>
                  <button className="text-blue-600 text-sm">Track</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      verification: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Verification Center</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Account Verified</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Your account has been successfully verified</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium">Identity Verification</h3>
              <p className="text-sm text-gray-600">Upload your government-issued ID</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      ),
      payment: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Payment Methods</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">•••• •••• •••• 1234</h3>
                  <p className="text-sm text-gray-600">Expires 12/25</p>
                </div>
                <button className="text-red-600 text-sm">Remove</button>
              </div>
            </div>
            <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600">
              + Add New Payment Method
            </button>
          </div>
        </div>
      ),
      notifications: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: 'Package Updates', desc: 'Get notified about package status changes' },
              { label: 'Payment Alerts', desc: 'Notifications about payments and billing' },
              { label: 'Marketing', desc: 'Promotional offers and updates' },
              { label: 'Security', desc: 'Login alerts and security notifications' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
      settings: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">Language</h3>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">Theme</h3>
              <div className="flex space-x-2">
                {['Light', 'Dark', 'Auto'].map((theme) => (
                  <button 
                    key={theme}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
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
          <h2 className="text-xl font-semibold">Help & Support</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">FAQ</h3>
              <p className="text-sm text-gray-600">Find answers to common questions</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Contact Support</h3>
              <p className="text-sm text-gray-600">Get help from our support team</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Report an Issue</h3>
              <p className="text-sm text-gray-600">Let us know about any problems</p>
            </div>
          </div>
        </div>
      )
    };

    return content[sectionId] || <div>Content not found</div>;
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
      {/* Main Settings Screen */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">Deviareeq</h2>
              <p className="text-gray-600 text-sm">tareeqcodes@gmail.com</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 text-sm">Verified Account</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Account Type */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-medium mb-3">Account Type</h3>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium">
              Sender
            </button>
            <button className="flex-1 bg-green-200 text-green-800 py-2 rounded-lg font-medium">
              Traveler
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
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
            className="absolute top-0 left-0 w-full h-full bg-white z-10"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <button 
                  onClick={() => setActiveSection(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold">Back</h1>
              </div>

              {/* Content */}
              <div className="pb-6">
                {renderSectionContent(activeSection)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default page;