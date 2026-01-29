'use client';

import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Phone, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = params.deliveryId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Headline */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Delivery Request Sent ✅
        </h1>

        <p className="text-gray-600 text-sm mb-6">
          Your request has been sent to the delivery agency. They will review it and contact you shortly.
        </p>

        {/* Booking Reference */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Reference ID</span>
            <span className="text-sm font-mono font-semibold text-gray-900">
              {deliveryId?.substring(0, 8)}…
            </span>
          </div>

        </div>

        {/* What Happens Next */}
        <div className="text-left mb-8">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            What happens next
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Agency will call you
                </p>
                <p className="text-xs text-gray-600">
                  Expect a call within 10–15 minutes to confirm pickup details.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Package className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Prepare your package
                </p>
                <p className="text-xs text-gray-600">
                  Keep the item ready for quick pickup once confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <button
          onClick={() => router.push('/')}
          className="w-full h-12 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors font-semibold flex items-center justify-center gap-2"
        >
          Done
          <ArrowRight size={16} />
        </button>

        {/* Soft Upsell */}
        <p className="text-xs text-gray-500 mt-4">
          Want to track future deliveries?  
          <span
            onClick={() => router.push('/login')}
            className="ml-1 text-[#3A0A21] font-medium cursor-pointer hover:underline"
          >
            Create an account
          </span>
        </p>

        <p className="text-[11px] font-bold text-gray-400 mt-3">
          Tip: Save this page or take a screenshot for reference
        </p>
      </motion.div>
    </div>
  );
}
