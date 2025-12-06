'use client';
import { useState, useEffect } from 'react';
import { WalletService } from '@/lib/WalletService';
import WalletScreen from '@/components/Wallets/WalletScreen';
import AddFundsScreen from '@/components/Wallets/AddFundsScreen';
import PayoutScreen from '@/components/Wallets/PayoutScreen';
import { SuccessModal, LowBalanceAlert } from '@/components/Wallets/Modals';
import { useAuth } from '@/hooks/Authcontext';

const Payment = () => {
  const [activeScreen, setActiveScreen] = useState('wallet');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [virtualAccount, setVirtualAccount] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLowBalanceAlert, setShowLowBalanceAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch wallet data on mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // Replace with actual user ID from your auth
      const userId = user.$id;
      
      const walletResponse = await WalletService.getWallet(userId);
      if (walletResponse.success) {
        setBalance(walletResponse.balance);
      }

      // Fetch virtual account
      const accountResponse = await WalletService.getVirtualAccount(userId);
      if (accountResponse.success) {
        setVirtualAccount(accountResponse.virtualAccount);
      }
    } catch (error) { 
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = () => {
    setActiveScreen('addFunds');
  };

  const handleCardPayment = async (amount = 10000) => {
    try {
      const userId = 'user_123';
      const userEmail = 'user@example.com';
      const userName = 'John Doe';
      
      const paymentResponse = await WalletService.initializePayment(
        userId,
        amount,
        userEmail,
        userName
      );
      
      if (paymentResponse.success) {
        // Redirect to Monnify checkout
        window.location.href = paymentResponse.data.checkoutUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handlePayout = async (amount) => {
    if (amount > balance) {
      setShowLowBalanceAlert(true);
      return;
    }

    try {
      const userId = 'user_123';
      const bankCode = '058'; // GTBank code
      const accountNumber = '0123456789';
      const accountName = 'John Doe';
      
      const payoutResponse = await WalletService.createPayout(
        userId,
        amount,
        bankCode,
        accountNumber,
        accountName
      );
      
      if (payoutResponse.success) {
        setBalance(payoutResponse.newBalance);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Payout error:', error);
    }
  };

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