'use client';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Phone, Mail, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = params.deliveryId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Booking Confirmed! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your delivery has been successfully booked. The agency will contact you shortly to confirm pickup details.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Booking ID:</span>
            <span className="text-sm font-mono font-semibold text-gray-900">
              {deliveryId?.substring(0, 8)}...
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Phone className="w-5 h-5 text-blue-600" />
            <div className="text-left flex-1">
              <p className="text-xs text-gray-600">You'll receive a call</p>
              <p className="text-sm font-medium text-gray-900">Within 15 minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Package className="w-5 h-5 text-purple-600" />
            <div className="text-left flex-1">
              <p className="text-xs text-gray-600">Keep your package ready</p>
              <p className="text-sm font-medium text-gray-900">For quick pickup</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full px-6 py-3 bg-[#3A0A21] text-white rounded-lg hover:bg-[#4A0A31] transition-colors font-medium"
        >
          Done
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Save this page or take a screenshot for your records
        </p>
      </motion.div>
    </div>
  );
}