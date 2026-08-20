import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async (googleUserData) => {
    const { data } = await axios.post('/auth/google', googleUserData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const forgotPassword = async (email) => {
    const { data } = await axios.post('/auth/forgot-password', { email });
    return data;
  };

  const resetPassword = async (tokenParam, password) => {
    const { data } = await axios.post(`/auth/reset-password/${tokenParam}`, { password });
    return data;
  };

  const register = async (userData) => {
    const { data } = await axios.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      loginWithGoogle, 
      forgotPassword, 
      resetPassword, 
      register, 
      logout, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
