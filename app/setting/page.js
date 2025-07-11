'use client';
import { useAuth } from '@/context/Authcontext';
import { Bell, CreditCard, Shield, CheckCircle, Settings, Package, MessageCircle, User, LogOut } from 'lucide-react';
import Header from '@/components/Header';
// import Profile from '@/components/setting/Profile';

const settingsOptions = [
  { label: 'Profile', value: 'profile', icon: User },
  { label: 'My Packages', value: 'my_packages', icon: Package },
  { label: 'Verification Center', value: 'verification_center', icon: Shield },
  { label: 'Payment Methods', value: 'payment_methods', icon: CreditCard },
  { label: 'Notifications', value: 'notifications', icon: Bell },
  { label: 'Settings', value: 'settings', icon: Settings },
  { label: 'Help & Support', value: 'help_support', icon: MessageCircle },
];


export default function page() {
  const { user } = useAuth();

  return (
    <>
      <Header title="Settings" showBack />
       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-2">
      
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Tariq Auwal</h3>
                  <p className="text-gray-600">{user?.email}</p>
                   <div className="flex items-center space-x-2 mt-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Verified Account</span>
              </div>
                </div>
              </div>
            </div>
        
        {/* Settings Options */}
         <div className='space-y-2'>
           {settingsOptions.map((option) => (
             <button key={option.value} className="bg-white rounded-2xl shadow-sm w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
               <div className="flex items-center space-x-3">
                 {option.icon && <option.icon size={20} className="text-gray-600" />}
                 <span className="font-medium">{option.label}</span>
               </div>
             </button>
           ))}
         </div>
        
        {/* User Type Switch */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Account Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="p-3 rounded-lg font-medium transition-colors bg-blue-600 text-white"
              
            >
              Sender
            </button>
            <button 

              className="p-3 opacity-20 rounded-lg font-medium transition-colors 
               bg-green-600 text-white"
            >
              Traveler
            </button>
          </div>
        </div>
        
        {/* Logout */}
        <button 
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
    </>
  )
}
