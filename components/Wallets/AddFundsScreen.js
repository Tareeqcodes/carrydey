import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Copy, Check } from 'lucide-react';

const AddFundsScreen = ({ virtualAccount, onBack, onCardPayment }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <h1 className="text-2xl font-bold text-[#3A0A21] mb-6">Add Funds</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-[#3A0A21]" />
            <h3 className="font-semibold text-[#3A0A21]">Transfer to Your Virtual Account</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Transfer any amount to your dedicated account number below. Funds reflect instantly.
          </p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Bank Name</p>
              <p className="font-semibold text-[#3A0A21]">{virtualAccount.bankName}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                  <p className="text-2xl font-bold text-[#3A0A21]">{virtualAccount.accountNumber}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(virtualAccount.accountNumber)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-[#3A0A21]" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Account Name</p>
              <p className="font-semibold text-[#3A0A21]">{virtualAccount.accountName}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              💡 <strong>Pro Tip:</strong> Save this account number in your bank app for quick top-ups anytime!
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-[#3A0A21] mb-4">Or Pay with Card</h3>
          <button
            onClick={onCardPayment}
            className="w-full bg-[#3A0A21] text-white py-4 rounded-xl font-semibold hover:bg-[#5A1331] transition"
          >
            Pay with Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFundsScreen;