import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PayoutScreen = ({ balance, onBack, onPayout }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    onPayout(parseFloat(amount));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#3A0A21] mb-6 hover:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Wallet
        </button>

        <h1 className="text-2xl font-bold text-[#3A0A21] mb-6">Request Payout</h1>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-[#3A0A21]">{formatCurrency(balance)}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#3A0A21] mb-2">
              Payout Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent outline-none text-xl"
              />
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Bank Details</p>
            <p className="font-medium text-[#3A0A21]">GTBank - 0123456789</p>
            <p className="text-sm text-gray-500">John Doe</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!amount || loading}
            className="w-full bg-[#3A0A21] text-white py-4 rounded-xl font-semibold hover:bg-[#5A1331] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Request Payout'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Payouts are processed within 24 hours on business days
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayoutScreen;