import React from 'react';
import { Wallet, ArrowDownRight, Plus, Send } from 'lucide-react';
// import TransactionList from './TransactionList';

const WalletScreen = ({ balance, onAddFunds, onPayout, transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const totalCredits = transactions
    .filter(tx => tx.type === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalDebits = transactions
    .filter(tx => tx.type === 'debit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#3A0A21]">My Wallet</h1>
          <Wallet className="w-6 h-6 text-[#3A0A21]" />
        </div>

        <div className="bg-gradient-to-br from-[#3A0A21] to-[#5A1331] rounded-2xl p-6 mb-6 shadow-xl">
          <p className="text-white/80 text-sm mb-2">Available Balance</p>
          <h2 className="text-4xl font-bold text-white mb-6">{formatCurrency(balance)}</h2>
          <div className="flex gap-3">
            <button
              onClick={onAddFunds}
              className="flex-1 bg-white text-[#3A0A21] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <Plus className="w-5 h-5" />
              Add Funds
            </button>
            <button
              onClick={onPayout}
              className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition backdrop-blur"
            >
              <Send className="w-5 h-5" />
              Payout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-600">Total Credits</p>
            </div>
            <p className="text-xl font-bold text-[#3A0A21]">{formatCurrency(totalCredits)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-red-600" />
              <p className="text-sm text-gray-600">Total Debits</p>
            </div>
            <p className="text-xl font-bold text-[#3A0A21]">{formatCurrency(totalDebits)}</p>
          </div>
        </div>

        {/* <TransactionList transactions={transactions} /> */}
      </div>
    </div>
  );
};

export default WalletScreen;