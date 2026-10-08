import {
  INITIAL_USER,
  INITIAL_WATCHLISTS,
  INITIAL_HOLDINGS,
  INITIAL_POSITIONS,
  INITIAL_ORDERS,
  INITIAL_FUNDS,
} from './mockData';
import { storage } from '../utils/storage';

const DB_KEYS = {
  USER: 'apex_db_user',
  WATCHLISTS: 'apex_db_watchlists',
  HOLDINGS: 'apex_db_holdings',
  POSITIONS: 'apex_db_positions',
  ORDERS: 'apex_db_orders',
  FUNDS: 'apex_db_funds',
};

class MockDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!storage.get(DB_KEYS.USER)) storage.set(DB_KEYS.USER, INITIAL_USER);
    if (!storage.get(DB_KEYS.WATCHLISTS)) storage.set(DB_KEYS.WATCHLISTS, INITIAL_WATCHLISTS);
    if (!storage.get(DB_KEYS.HOLDINGS)) storage.set(DB_KEYS.HOLDINGS, INITIAL_HOLDINGS);
    if (!storage.get(DB_KEYS.POSITIONS)) storage.set(DB_KEYS.POSITIONS, INITIAL_POSITIONS);
    if (!storage.get(DB_KEYS.ORDERS)) storage.set(DB_KEYS.ORDERS, INITIAL_ORDERS);
    if (!storage.get(DB_KEYS.FUNDS)) storage.set(DB_KEYS.FUNDS, INITIAL_FUNDS);
  }

  // --- Auth ---
  getUser() {
    return storage.get(DB_KEYS.USER, INITIAL_USER);
  }

  updateUser(updates) {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    storage.set(DB_KEYS.USER, updated);
    return updated;
  }

  // --- Watchlists ---
  getWatchlists() {
    return storage.get(DB_KEYS.WATCHLISTS, INITIAL_WATCHLISTS);
  }

  saveWatchlists(lists) {
    storage.set(DB_KEYS.WATCHLISTS, lists);
  }

  addStockToWatchlist(watchlistId, symbol) {
    const lists = this.getWatchlists();
    const target = lists.find(l => l.id === watchlistId) || lists[0];
    if (target && !target.symbols.includes(symbol)) {
      target.symbols.push(symbol);
      this.saveWatchlists(lists);
    }
    return lists;
  }

  removeStockFromWatchlist(watchlistId, symbol) {
    const lists = this.getWatchlists();
    const target = lists.find(l => l.id === watchlistId) || lists[0];
    if (target) {
      target.symbols = target.symbols.filter(s => s !== symbol);
      this.saveWatchlists(lists);
    }
    return lists;
  }

  // --- Orders ---
  getOrders() {
    return storage.get(DB_KEYS.ORDERS, INITIAL_ORDERS);
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: `ord_${Date.now()}`,
      status: orderData.orderType === 'MARKET' ? 'EXECUTED' : 'OPEN',
      placedAt: new Date().toISOString(),
      executedPrice: orderData.orderType === 'MARKET' ? orderData.price : null,
      ...orderData,
    };
    orders.unshift(newOrder);
    storage.set(DB_KEYS.ORDERS, orders);

    // If executed immediately (MARKET order), update Holdings or Positions and Funds!
    if (newOrder.status === 'EXECUTED') {
      this.handleExecutedOrder(newOrder);
    }

    return newOrder;
  }

  modifyOrder(orderId, updates) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1 && orders[index].status === 'OPEN') {
      orders[index] = { ...orders[index], ...updates };
      storage.set(DB_KEYS.ORDERS, orders);
      return orders[index];
    }
    throw new Error('Order cannot be modified or not found');
  }

  cancelOrder(orderId) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1 && orders[index].status === 'OPEN') {
      orders[index].status = 'CANCELLED';
      storage.set(DB_KEYS.ORDERS, orders);
      return orders[index];
    }
    throw new Error('Order cannot be cancelled or not found');
  }

  handleExecutedOrder(order) {
    const funds = this.getFunds();
    const cost = order.quantity * order.price;

    if (order.side === 'BUY') {
      funds.availableBalance = Math.max(0, funds.availableBalance - cost);
    } else {
      funds.availableBalance += cost;
    }
    funds.totalBalance = funds.availableBalance + funds.usedMargin;
    storage.set(DB_KEYS.FUNDS, funds);

    if (order.product === 'CNC') {
      // Long-term Holdings
      const holdings = this.getHoldings();
      const existing = holdings.find(h => h.symbol === order.symbol);
      if (order.side === 'BUY') {
        if (existing) {
          const totalQty = existing.quantity + order.quantity;
          const totalCost = (existing.quantity * existing.avgPrice) + cost;
          existing.avgPrice = +(totalCost / totalQty).toFixed(2);
          existing.quantity = totalQty;
        } else {
          holdings.push({
            symbol: order.symbol,
            quantity: order.quantity,
            avgPrice: order.price,
            ltp: order.price,
            prevClose: order.price,
          });
        }
      } else {
        // SELL
        if (existing) {
          existing.quantity = Math.max(0, existing.quantity - order.quantity);
        }
      }
      storage.set(DB_KEYS.HOLDINGS, holdings.filter(h => h.quantity > 0));
    } else {
      // MIS (Intraday Positions)
      const positions = this.getPositions();
      positions.push({
        id: `pos_${Date.now()}`,
        symbol: order.symbol,
        product: 'MIS',
        side: order.side,
        quantity: order.quantity,
        avgPrice: order.price,
        ltp: order.price,
        prevClose: order.price,
      });
      storage.set(DB_KEYS.POSITIONS, positions);
    }
  }

  // --- Holdings & Positions ---
  getHoldings() {
    return storage.get(DB_KEYS.HOLDINGS, INITIAL_HOLDINGS);
  }

  getPositions() {
    return storage.get(DB_KEYS.POSITIONS, INITIAL_POSITIONS);
  }

  // --- Funds ---
  getFunds() {
    return storage.get(DB_KEYS.FUNDS, INITIAL_FUNDS);
  }

  addFunds(amount, mode = 'UPI') {
    const funds = this.getFunds();
    const num = Number(amount);
    funds.availableBalance += num;
    funds.totalBalance += num;
    funds.transactions.unshift({
      id: `tx_${Date.now()}`,
      type: 'DEPOSIT',
      amount: num,
      mode,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      referenceId: `DEP-${Math.floor(10000000 + Math.random() * 90000000)}`,
    });
    storage.set(DB_KEYS.FUNDS, funds);
    return funds;
  }

  withdrawFunds(amount, mode = 'Bank Account') {
    const funds = this.getFunds();
    const num = Number(amount);
    if (funds.availableBalance < num) {
      throw new Error('Insufficient funds available to withdraw');
    }
    funds.availableBalance -= num;
    funds.totalBalance -= num;
    funds.transactions.unshift({
      id: `tx_${Date.now()}`,
      type: 'WITHDRAWAL',
      amount: num,
      mode,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      referenceId: `WTH-${Math.floor(10000000 + Math.random() * 90000000)}`,
    });
    storage.set(DB_KEYS.FUNDS, funds);
    return funds;
  }

  resetAll() {
    storage.set(DB_KEYS.USER, INITIAL_USER);
    storage.set(DB_KEYS.WATCHLISTS, INITIAL_WATCHLISTS);
    storage.set(DB_KEYS.HOLDINGS, INITIAL_HOLDINGS);
    storage.set(DB_KEYS.POSITIONS, INITIAL_POSITIONS);
    storage.set(DB_KEYS.ORDERS, INITIAL_ORDERS);
    storage.set(DB_KEYS.FUNDS, INITIAL_FUNDS);
  }
}

export const mockDb = new MockDatabase();
