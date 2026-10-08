import { create } from 'zustand';
import { watchlistApi } from '../api/watchlist.api';
import toast from 'react-hot-toast';

export const useWatchlistStore = create((set, get) => ({
  watchlists: [],
  activeWatchlistId: null,
  isLoading: false,
  error: null,

  fetchWatchlists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await watchlistApi.getWatchlists();
      const lists = response.data || [];
      const currentActive = get().activeWatchlistId;
      const activeId = (currentActive && lists.some(l => l.id === currentActive))
        ? currentActive
        : lists[0]?.id || null;

      set({
        watchlists: lists,
        activeWatchlistId: activeId,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  setActiveWatchlist: (id) => {
    set({ activeWatchlistId: id });
  },

  addStockToWatchlist: async (symbol) => {
    const { activeWatchlistId } = get();
    if (!activeWatchlistId) return;

    try {
      const response = await watchlistApi.addStock(activeWatchlistId, symbol);
      set({ watchlists: response.data });
      toast.success(`${symbol} added to watchlist`);
    } catch (err) {
      toast.error(`Failed to add ${symbol}`);
    }
  },

  removeStockFromWatchlist: async (symbol) => {
    const { activeWatchlistId } = get();
    if (!activeWatchlistId) return;

    try {
      const response = await watchlistApi.removeStock(activeWatchlistId, symbol);
      set({ watchlists: response.data });
      toast.success(`${symbol} removed from watchlist`);
    } catch (err) {
      toast.error(`Failed to remove ${symbol}`);
    }
  },

  createWatchlist: async (name) => {
    if (!name || !name.trim()) return;
    try {
      const response = await watchlistApi.createWatchlist(name.trim());
      const newList = response.data;
      set((state) => ({
        watchlists: [...state.watchlists, newList],
        activeWatchlistId: newList.id,
      }));
      toast.success(`Watchlist "${name}" created`);
    } catch (err) {
      toast.error('Failed to create watchlist');
    }
  }
}));
