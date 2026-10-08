import axiosInstance from './axiosInstance';
import { mockDb } from '../mocks/mockDb';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));

export const watchlistApi = {
  async getWatchlists() {
    if (USE_MOCK) {
      await delay(200);
      return { data: mockDb.getWatchlists() };
    }
    return await axiosInstance.get('/watchlist');
  },

  async addStock(watchlistId, symbol) {
    if (USE_MOCK) {
      await delay(200);
      const updated = mockDb.addStockToWatchlist(watchlistId, symbol);
      return { data: updated };
    }
    return await axiosInstance.post(`/watchlist/${symbol}`, { watchlistId });
  },

  async removeStock(watchlistId, symbol) {
    if (USE_MOCK) {
      await delay(200);
      const updated = mockDb.removeStockFromWatchlist(watchlistId, symbol);
      return { data: updated };
    }
    return await axiosInstance.delete(`/watchlist/${symbol}`, { data: { watchlistId } });
  },

  async createWatchlist(name) {
    if (USE_MOCK) {
      await delay(200);
      const lists = mockDb.getWatchlists();
      const newList = {
        id: `wl_${Date.now()}`,
        name,
        symbols: [],
      };
      lists.push(newList);
      mockDb.saveWatchlists(lists);
      return { data: newList };
    }
    return await axiosInstance.post('/watchlist/create', { name });
  }
};
