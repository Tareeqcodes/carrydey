
// 'use client';
// import { useState, useEffect } from 'react';
// import { WalletService } from '@/lib/WalletService';
// import WalletScreen from '@/components/Wallets/WalletScreen';
// import AddFundsScreen from '@/components/Wallets/AddFundsScreen';
// import PayoutScreen from '@/components/Wallets/PayoutScreen';
// import { SuccessModal, LowBalanceAlert } from '@/components/Wallets/Modals';
// import { useAuth } from '@/hooks/Authcontext';

// const Payment = () => {
//   const [activeScreen, setActiveScreen] = useState('wallet');
//   const [balance, setBalance] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [virtualAccount, setVirtualAccount] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showLowBalanceAlert, setShowLowBalanceAlert] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   // Fetch wallet data on mount
//   useEffect(() => {
//     if (user) {
//       fetchWalletData();
//     }
//   }, [user]);

//   const fetchWalletData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const userId = user.$id;
      
//       // 1. Get wallet balance
//       const walletResponse = await WalletService.getWallet(userId);
//       console.log('Wallet response:', walletResponse);
      
//       if (walletResponse.success) {
//         setBalance(walletResponse.balance || 0);
        
//         // 2. Get virtual account if wallet exists
//         if (walletResponse.wallet) {
//           const accountResponse = await WalletService.getVirtualAccount(userId);
//           console.log('Virtual account response:', accountResponse);
          
//           if (accountResponse.success && accountResponse.virtualAccount) {
//             setVirtualAccount(accountResponse.virtualAccount);
//           }
//         }
        
//         // 3. Get transactions
//         const transactionsResponse = await WalletService.getTransactions(userId);
//         console.log('Transactions response:', transactionsResponse);
        
//         if (transactionsResponse.success) {
//           setTransactions(transactionsResponse.transactions || []);
//         }
        
//       } else {
//         // If wallet doesn't exist, create it
//         if (walletResponse.code === 'WALLET_NOT_FOUND') {
//           console.log('Wallet not found, creating new wallet...');
//           await createUserWallet();
//         } else {
//           setError(walletResponse.error || 'Failed to load wallet');
//         }
//       }
      
//     } catch (err) {
//       console.error('Error fetching wallet data:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createUserWallet = async () => {
//     try {
//       const createResponse = await WalletService.createWallet(
//         user.$id,
//         user.email,
//         user.name || 'User'
//       );
      
//       if (createResponse.success) {
//         // Retry fetching wallet data
//         fetchWalletData();
//       } else {
//         setError(createResponse.error || 'Failed to create wallet');
//       }
//     } catch (err) {
//       console.error('Error creating wallet:', err);
//       setError(err.message);
//     }
//   };

//   const handleAddFunds = () => {
//     setActiveScreen('addFunds');
//   };

//   const handleCardPayment = async (amount = 10000) => {
//     try {
//       const paymentResponse = await WalletService.initializePayment(
//         user.$id,
//         amount,
//         user.email,
//         user.name || 'User'
//       );
      
//       console.log('Card payment response:', paymentResponse);
      
//       if (paymentResponse.success) {
//         // Redirect to Monnify checkout
//         window.location.href = paymentResponse.data.checkoutUrl;
//       } else {
//         alert(`Payment error: ${paymentResponse.error}`);
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//       alert('Payment failed. Please try again.');
//     }
//   };

//   const handlePayout = async (amount) => {
//     if (amount > balance) {
//       setShowLowBalanceAlert(true);
//       return;
//     }

//     try {
//       // TODO: Get user's bank details from saved payment methods
//       const bankCode = '058'; // GTBank code
//       const accountNumber = '0123456789'; // Should come from user's saved banks
//       const accountName = user.name || 'User';
      
//       const payoutResponse = await WalletService.createPayout(
//         user.$id,
//         amount,
//         bankCode,
//         accountNumber,
//         accountName
//       );
      
//       console.log('Payout response:', payoutResponse);
      
//       if (payoutResponse.success) {
//         setBalance(payoutResponse.newBalance || (balance - amount));
//         setShowSuccessModal(true);
//         // Refresh transactions
//         fetchWalletData();
//       } else {
//         alert(`Payout failed: ${payoutResponse.error}`);
//       }
//     } catch (error) {
//       console.error('Payout error:', error);
//       alert('Payout failed. Please try again.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-[#3A0A21] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[#3A0A21]">Loading wallet...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-[#3A0A21] mb-2">Error Loading Wallet</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchWalletData}
//             className="bg-[#3A0A21] text-white px-4 py-2 rounded-lg hover:bg-[#5A1331] transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {activeScreen === 'wallet' && (
//         <WalletScreen
//           balance={balance}
//           onAddFunds={handleAddFunds}
//           onPayout={() => setActiveScreen('payout')}
//           transactions={transactions}
//         />
//       )}
      
//       {activeScreen === 'addFunds' && (
//         <AddFundsScreen
//           virtualAccount={virtualAccount}
//           onBack={() => setActiveScreen('wallet')}
//           onCardPayment={() => handleCardPayment()}
//         /> 
//       )}
      
//       {activeScreen === 'payout' && (
//         <PayoutScreen
//           balance={balance}
//           onBack={() => setActiveScreen('wallet')}
//           onPayout={handlePayout}
//         />
//       )}
      
//       {showSuccessModal && (
//         <SuccessModal onClose={() => {
//           setShowSuccessModal(false);
//           setActiveScreen('wallet');
//           fetchWalletData();
//         }} />
//       )}
      
//       {showLowBalanceAlert && (
//         <LowBalanceAlert
//           onCancel={() => setShowLowBalanceAlert(false)}
//           onAddFunds={() => {
//             setShowLowBalanceAlert(false);
//             setActiveScreen('addFunds');
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Payment;