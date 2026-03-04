import api from './api';

const orderService = {
  submitOrder: async () => {
    const response = await api.post('/orders');
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Staff only
  getPendingOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Staff only
  evaluateOrder: async (id, approved, note = '') => {
    const response = await api.patch(`/orders/${id}/evaluate`, { approved, note });
    return response.data;
  },
};

export default orderService;
