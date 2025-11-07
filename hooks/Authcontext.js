'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { account } from '@/lib/config/Appwriteconfig';


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
      const baseUrl = 'http://localhost:3000/emailVerification';
      const verifyUrl = role ? `${baseUrl}?role=${role}` : baseUrl;
      
      await account.createMagicURLToken(
        email,
        verifyUrl
      );    
    } catch (error) {
      alert(error.message);
    } 
  };

  const loginWithGoogle = async (role = null) => {
    try {
      const baseUrl = 'http://localhost:3000/emailVerification';
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
     {loading ? (
      <div className="min-h-screen bg-white">
        {children}
        {/* Overlay loader instead of blocking */}
        <div className="fixed top-4 right-4">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);