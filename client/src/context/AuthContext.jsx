import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aspirantai_token'));
  const [language, setLanguage] = useState(localStorage.getItem('aspirantai_lang') || 'en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          if (res.data.user.preferredLanguage) {
            setLanguage(res.data.user.preferredLanguage);
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('aspirantai_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    if (res.data.success) {
      localStorage.setItem('aspirantai_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    if (res.data.success) {
      localStorage.setItem('aspirantai_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const setSessionToken = (newToken, newUser = null) => {
    localStorage.setItem('aspirantai_token', newToken);
    setToken(newToken);
    if (newUser) {
      setUser(newUser);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem('aspirantai_token');
    setToken(null);
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/account');
    } finally {
      localStorage.removeItem('aspirantai_token');
      setToken(null);
      setUser(null);
    }
  };

  const updatePreferences = async (preferences) => {
    const res = await api.post('/onboarding/preferences', preferences);
    if (res.data.success) {
      setUser(prev => ({ ...prev, ...res.data.user }));
    }
    return res.data;
  };

  const toggleLanguage = (lang) => {
    const newLang = lang || (language === 'en' ? 'hi' : 'en');
    setLanguage(newLang);
    localStorage.setItem('aspirantai_lang', newLang);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      language,
      loading,
      login,
      signup,
      setSessionToken,
      logout,
      deleteAccount,
      updatePreferences,
      toggleLanguage,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
