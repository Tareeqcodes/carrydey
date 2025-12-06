'use client';
import { useState, useEffect } from 'react';
import { WalletService } from '@/lib/WalletService';
import WalletScreen from '@/components/WalletScreen';
import AddFundsScreen from '@/components/AddFundsScreen';
import PayoutScreen from '@/components/PayoutScreen';
import { SuccessModal, LowBalanceAlert } from '@/components/Modals';
import { useAuth } from '@/hooks/Authcontext'; // Import your auth hook

const Payment = () => {
  const [activeScreen, setActiveScreen] = useState('wallet');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [virtualAccount, setVirtualAccount] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLowBalanceAlert, setShowLowBalanceAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from auth context
  const { user } = useAuth(); // Adjust based on your auth implementation

  // Fetch wallet data on mount
  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching wallet data for user:', user);
      
      // Get or create wallet
      let walletResponse = await WalletService.getWallet(user.$id || user.id);
      console.log('Wallet response:', walletResponse);
      
      if (!walletResponse.success) {
        if (walletResponse.code === 'WALLET_NOT_FOUND') {
          console.log('Wallet not found, creating new wallet...');
          
          // Create wallet if it doesn't exist
          const createResponse = await WalletService.createWallet(
            user.$id || user.id,
            user.email,
            user.name
          );
          
          console.log('Create wallet response:', createResponse);
          
          if (createResponse.success) {
            setBalance(createResponse.wallet.balance || 0);
          } else {
            throw new Error(createResponse.error || 'Failed to create wallet');
          }
        } else {
          throw new Error(walletResponse.error || 'Failed to fetch wallet');
        }
      } else {
        setBalance(walletResponse.wallet?.balance || 0);
      }

      // Fetch transactions
      try {
        const transactionsResponse = await WalletService.getTransactions(
          user.$id || user.id, 
          50
        );
        console.log('Transactions response:', transactionsResponse);
        
        if (transactionsResponse.success) {
          setTransactions(transactionsResponse.transactions || []);
        }
      } catch (txError) {
        console.error('Failed to fetch transactions:', txError);
        // Don't fail the whole component if transactions fail
        setTransactions([]);
      }

      // Fetch virtual account
      try {
        const accountResponse = await WalletService.getVirtualAccount(
          user.$id || user.id
        );
        console.log('Virtual account response:', accountResponse);
        
        if (accountResponse.success) {
          setVirtualAccount(accountResponse.virtualAccount);
        }
      } catch (accError) {
        console.error('Failed to fetch virtual account:', accError);
        // Virtual account is optional, don't fail
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError(error.message || 'Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = () => {
    setActiveScreen('addFunds');
  };

  const handleCardPayment = async (amount = 10000) => {
    try {
      const paymentResponse = await WalletService.initializePayment(
        user.$id || user.id,
        amount,
        user.email,
        user.name
      );
      
      console.log('Payment response:', paymentResponse);
      
      if (paymentResponse.success) {
        // Redirect to Monnify checkout
        window.location.href = paymentResponse.data.checkoutUrl;
      } else {
        alert('Payment initialization failed: ' + paymentResponse.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    }
  };

  const handlePayout = async (amount, bankDetails) => {
    if (amount > balance) {
      setShowLowBalanceAlert(true);
      return;
    }

    try {
      const payoutResponse = await WalletService.createPayout(
        user.$id || user.id,
        amount,
        bankDetails.bankCode,
        bankDetails.accountNumber,
        bankDetails.accountName
      );
      
      console.log('Payout response:', payoutResponse);
      
      if (payoutResponse.success) {
        setBalance(payoutResponse.newBalance);
        setShowSuccessModal(true);
      } else {
        alert('Payout failed: ' + payoutResponse.error);
      }
    } catch (error) {
      console.error('Payout error:', error);
      alert('Payout failed: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your wallet</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3A0A21] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3A0A21]">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchWalletData}
            className="bg-[#3A0A21] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5A1331] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {activeScreen === 'wallet' && (
        <WalletScreen
          balance={balance}
          onAddFunds={handleAddFunds}
          onPayout={() => setActiveScreen('payout')}
          transactions={transactions}
        />
      )}
      
      {activeScreen === 'addFunds' && virtualAccount && (
        <AddFundsScreen
          virtualAccount={virtualAccount}
          onBack={() => setActiveScreen('wallet')}
          onCardPayment={() => handleCardPayment()}
        />
      )}
      
      {activeScreen === 'payout' && (
        <PayoutScreen
          balance={balance}
          onBack={() => setActiveScreen('wallet')}
          onPayout={handlePayout}
        />
      )}
      
      {showSuccessModal && (
        <SuccessModal onClose={() => {
          setShowSuccessModal(false);
          setActiveScreen('wallet');
          fetchWalletData(); // Refresh data
        }} />
      )}
      
      {showLowBalanceAlert && (
        <LowBalanceAlert
          onCancel={() => setShowLowBalanceAlert(false)}
          onAddFunds={() => {
            setShowLowBalanceAlert(false);
            setActiveScreen('addFunds');
          }}
        />
      )}
    </div>
  );
};

export default Payment;