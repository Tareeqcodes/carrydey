'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { account, ID, OAuthProvider } from '@/lib/config/Appwriteconfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email) => {
    try {
      await account.createMagicURLToken({
        userId: ID.unique(),
        email: email,
        url: 'https://www.carrydey.tech/emailVerification',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      account.createOAuth2Session({
        provider: OAuthProvider.Google,
        success: 'https://www.carrydey.tech/oauthcallback',
        failure: 'https://www.carrydey.tech/login',
      });
    } catch (error) {
      alert('Failed to login with Google: ' + error.message);
    }
  };

  // const listSessions = async () => {
  //   try {
  //     return await account.listSessions();
  //   } catch (error) {
  //     console.error('Failed to list sessions:', error);
  //     return [];
  //   }
  // };

  // const logoutAllDevices = async () => {
  //   try {
  //     await account.deleteSessions();
  //     setUser(null);
  //     redirect('/');
  //   } catch (error) {
  //     console.error('Failed to logout all devices:', error);
  //   }
  // };
  

  // const refreshSession = async () => {
  //   try {
      
  //     const session = await account.updateSession({ sessionId: 'current' });
  //     if (session) {
  //       await checkSession();
  //     }
  //   } catch (error) {
  //     console.error('Failed to refresh session:', error);
  //   }
  // };

  const logout = async () => {
    await account.deleteSession({
      sessionId: 'current',
    });
    setUser(null);
    redirect('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
        checkSession,
        // listSessions,
        // logoutAllDevices,
        // refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
