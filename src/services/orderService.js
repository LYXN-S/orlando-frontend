import api from './api';

const orderService = {
  submitOrder: async (items, billingDetails) => {
    const response = await api.post('/orders', {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      billingType: billingDetails.billingType,
      billingName: billingDetails.billingName,
      billingTin: billingDetails.billingTin || null,
      billingAddress: billingDetails.billingAddress,
      billingTerms: billingDetails.billingTerms,
      billingProfileId: billingDetails.billingProfileId || null,
    });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Staff only
  getPendingOrders: async () => {
    const response = await api.get('/orders');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  // Staff only
  evaluateOrder: async (id, approved, note = '') => {
    const response = await api.patch(`/orders/${id}/evaluate`, { approved, note });
    return response.data;
  },
};

export default orderService;
