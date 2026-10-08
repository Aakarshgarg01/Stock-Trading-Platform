import axiosInstance from './axiosInstance';
import { mockDb } from '../mocks/mockDb';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms = 250) => new Promise(res => setTimeout(res, ms));

export const ordersApi = {
  async getOrders() {
    if (USE_MOCK) {
      await delay(200);
      return { data: mockDb.getOrders() };
    }
    return await axiosInstance.get('/orders');
  },

  async placeOrder(orderData) {
    if (USE_MOCK) {
      await delay(400);
      const newOrder = mockDb.createOrder(orderData);
      return { data: newOrder };
    }
    return await axiosInstance.post('/orders', orderData);
  },

  async modifyOrder(orderId, updates) {
    if (USE_MOCK) {
      await delay(300);
      const updated = mockDb.modifyOrder(orderId, updates);
      return { data: updated };
    }
    return await axiosInstance.patch(`/orders/${orderId}`, updates);
  },

  async cancelOrder(orderId) {
    if (USE_MOCK) {
      await delay(250);
      const cancelled = mockDb.cancelOrder(orderId);
      return { data: cancelled };
    }
    return await axiosInstance.delete(`/orders/${orderId}`);
  }
};
