'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { account, ID, OAuthProvider } from '@/lib/config/Appwriteconfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(  () => {
     checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await account.getSession({
        sessionId: 'current',
      });
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
      await account.createMagicURLToken({
        userId: ID.unique(),
        email: email,
        url: 'https://carrydey.tech/emailVerification',
      });
      alert('Magic link sent to your email!');
    } catch (error) {
      alert(error.message);
    }
  };

  const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session({
      provider: OAuthProvider.Google,
      success: 'https://carrydey.tech/Oauth2',
      failure: 'https://carrydey.tech/login',
      scopes: ['email', 'profile', 'openid'],
    });
  } catch (error) {
    alert('Failed to login with Google: ' + error.message);
  }
};

  const listSessions = async () => {
    try {
      return await account.listSessions();
    } catch (error) {
      console.error('Failed to list sessions:', error);
      return [];
    }
  };

  const logoutAllDevices = async () => {
    try {
      await account.deleteSessions();
      setUser(null);
      redirect('/');
    } catch (error) {
      console.error('Failed to logout all devices:', error);
    }
  };
  const refreshSession = async () => {
    try {
      await account.updateSession({
        sessionId: 'current',
      });
      await checkSession();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  };

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
        listSessions,
        logoutAllDevices,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
