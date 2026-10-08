import axiosInstance from './axiosInstance';
import { mockDb } from '../mocks/mockDb';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 250) => new Promise(res => setTimeout(res, ms));

export const fundsApi = {
  async getFunds() {
    if (USE_MOCK) {
      await delay(200);
      return { data: mockDb.getFunds() };
    }
    return await axiosInstance.get('/funds');
  },

  async addFunds(amount, mode = 'UPI') {
    if (USE_MOCK) {
      await delay(500);
      const updatedFunds = mockDb.addFunds(amount, mode);
      return { data: updatedFunds };
    }
    return await axiosInstance.post('/funds/add', { amount, mode });
  },

  async withdrawFunds(amount, mode = 'Bank Account') {
    if (USE_MOCK) {
      await delay(500);
      const updatedFunds = mockDb.withdrawFunds(amount, mode);
      return { data: updatedFunds };
    }
    return await axiosInstance.post('/funds/withdraw', { amount, mode });
  }
};
