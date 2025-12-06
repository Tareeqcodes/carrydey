'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { account, ID } from '@/lib/config/Appwriteconfig'; 

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
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false); 
    }
  };

  const login = async (email) => {
    try {
      await account.createMagicURLToken(
        ID.unique(),
        email,
        'http://localhost:3000/emailVerification'
      );    
      alert('Magic link sent to your email!');
    } catch (error) {
      alert(error.message);
    } 
  };

  const loginWithGoogle = async () => {
    try {
      account.createOAuth2Session(
        'google', 
        'http://localhost:3000', // success URL
        'http://localhost:3000/emailVerification' // failure URL
      );
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);