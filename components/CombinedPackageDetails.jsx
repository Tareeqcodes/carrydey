'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { databases, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';

export default function CombinedPackageDetails({ packageData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [travelerMessage, setTravelerMessage] = useState('');
  const { user } = useAuth();

  const handleGoBack = () => router.back();

  const handleMessage = () => {
    alert(`Opening chat with ${packageData?.senderName || 'sender'}...`);
  };

  const handleAcceptPackage = async () => {
    if (!travelerMessage.trim()) {
      alert('Please include a short message before sending your request.');
      return;
    }

    setIsLoading(true);
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS,
        ID.unique(),
        {
          packageId: packageData.$id,
          travelerId: user.$id,
          status: 'pending',
          travelerMessage: travelerMessage,
        }
      );

      setIsAccepted(true);
    } catch (error) {
      console.error('Error creating application:', error);
      alert('Something went wrong while sending your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const getSenderInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const estimatedDistance = '125 km';
  const estimatedTime = '2 days';

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-gray-100">
        <div className="flex items-center justify-between pt-5 pb-5 px-5">
          <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Delivery Offer</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 pb-32 space-y-0">
    
        <div className="pt-4 pb-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <p className="text-green-100 text-sm font-medium mb-1">Total Payment</p>
              <h2 className="text-5xl font-black mb-6">{formatCurrency(packageData.reward)}</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                  <p className="text-white/70 text-xs mb-1">Distance</p>
                  <p className="text-white font-semibold">{estimatedDistance}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                  <p className="text-white/70 text-xs mb-1">Deadline</p>
                  <p className="text-white font-semibold">{estimatedTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package Title & Status */}
        <div className="space-y-3 pb-4">
          <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            {packageData.status?.toUpperCase() || 'ACTIVE'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{packageData.title || 'Package Delivery'}</h3>
            <p className="text-gray-500 text-sm mt-1">{packageData.description || 'Handle with care.'}</p>
          </div>
        </div>

        {/* Route Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500 to-red-500 my-1"></div>
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex-1 space-y-8">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pickup</p>
                  <p className="text-gray-900 font-medium mt-1">{packageData.pickupLocation}</p>
                  <p className="text-xs text-gray-400 mt-1">Now</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery</p>
                  <p className="text-gray-900 font-medium mt-1">{packageData.deliveryLocation}</p>
                  <p className="text-xs text-gray-400 mt-1">In 2 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                {getSenderInitials(packageData.senderName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {packageData.senderName || 'Anonymous Sender'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="font-medium">{packageData.senderRating || '4.9'}</span> • {packageData.senderTrips || '127'} trips
                </p>
              </div>
            </div>
            <button
              onClick={handleMessage}
              className="w-11 h-11 bg-blue-50 hover:bg-blue-100 rounded-2xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
            >
              <MessageCircle size={20} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Message Section */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Why are you interested?
            </label>
            <textarea
              value={travelerMessage}
              onChange={(e) => setTravelerMessage(e.target.value)}
              placeholder="Tell the sender why you'd be perfect for this delivery..."
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm resize-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all bg-gray-50 hover:bg-white"
              rows={3}
            ></textarea>
            <p className="text-xs text-gray-400 mt-2">
              {travelerMessage.length}/200 characters
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white/80 backdrop-blur-lg border-t border-gray-100 p-5">
        <button
          onClick={handleAcceptPackage}
          disabled={isLoading || isAccepted || !travelerMessage.trim()}
          className={`w-full h-13 rounded-2xl text-base font-semibold transition-all duration-300 ${
            isAccepted
              ? 'bg-green-500 text-white shadow-lg'
              : isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : !travelerMessage.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg active:scale-95'
          }`}
        >
          {isLoading
            ? 'Sending Request...'
            : isAccepted
            ? '✓ Request Sent!'
            : 'Send Delivery Request'}
        </button>
      </div>
    </div>
  );
}