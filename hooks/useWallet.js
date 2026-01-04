// hooks/useWallet.js
'use client'
import { useEffect, useState } from 'react';
import { WalletService } from '@/lib/WalletService';
import { useAuth } from '@/hooks/Authcontext';

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try { 
        setLoading(true);
        const result = await WalletService.getWallet(user.$id);
        
        if (result.success) {
          setWallet(result.wallet);
        } else if (result.code === 'WALLET_NOT_FOUND') {
          // Auto-create wallet if not exists
          const createResult = await WalletService.createWallet(
            user.$id,
            user.email,
            user.name
          );
          if (createResult.success) {
            setWallet(createResult.wallet);
          }
        }
      } catch (err) {
        console.error('Wallet fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [user]);

  const refresh = async () => {
    if (user) {
      const result = await WalletService.getWallet(user.$id);
      if (result.success) {
        setWallet(result.wallet);
      }
    }
  };

  return { wallet, loading, error, refresh };
};