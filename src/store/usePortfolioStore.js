import { create } from 'zustand';
import { portfolioApi } from '../api/portfolio.api';
import { ordersApi } from '../api/orders.api';
import { fundsApi } from '../api/funds.api';
import toast from 'react-hot-toast';

export const usePortfolioStore = create((set, get) => ({
  holdings: [],
  positions: [],
  orders: [],
  funds: {
    availableBalance: 0,
    usedMargin: 0,
    totalBalance: 0,
    transactions: [],
  },
  isLoading: false,
  error: null,

  fetchHoldings: async () => {
    try {
      const res = await portfolioApi.getHoldings();
      set({ holdings: res.data || [] });
    } catch (err) {
      console.error('Error fetching holdings:', err);
    }
  },

  fetchPositions: async () => {
    try {
      const res = await portfolioApi.getPositions();
      set({ positions: res.data || [] });
    } catch (err) {
      console.error('Error fetching positions:', err);
    }
  },

  fetchOrders: async () => {
    try {
      const res = await ordersApi.getOrders();
      set({ orders: res.data || [] });
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  },

  fetchFunds: async () => {
    try {
      const res = await fundsApi.getFunds();
      set({ funds: res.data || {} });
    } catch (err) {
      console.error('Error fetching funds:', err);
    }
  },

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().fetchHoldings(),
        get().fetchPositions(),
        get().fetchOrders(),
        get().fetchFunds(),
      ]);
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  placeOrder: async (orderData) => {
    const { availableBalance } = get().funds;
    const estimatedCost = orderData.quantity * orderData.price;

    if (orderData.side === 'BUY' && estimatedCost > availableBalance) {
      const err = new Error(`Insufficient funds. Required: ₹${estimatedCost.toLocaleString('en-IN')}, Available: ₹${availableBalance.toLocaleString('en-IN')}`);
      toast.error(err.message);
      throw err;
    }

    try {
      const res = await ordersApi.placeOrder(orderData);
      toast.success(`${orderData.side} order for ${orderData.quantity} ${orderData.symbol} placed!`);
      // Refresh portfolio state
      await get().fetchAll();
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order';
      toast.error(msg);
      throw err;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      await ordersApi.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      await get().fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
      throw err;
    }
  },

  modifyOrder: async (orderId, updates) => {
    try {
      const res = await ordersApi.modifyOrder(orderId, updates);
      toast.success('Order updated successfully');
      await get().fetchOrders();
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Failed to modify order');
      throw err;
    }
  },

  addFunds: async (amount, mode) => {
    try {
      const res = await fundsApi.addFunds(amount, mode);
      set({ funds: res.data });
      toast.success(`₹${Number(amount).toLocaleString('en-IN')} added to your trading account!`);
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Deposit failed');
      throw err;
    }
  },

  withdrawFunds: async (amount, mode) => {
    try {
      const res = await fundsApi.withdrawFunds(amount, mode);
      set({ funds: res.data });
      toast.success(`₹${Number(amount).toLocaleString('en-IN')} payout initiated!`);
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Withdrawal failed');
      throw err;
    }
  }
}));
