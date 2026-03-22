'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { tablesDB } from '@/lib/config/Appwriteconfig';
import useChooseAvailable from '@/hooks/useChooseAvailable';
import {
  CheckCircle,
  Zap,
  Loader2, 
  TrendingUp,
  AlertCircle,
  Radio,
  RadioTower,
} from 'lucide-react';

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DELIVERIES = process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID;

const AutoAssignDelivery = () => {
  const router = useRouter();
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [assignedCourier, setAssignedCourier] = useState(null);

  const deliveryId =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('latestDeliveryId')
      : null;

  const {
    status,
    currentCourier,
    countdown,
    queueId,
    failReason,
    advanceDispatch,
  } = useChooseAvailable(deliveryId);

  // Load delivery details once on mount
  useEffect(() => {
    if (!deliveryId) {
      router.push('/send');
      return;
    }

    tablesDB
      .getRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: deliveryId,
      })
      .then(setDeliveryDetails)
      .catch(() => router.push('/send'));
  }, [deliveryId]);

  // When assigned, lock in the courier and redirect
  useEffect(() => {
    if (status === 'assigned' && currentCourier && !assignedCourier) {
      setAssignedCourier(currentCourier);
      setTimeout(() => router.push('/track'), 2000);
    }
  }, [status, currentCourier]);

  const handleIncreaseOffer = async () => {
    if (!deliveryDetails) return;
    const newFare = Math.round(deliveryDetails.offeredFare * 1.2);

    await tablesDB.updateRow({
      databaseId: DB,
      tableId: DELIVERIES,
      rowId: deliveryId,
      data: { offeredFare: newFare },
    });

    setDeliveryDetails((prev) => ({ ...prev, offeredFare: newFare }));

    // Skip current courier and retry with higher fare
    if (queueId) advanceDispatch(queueId, 'timeout');
  };

  const renderSearching = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-ping" />
        <div className="absolute inset-2 rounded-full border-4 border-orange-300 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-orange-500 flex items-center justify-center">
          <RadioTower className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
      <h2 className="text-xl font-black mb-2">Finding your courier</h2>
      <p className="text-sm text-gray-400 mb-4">
        Searching for the best match nearby...
      </p>
      
    </motion.div>
  );

  const renderOffering = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${currentCourier?.name}`}
            alt={currentCourier?.name}
            className="w-full h-full rounded-full border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-black mb-1">{currentCourier?.name}</h2>
        <p className="text-gray-500 mb-1">
          {currentCourier?.entityType === 'agency'
            ? 'Delivery Agency'
            : 'Independent Courier'}
        </p>
        <p className="text-sm text-gray-400 mb-4">
          {currentCourier?.distance}km away · ⭐{' '}
          {currentCourier?.rating?.toFixed(1)}
        </p>

        {/* Countdown ring */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="#FF6B35"
              strokeWidth="6"
              fill="none"
              strokeDasharray="364.5"
              strokeDashoffset={364.5 * (1 - countdown / 20)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black text-gray-800">
              {countdown}s
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-1">
          Waiting for {currentCourier?.name} to respond...
        </p>
        <p className="text-sm text-gray-400">
          They have {countdown} seconds to accept
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-600 mb-3">
         Increase your offer to get matched faster
        </p>
        <button
          onClick={handleIncreaseOffer}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Increase offer by 20%
        </button>
      </div>
    </motion.div>
  );

  const renderAssigned = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-8 mb-6 text-white">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black mb-2">Courier Found!</h2>
        <p className="text-white/90 mb-1">
          {assignedCourier?.name} is on the way
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
        <img
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${assignedCourier?.name}`}
          alt={assignedCourier?.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1 text-left">
          <p className="font-bold">{assignedCourier?.name}</p>
          <p className="text-xs text-gray-500">
            ⭐ {assignedCourier?.rating?.toFixed(1)} ·{' '}
            {assignedCourier?.distance}km away
          </p>
        </div>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500" />
      </div>
      <p className="text-sm text-gray-400 mt-4">Redirecting to tracking...</p>
    </motion.div>
  );

  const failMessages = {
    no_couriers: 'No riders are currently active in your area.',
    all_rejected: 'Available riders are busy. Try increasing your fare.',
    radius_exhausted: 'No riders found within 20km of your pickup.',
  };

  const renderFailed = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <div className="bg-red-50 rounded-3xl p-8 mb-6">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-2">No couriers available</h2>
        <p className="text-gray-600 mb-4">
          {failMessages[failReason] ?? 'Could not find a courier right now.'}
        </p>
      </div>
      <div className="space-y-3">
        <button
          onClick={handleIncreaseOffer}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold"
        >
          Increase offer & try again
        </button>
        <button
          onClick={() => router.push('/send')}
          className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold"
        >
          Modify delivery
        </button>
      </div>
    </motion.div>
  );

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-b from-white  py-7 to-gray-50">
       

        <div className="max-w-md mx-auto px-4 py-8">
          {status === 'searching' && renderSearching()}
          {status === 'offering' && renderOffering()}
          {status === 'assigned' && renderAssigned()}
          {status === 'failed' && renderFailed()}
          {!['searching', 'offering', 'assigned', 'failed'].includes(
            status
          ) && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
              <p>Preparing your delivery...</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="max-w-md mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-orange-500" />
              <span className="text-gray-600">
                {status === 'searching' && 'Scanning couriers...'}
                {status === 'offering' && 'Waiting for response...'}
                {status === 'assigned' && 'Courier assigned'}
                {status === 'failed' && 'Assignment failed'}
              </span>
            </div>
            {deliveryDetails && (
              <span className="font-bold text-orange-500">
                ₦{deliveryDetails.offeredFare?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoAssignDelivery;
