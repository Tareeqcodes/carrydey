'use client';
import React, { useState } from 'react';
import { Wallet, Plus, Send, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle, Copy, CreditCard, Building2 } from 'lucide-react';

// Mock data - replace with actual Appwrite queries
const mockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  walletBalance: 25000,
  virtualAccount: {
    accountNumber: '8012345678',
    bankName: 'Wema Bank',
    accountName: 'John Doe - Monnify'
  }
};

const mockTransactions = [
  { id: '1', type: 'credit', amount: 10000, description: 'Wallet Funding', status: 'completed', date: '2025-12-07 10:30' },
  { id: '2', type: 'debit', amount: 5000, description: 'Delivery Payment - #DEL123', status: 'completed', date: '2025-12-06 14:20' },
  { id: '3', type: 'credit', amount: 15000, description: 'Delivery Earnings', status: 'completed', date: '2025-12-05 09:15' },
  { id: '4', type: 'debit', amount: 3000, description: 'Delivery Payment - #DEL456', status: 'completed', date: '2025-12-04 16:45' },
];

const WalletSystem = () => {
  const [activeScreen, setActiveScreen] = useState('wallet'); // wallet, addFunds, payout, history
  const [user] = useState(mockUser);
  const [transactions] = useState(mockTransactions);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLowBalanceAlert, setShowLowBalanceAlert] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer'); // transfer, card
  const [payoutAmount, setPayoutAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddFunds = (method) => {
    if (method === 'card') {
      // Initialize Monnify payment popup
      window.MonnifySDK?.initialize({
        amount: 10000,
        currency: "NGN",
        reference: `ref_${Date.now()}`,
        customerFullName: user.name,
        customerEmail: user.email,
        apiKey: "MK_TEST_YOUR_API_KEY",
        contractCode: "YOUR_CONTRACT_CODE",
        paymentDescription: "Wallet Funding",
        onComplete: function(response) {
          console.log('Payment Complete:', response);
          setShowSuccessModal(true);
          // Call Appwrite Function to verify and credit wallet
        },
        onClose: function() {
          console.log('Payment closed');
        }
      });
    }
  };

  const handlePayout = async () => {
    if (parseFloat(payoutAmount) > user.walletBalance) {
      setShowLowBalanceAlert(true);
      return;
    }
    // Call Appwrite Function to process payout
    console.log('Processing payout:', payoutAmount);
    setShowSuccessModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Wallet Screen
  const WalletScreen = () => (
    <div className="space-y-6 ">
      <div className="bg-gradient-to-br from-[#3A0A21] to-[#5a1031] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            <span className="text-sm opacity-90">Wallet Balance</span>
          </div>
          <Clock className="w-5 h-5 opacity-70" />
        </div>
        <div className="text-4xl font-bold mb-6">{formatCurrency(user.walletBalance)}</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveScreen('addFunds')}
            className="bg-white text-[#3A0A21] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <Plus className="w-5 h-5" />
            Add Funds
          </button>
          <button
            onClick={() => setActiveScreen('payout')}
            className="bg-white/20 backdrop-blur text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition"
          >
            <Send className="w-5 h-5" />
            Payout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <button
            onClick={() => setActiveScreen('history')}
            className="text-[#3A0A21] text-sm font-medium hover:underline"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 3).map((txn) => (
            <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {txn.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{txn.description}</p>
                  <p className="text-xs text-gray-500">{txn.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                </p>
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Add Funds Screen
  const AddFundsScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setActiveScreen('wallet')} className="text-gray-600 hover:text-gray-900">
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add Funds</h1>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => setPaymentMethod('transfer')}
          className={`p-6 rounded-2xl border-2 transition ${
            paymentMethod === 'transfer'
              ? 'border-[#3A0A21] bg-[#3A0A21]/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3A0A21] rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-gray-900">Bank Transfer</h3>
              <p className="text-sm text-gray-600">Transfer to your virtual account</p>
            </div>
            {paymentMethod === 'transfer' && (
              <CheckCircle className="w-6 h-6 text-[#3A0A21]" />
            )}
          </div>
        </button>

        <button
          onClick={() => setPaymentMethod('card')}
          className={`p-6 rounded-2xl border-2 transition ${
            paymentMethod === 'card'
              ? 'border-[#3A0A21] bg-[#3A0A21]/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3A0A21] rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-gray-900">Debit Card</h3>
              <p className="text-sm text-gray-600">Pay with your card instantly</p>
            </div>
            {paymentMethod === 'card' && (
              <CheckCircle className="w-6 h-6 text-[#3A0A21]" />
            )}
          </div>
        </button>
      </div>

      {paymentMethod === 'transfer' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Virtual Account</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Account Number</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-gray-900">{user.virtualAccount.accountNumber}</p>
                <button
                  onClick={() => copyToClipboard(user.virtualAccount.accountNumber)}
                  className="text-[#3A0A21] hover:bg-[#3A0A21]/10 p-2 rounded-lg transition"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Bank Name</p>
              <p className="text-lg font-semibold text-gray-900">{user.virtualAccount.bankName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Account Name</p>
              <p className="text-lg font-semibold text-gray-900">{user.virtualAccount.accountName}</p>
            </div>
          </div>
          {copied && (
            <div className="mt-4 bg-green-50 text-green-800 p-3 rounded-lg text-center text-sm font-medium">
              Account number copied!
            </div>
          )}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-900">
              💡 Transfer any amount to this account and your wallet will be credited automatically within seconds.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === 'card' && (
        <button
          onClick={() => handleAddFunds('card')}
          className="w-full bg-[#3A0A21] text-white py-4 rounded-xl font-semibold hover:bg-[#2a0719] transition"
        >
          Continue to Payment
        </button>
      )}
    </div>
  );

  // Payout Screen
  const PayoutScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setActiveScreen('wallet')} className="text-gray-600 hover:text-gray-900">
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Available Balance</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(user.walletBalance)}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Amount to Withdraw
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                ₦
              </span>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-semibold focus:border-[#3A0A21] focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Withdrawal to</p>
            <p className="font-semibold text-gray-900">GTBank - 0123456789</p>
            <p className="text-sm text-gray-600 mt-1">John Doe</p>
          </div>

          <button
            onClick={handlePayout}
            className="w-full bg-[#3A0A21] text-white py-4 rounded-xl font-semibold hover:bg-[#2a0719] transition"
          >
            Request Withdrawal
          </button>

          <p className="text-xs text-center text-gray-500">
            Processing time: 1-24 hours
          </p>
        </div>
      </div>
    </div>
  );

  // Transaction History Screen
  const TransactionHistoryScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setActiveScreen('wallet')} className="text-gray-600 hover:text-gray-900">
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
      </div>

      <div className="space-y-3">
        {transactions.map((txn) => (
          <div key={txn.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {txn.type === 'credit' ? (
                    <ArrowDownLeft className="w-6 h-6 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{txn.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{txn.date}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Completed</span>
                  </div>
                </div>
              </div>
              <p className={`text-lg font-bold ${
                txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Success Modal
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
        <p className="text-gray-600 mb-6">Your transaction was successful</p>
        <button
          onClick={() => {
            setShowSuccessModal(false);
            setActiveScreen('wallet');
          }}
          className="w-full bg-[#3A0A21] text-white py-3 rounded-xl font-semibold hover:bg-[#2a0719] transition"
        >
          Done
        </button>
      </div>
    </div>
  );

  // Low Balance Alert
  const LowBalanceAlert = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Insufficient Balance</h3>
        <p className="text-gray-600 mb-6">You don't have enough funds in your wallet for this transaction.</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowLowBalanceAlert(false)}
            className="py-3 rounded-xl font-semibold border-2 border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowLowBalanceAlert(false);
              setActiveScreen('addFunds');
            }}
            className="bg-[#3A0A21] text-white py-3 rounded-xl font-semibold hover:bg-[#2a0719] transition"
          >
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen mt-20 bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {activeScreen === 'wallet' && <WalletScreen />}
        {activeScreen === 'addFunds' && <AddFundsScreen />}
        {activeScreen === 'payout' && <PayoutScreen />}
        {activeScreen === 'history' && <TransactionHistoryScreen />}
        {showSuccessModal && <SuccessModal />}
        {showLowBalanceAlert && <LowBalanceAlert />}
      </div>
    </div>
  );
};

export default WalletSystem;