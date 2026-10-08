import axiosInstance from './axiosInstance';
import { POPULAR_STOCKS, STOCKS_MAP } from '../constants/stocks';
import { socketService } from '../mocks/mockSocket';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 250) => new Promise(res => setTimeout(res, ms));

/**
 * Generate historical candlestick & line series data for Lightweight Charts
 * @param {string} symbol 
 * @param {string} range '1D' | '1W' | '1M' | '1Y'
 */
function generateMockHistory(symbol, range = '1D') {
  const stock = STOCKS_MAP[symbol] || POPULAR_STOCKS[0];
  const snapshot = socketService.getSnapshot(symbol) || stock;
  const currentPrice = snapshot.ltp || stock.ltp;

  const data = [];
  let points = 75;
  let intervalSec = 300; // 5 min for 1D
  const now = Math.floor(Date.now() / 1000);

  if (range === '1D') {
    points = 75; // Intraday 5m candles
    intervalSec = 300;
  } else if (range === '1W') {
    points = 35; // 1-hour candles
    intervalSec = 3600;
  } else if (range === '1M') {
    points = 30; // Daily candles
    intervalSec = 86400;
  } else if (range === '1Y') {
    points = 52; // Weekly candles
    intervalSec = 86400 * 7;
  }

  // Generate backward from current time
  let walkingPrice = currentPrice * (1 - (Math.random() * 0.04 - 0.02));
  const rawPoints = [];

  for (let i = points; i >= 0; i--) {
    const time = now - (i * intervalSec);
    // Random walk
    const volatility = currentPrice * 0.006;
    const change = (Math.random() - 0.49) * volatility;
    const open = walkingPrice;
    const close = +(open + change).toFixed(2);
    const high = +(Math.max(open, close) + Math.random() * volatility * 0.6).toFixed(2);
    const low = +(Math.min(open, close) - Math.random() * volatility * 0.6).toFixed(2);
    const volume = Math.floor(10000 + Math.random() * 85000);

    rawPoints.push({
      time,
      open,
      high,
      low,
      close,
      value: close, // For line charts
      volume,
    });

    walkingPrice = close;
  }

  // Adjust last candle to match current live price
  if (rawPoints.length > 0) {
    const last = rawPoints[rawPoints.length - 1];
    last.close = currentPrice;
    last.high = Math.max(last.high, currentPrice);
    last.low = Math.min(last.low, currentPrice);
    last.value = currentPrice;
  }

  return rawPoints;
}

export const stocksApi = {
  async search(query) {
    if (USE_MOCK) {
      await delay(150);
      const q = (query || '').trim().toLowerCase();
      if (!q) return { data: POPULAR_STOCKS.slice(0, 8) };

      const filtered = POPULAR_STOCKS.filter(stock => 
        stock.symbol.toLowerCase().includes(q) ||
        stock.name.toLowerCase().includes(q) ||
        stock.sector.toLowerCase().includes(q)
      );
      return { data: filtered };
    }
    return await axiosInstance.get(`/stocks/search?q=${encodeURIComponent(query)}`);
  },

  async getStock(symbol) {
    if (USE_MOCK) {
      await delay(200);
      const stock = STOCKS_MAP[symbol] || POPULAR_STOCKS[0];
      const liveSnapshot = socketService.getSnapshot(stock.symbol);
      const combined = {
        ...stock,
        ...(liveSnapshot || {}),
      };
      return { data: combined };
    }
    return await axiosInstance.get(`/stocks/${symbol}`);
  },

  async getStockHistory(symbol, range = '1D') {
    if (USE_MOCK) {
      await delay(300);
      const history = generateMockHistory(symbol, range);
      return { data: history };
    }
    return await axiosInstance.get(`/stocks/${symbol}/history?range=${range}`);
  },

  async getAllStocks() {
    if (USE_MOCK) {
      await delay(150);
      const liveSnapshots = socketService.getAllSnapshots();
      const merged = POPULAR_STOCKS.map(stock => ({
        ...stock,
        ...(liveSnapshots[stock.symbol] || {}),
      }));
      return { data: merged };
    }
    return await axiosInstance.get('/stocks');
  }
};
