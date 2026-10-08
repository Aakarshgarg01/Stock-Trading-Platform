import axiosInstance from './axiosInstance';
import { mockDb } from '../mocks/mockDb';
import { storage } from '../utils/storage';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Helper to simulate network latency for realistic UX
const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

export const authApi = {
  async login(credentials) {
    if (USE_MOCK) {
      await delay(500);
      const user = mockDb.getUser();
      // Allow login with test credentials or any provided email with correct format
      const mockToken = `mock_jwt_token_${Date.now()}`;
      const authUser = {
        ...user,
        email: credentials.email || user.email,
      };
      storage.setToken(mockToken);
      storage.setUser(authUser);
      return { data: { user: authUser, token: mockToken } };
    }
    const response = await axiosInstance.post('/auth/login', credentials);
    if (response.data.token) {
      storage.setToken(response.data.token);
      storage.setUser(response.data.user);
    }
    return response;
  },

  async signup(userData) {
    if (USE_MOCK) {
      await delay(600);
      const mockToken = `mock_jwt_token_${Date.now()}`;
      const newUser = {
        id: `usr_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '+91 98765 43210',
        pan: userData.pan || 'ABCDE1234F',
        role: 'Trader (Standard)',
        createdAt: new Date().toISOString(),
        preferences: {
          orderConfirmations: true,
          riskAlerts: true,
          defaultProduct: 'CNC',
          theme: 'dark',
        }
      };
      mockDb.updateUser(newUser);
      storage.setToken(mockToken);
      storage.setUser(newUser);
      return { data: { user: newUser, token: mockToken } };
    }
    const response = await axiosInstance.post('/auth/signup', userData);
    if (response.data.token) {
      storage.setToken(response.data.token);
      storage.setUser(response.data.user);
    }
    return response;
  },

  async logout() {
    if (USE_MOCK) {
      await delay(200);
      storage.clearAuth();
      return { data: { success: true } };
    }
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      storage.clearAuth();
    }
    return { data: { success: true } };
  },

  async getMe() {
    if (USE_MOCK) {
      await delay(200);
      const token = storage.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      const user = mockDb.getUser();
      return { data: { user } };
    }
    return await axiosInstance.get('/auth/me');
  },

  async forgotPassword(email) {
    if (USE_MOCK) {
      await delay(500);
      return { data: { success: true, message: `Password reset link sent to ${email}` } };
    }
    return await axiosInstance.post('/auth/forgot-password', { email });
  },

  async updateProfile(updates) {
    if (USE_MOCK) {
      await delay(300);
      const updated = mockDb.updateUser(updates);
      storage.setUser(updated);
      return { data: { user: updated } };
    }
    return await axiosInstance.patch('/auth/profile', updates);
  }
};
