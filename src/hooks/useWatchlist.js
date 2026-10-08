import { useEffect } from 'react';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { useMarketStore } from '../store/useMarketStore';
import { STOCKS_MAP } from '../constants/stocks';

export function useWatchlist() {
  const {
    watchlists,
    activeWatchlistId,
    isLoading,
    error,
    fetchWatchlists,
    setActiveWatchlist,
    addStockToWatchlist,
    removeStockFromWatchlist,
    createWatchlist,
  } = useWatchlistStore();

  const prices = useMarketStore(state => state.prices);

  useEffect(() => {
    if (watchlists.length === 0) {
      fetchWatchlists();
    }
  }, [fetchWatchlists, watchlists.length]);

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0] || null;

  // Enrich symbols with stock details and live prices
  const activeItems = (activeWatchlist?.symbols || []).map(symbol => {
    const meta = STOCKS_MAP[symbol] || {
      symbol,
      name: symbol,
      exchange: 'NSE',
      sector: 'Equity',
    };
    const live = prices[symbol] || {};
    return {
      ...meta,
      ...live,
    };
  });

  return {
    watchlists,
    activeWatchlist,
    activeWatchlistId,
    items: activeItems,
    isLoading,
    error,
    setActiveWatchlist,
    addStock: addStockToWatchlist,
    removeStock: removeStockFromWatchlist,
    createWatchlist,
  };
}
