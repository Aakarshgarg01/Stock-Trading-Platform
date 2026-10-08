import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const { user, token } = response.data;
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success(`Welcome back, ${user.name || 'Trader'}!`);
      return user;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw err;
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signup(userData);
      const { user, token } = response.data;
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success('Account created successfully! Welcome to ApexTrader.');
      return user;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup failed';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Logout API warning:', e);
    } finally {
      storage.clearAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success('Logged out safely');
    }
  },

  checkAuth: async () => {
    const token = storage.getToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const response = await authApi.getMe();
      set({ user: response.data.user, isAuthenticated: true });
    } catch (err) {
      console.warn('Token validation failed, clearing session:', err);
      storage.clearAuth();
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  updateProfile: async (updates) => {
    try {
      const response = await authApi.updateProfile(updates);
      set({ user: response.data.user });
      toast.success('Profile updated successfully');
      return response.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
      throw err;
    }
  }
}));
