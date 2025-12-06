import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-[#3A0A21] mb-2">Success!</h3>
      <p className="text-gray-600 mb-6">Your transaction was completed successfully</p>
      <button
        onClick={onClose}
        className="w-full bg-[#3A0A21] text-white py-3 rounded-xl font-semibold hover:bg-[#5A1331] transition"
      >
        Done
      </button>
    </div>
  </div>
);

export const LowBalanceAlert = ({ onCancel, onAddFunds }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-[#3A0A21] mb-2">Insufficient Balance</h3>
      <p className="text-gray-600 mb-6">You don't have enough funds in your wallet to complete this transaction</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-[#3A0A21] py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={onAddFunds}
          className="flex-1 bg-[#3A0A21] text-white py-3 rounded-xl font-semibold hover:bg-[#5A1331] transition"
        >
          Add Funds
        </button>
      </div>
    </div>
  </div>
);