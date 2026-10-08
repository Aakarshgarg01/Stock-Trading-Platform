import axiosInstance from './axiosInstance';
import { mockDb } from '../mocks/mockDb';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));

export const portfolioApi = {
  async getHoldings() {
    if (USE_MOCK) {
      await delay(200);
      return { data: mockDb.getHoldings() };
    }
    return await axiosInstance.get('/portfolio/holdings');
  },

  async getPositions() {
    if (USE_MOCK) {
      await delay(200);
      return { data: mockDb.getPositions() };
    }
    return await axiosInstance.get('/portfolio/positions');
  }
};
