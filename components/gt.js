'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, ID, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';

export default function Confirm() { 
  const router = useRouter();
  const { checkSession } = useAuth();
  const Processed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (Processed.current) return;
   
    const verifySession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const secret = urlParams.get('secret');
      const role = urlParams.get('role');
      const name = urlParams.get('name');
      
      console.log('Params:', { userId, secret, role, name });
      
      if (!userId || !secret) {
        console.warn('Missing credentials from URL');
        router.push('/login');
        return;
      }

      try {
        Processed.current = true;
        let sessionExists = false;
        let userName = name;

        try {
          const currentSession = await account.getSession('current');
          if (currentSession) {
            sessionExists = true;
            console.log('Session already exists');
          }
        } catch (e) {
          console.log('No active session found');
        }

        if (!sessionExists) {
          const session = await account.createSession({userId, secret});
          console.log('Session created:', session);
        }

        await checkSession();
           
        if (!userName) {
          try {
            const user = await account.get();
            // fallback to email username
            userName = user.name || user.email.split('@')[0];
            console.log('Using name from account:', userName);
          } catch (error) {
            console.log('Could not get user name from account:', error.message);
            // default name
            userName = `User_${userId.slice(0, 6)}`;
          }
        }
       
        // Store user role with duplicate check
        if (role) {
          await storeUserRole(userId, role, userName);
        }

        // Role-based routing after successful verification
        redirectBasedOnRole(role);
        
      } catch (error) {
        console.error('Verification failed:', error.message);
        Processed.current = false;
        router.push('/login');
      }
    };

    verifySession();
  }, []);

  const redirectBasedOnRole = (userRole) => {
    switch (userRole) {
      case 'sender':
        router.push('/dashboard');
        break;
      case 'traveler':
        router.push('/travelerdashboard'); 
        break;
      default:
        // Fallback to general dashboard
        router.push('/');
    }
  };

  const storeUserRole = async (userId, userRole, userName) => {
    try {
      console.log('Storing user role:', { userId, userRole, userName });
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
      
      if (!databaseId || !collectionId) {
        console.error('Database configuration missing. Please set your environment variables.');
        return;
      }

      try {
        const existingUser = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.equal('userId', userId)]
        );
        
        if (existingUser.documents.length > 0) {
          console.log('User role already exists, skipping creation');
          return;
        }
      } catch (error) {
        console.log('Error checking existing user, proceeding with creation:', error.message);
      }

      const userData = {
        userId: userId,
        userName: userName || 'User',
        role: userRole,
        createdAt: new Date().toISOString(),
        phone: '',
        status: userRole === 'traveler' ? 'pending' : 'verified',
      };

      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        userData
      );
     
      console.log('User role stored successfully');
    } catch (error) {
      console.error('Error storing user role:', error);
    }
  };

  return (
    <div className='h-screen text-sm text-green-400 p-20 text-center items-center justify-center'>
      Verifying please wait...
    </div>
  );
}









'use client';
import  { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, DollarSign, Send, ArrowLeft, Copy, Check } from 'lucide-react';

const Payment = () => {
  const [activeScreen, setActiveScreen] = useState('wallet');
  const [balance, setBalance] = useState(50000);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLowBalanceAlert, setShowLowBalanceAlert] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock transaction data
  const transactions = [
    { id: 1, type: 'credit', amount: 10000, description: 'Wallet Top-up', date: '2025-01-15', status: 'completed' },
    { id: 2, type: 'debit', amount: 5000, description: 'Delivery Payment', date: '2025-01-14', status: 'completed' },
    { id: 3, type: 'credit', amount: 15000, description: 'Delivery Earnings', date: '2025-01-13', status: 'completed' },
    { id: 4, type: 'debit', amount: 3000, description: 'Service Fee', date: '2025-01-12', status: 'completed' },
    { id: 5, type: 'credit', amount: 8000, description: 'Wallet Top-up', date: '2025-01-11', status: 'pending' }
  ];

  // Mock virtual account details
  const virtualAccount = {
    accountNumber: '8012345678',
    bankName: 'Wema Bank',
    accountName: 'John Doe - TravelSend'
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Wallet Screen
  const WalletScreen = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#3A0A21]">My Wallet</h1>
          <Wallet className="w-6 h-6 text-[#3A0A21]" />
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#3A0A21] to-[#5A1331] rounded-2xl p-6 mb-6 shadow-xl">
          <p className="text-white/80 text-sm mb-2">Available Balance</p>
          <h2 className="text-4xl font-bold text-white mb-6">{formatCurrency(balance)}</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveScreen('addFunds')}
              className="flex-1 bg-white text-[#3A0A21] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <Plus className="w-5 h-5" />
              Add Funds
            </button>
            <button
              onClick={() => setActiveScreen('payout')}
              className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition backdrop-blur"
            >
              <Send className="w-5 h-5" />
              Payout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-600">Total Credits</p>
            </div>
            <p className="text-xl font-bold text-[#3A0A21]">{formatCurrency(33000)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-red-600" />
              <p className="text-sm text-gray-600">Total Debits</p>
            </div>
            <p className="text-xl font-bold text-[#3A0A21]">{formatCurrency(8000)}</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#3A0A21]">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.map((txn) => (
              <div key={txn.id} className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {txn.type === 'credit' ? (
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#3A0A21]">{txn.description}</p>
                  <p className="text-sm text-gray-500">{txn.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                  {txn.status === 'pending' ? (
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <Clock className="w-3 h-3" />
                      Pending
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Add Funds Screen
  const AddFundsScreen = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setActiveScreen('wallet')}
          className="flex items-center gap-2 text-[#3A0A21] mb-6 hover:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Wallet
        </button>

        <h1 className="text-2xl font-bold text-[#3A0A21] mb-6">Add Funds</h1>

        {/* Virtual Account Card */}
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

        {/* Alternative Payment Option */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-[#3A0A21] mb-4">Or Pay with Card</h3>
          <button
            onClick={() => {
              // Simulate Monnify payment
              setTimeout(() => {
                setShowSuccessModal(true);
                setBalance(prev => prev + 10000);
              }, 2000);
            }}
            className="w-full bg-[#3A0A21] text-white py-4 rounded-xl font-semibold hover:bg-[#5A1331] transition"
          >
            Pay with Card
          </button>
        </div>
      </div>
    </div>
  );

  // Payout Screen
  const PayoutScreen = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayout = () => {
      const payoutAmount = parseFloat(amount);
      if (payoutAmount > balance) {
        setShowLowBalanceAlert(true);
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setBalance(prev => prev - payoutAmount);
        setShowSuccessModal(true);
        setLoading(false);
        setAmount('');
      }, 2000);
    };

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setActiveScreen('wallet')}
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
              onClick={handlePayout}
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

  // Success Modal
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#3A0A21] mb-2">Success!</h3>
        <p className="text-gray-600 mb-6">Your transaction was completed successfully</p>
        <button
          onClick={() => {
            setShowSuccessModal(false);
            setActiveScreen('wallet');
          }}
          className="w-full bg-[#3A0A21] text-white py-3 rounded-xl font-semibold hover:bg-[#5A1331] transition"
        >
          Done
        </button>
      </div>
    </div>
  );

  // Low Balance Alert
  const LowBalanceAlert = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-[#3A0A21] mb-2">Insufficient Balance</h3>
        <p className="text-gray-600 mb-6">You don't have enough funds in your wallet to complete this transaction</p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLowBalanceAlert(false)}
            className="flex-1 bg-gray-100 text-[#3A0A21] py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowLowBalanceAlert(false);
              setActiveScreen('addFunds');
            }}
            className="flex-1 bg-[#3A0A21] text-white py-3 rounded-xl font-semibold hover:bg-[#5A1331] transition"
          >
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {activeScreen === 'wallet' && <WalletScreen />}
      {activeScreen === 'addFunds' && <AddFundsScreen />}
      {activeScreen === 'payout' && <PayoutScreen />}
      {showSuccessModal && <SuccessModal />}
      {showLowBalanceAlert && <LowBalanceAlert />}
    </div>
  );
};

export default Payment;






