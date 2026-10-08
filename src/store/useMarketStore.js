import { create } from 'zustand';
import { socketService } from '../mocks/mockSocket';
import { POPULAR_STOCKS } from '../constants/stocks';
import { MARKET_INDICES } from '../constants/indices';

export const useMarketStore = create((set, get) => ({
  prices: {}, // { [symbol]: { ltp, change, changePercent, high, low, volume, timestamp, tickDirection } }
  indices: {}, // { [symbol]: { ltp, change, changePercent, ... } }
  isListening: false,
  unsubscribeSocket: null,

  initMarketData: () => {
    if (get().isListening) return;

    // Initialize state with default data
    const initialPrices = {};
    POPULAR_STOCKS.forEach(stock => {
      initialPrices[stock.symbol] = {
        symbol: stock.symbol,
        ltp: stock.ltp,
        prevClose: stock.prevClose,
        high: stock.high,
        low: stock.low,
        open: stock.open,
        volume: stock.volume,
        change: +(stock.ltp - stock.prevClose).toFixed(2),
        changePercent: +(((stock.ltp - stock.prevClose) / stock.prevClose) * 100).toFixed(2),
        timestamp: Date.now(),
        tickDirection: null,
      };
    });

    const initialIndices = {};
    MARKET_INDICES.forEach(idx => {
      initialIndices[idx.symbol] = {
        symbol: idx.symbol,
        name: idx.name,
        ltp: idx.ltp,
        change: idx.change,
        changePercent: idx.changePercent,
        high: idx.high,
        low: idx.low,
        prevClose: idx.prevClose,
        timestamp: Date.now(),
        tickDirection: null,
      };
    });

    set({ prices: initialPrices, indices: initialIndices, isListening: true });

    // Listen to WebSocket "price:update" events
    const unsub = socketService.on('price:update', (data) => {
      const { symbol, ltp } = data;
      const state = get();

      // Check if it's an index
      if (state.indices[symbol]) {
        const prev = state.indices[symbol];
        const tickDirection = ltp > prev.ltp ? 'UP' : ltp < prev.ltp ? 'DOWN' : null;

        set((s) => ({
          indices: {
            ...s.indices,
            [symbol]: {
              ...prev,
              ...data,
              tickDirection,
            }
          }
        }));
      } else {
        // Stock
        const prev = state.prices[symbol] || {};
        const tickDirection = prev.ltp ? (ltp > prev.ltp ? 'UP' : ltp < prev.ltp ? 'DOWN' : null) : null;

        set((s) => ({
          prices: {
            ...s.prices,
            [symbol]: {
              ...prev,
              ...data,
              tickDirection,
            }
          }
        }));
      }
    });

    set({ unsubscribeSocket: unsub });
  },

  getStockPrice: (symbol) => {
    return get().prices[symbol] || null;
  },

  getIndexPrice: (symbol) => {
    return get().indices[symbol] || null;
  }
}));
