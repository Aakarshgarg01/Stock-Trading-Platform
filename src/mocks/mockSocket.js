import { io } from 'socket.io-client';
import { POPULAR_STOCKS } from '../constants/stocks';
import { MARKET_INDICES } from '../constants/indices';

/**
 * Event emitter implementation for mock WebSocket
 */
class MockSocketEmitter {
  constructor() {
    this.listeners = new Map();
    this.prices = {};
    this.timer = null;
    this.subscribedSymbols = new Set();
    this.initPrices();
    this.startSimulation();
  }

  initPrices() {
    // Populate stock prices
    POPULAR_STOCKS.forEach(stock => {
      this.prices[stock.symbol] = {
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
      };
    });

    // Populate index prices
    MARKET_INDICES.forEach(idx => {
      this.prices[idx.symbol] = {
        symbol: idx.symbol,
        ltp: idx.ltp,
        prevClose: idx.prevClose,
        high: idx.high,
        low: idx.low,
        change: idx.change,
        changePercent: idx.changePercent,
        timestamp: Date.now(),
      };
    });
  }

  startSimulation() {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      const allSymbols = Object.keys(this.prices);
      // Randomly pick 2-4 symbols to simulate a tick
      const count = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...allSymbols].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      selected.forEach(symbol => {
        const item = this.prices[symbol];
        if (!item) return;

        // Small random tick variation (-0.4% to +0.4%)
        const deltaPercent = (Math.random() * 0.8 - 0.39) / 100;
        let newLtp = item.ltp * (1 + deltaPercent);
        newLtp = +(Math.round(newLtp * 20) / 20).toFixed(2); // Tick size 0.05

        const change = +(newLtp - item.prevClose).toFixed(2);
        const changePercent = +((change / item.prevClose) * 100).toFixed(2);
        const high = Math.max(item.high, newLtp);
        const low = Math.min(item.low, newLtp);
        const volume = (item.volume || 100000) + Math.floor(Math.random() * 500);

        this.prices[symbol] = {
          ...item,
          ltp: newLtp,
          change,
          changePercent,
          high,
          low,
          volume,
          timestamp: Date.now(),
        };

        const updatePayload = {
          symbol,
          ltp: newLtp,
          change,
          changePercent,
          high,
          low,
          volume,
          timestamp: Date.now(),
        };

        this.emit('price:update', updatePayload);
      });
    }, 1200);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error(`Error in listener for ${event}:`, err);
        }
      });
    }
  }

  getSnapshot(symbol) {
    return this.prices[symbol] || null;
  }

  getAllSnapshots() {
    return { ...this.prices };
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.listeners.clear();
  }
}

class SocketClientWrapper {
  constructor() {
    this.useMock = import.meta.env.VITE_USE_MOCK !== 'false';
    this.realSocket = null;
    this.mockSocket = new MockSocketEmitter();

    if (!this.useMock) {
      const url = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
      this.realSocket = io(url, {
        autoConnect: true,
        transports: ['websocket', 'polling'],
      });
    }
  }

  on(event, callback) {
    if (this.useMock) {
      return this.mockSocket.on(event, callback);
    }
    if (this.realSocket) {
      this.realSocket.on(event, callback);
      return () => this.realSocket.off(event, callback);
    }
    return () => {};
  }

  off(event, callback) {
    if (this.useMock) {
      this.mockSocket.off(event, callback);
    } else if (this.realSocket) {
      this.realSocket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.useMock) {
      this.mockSocket.emit(event, data);
    } else if (this.realSocket) {
      this.realSocket.emit(event, data);
    }
  }

  getSnapshot(symbol) {
    return this.mockSocket.getSnapshot(symbol);
  }

  getAllSnapshots() {
    return this.mockSocket.getAllSnapshots();
  }
}

export const socketService = new SocketClientWrapper();
