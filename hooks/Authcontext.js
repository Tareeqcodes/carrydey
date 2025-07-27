'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { account, ID } from '@/lib/config/Appwriteconfig';
import Spinner from '@/components/Spinner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await account.getSession('current');
      if (session) {
        const user = await account.get();
        setUser(user);
        return;
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, role = null) => {
    try {
      const baseUrl = 'http://localhost:3000/verify';
      const verifyUrl = role ? `${baseUrl}?role=${role}` : baseUrl;
      
      await account.createMagicURLToken(
        ID.unique(),
        email,
        verifyUrl
      );    
    } catch (error) {
      alert(error.message);
    }
  };

  const loginWithGoogle = async (role = null) => {
    try {
      const baseUrl = 'http://localhost:3000/verify';
      const redirectUrl = role ? `${baseUrl}?role=${role}` : baseUrl;
      
      account.createOAuth2Session('google', "http://localhost:3000", redirectUrl);
    } catch (error) {
      alert('Failed to login with Google: ' + error.message);
    }
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    redirect('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithGoogle, 
      logout, 
      checkSession 
    }}>
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);