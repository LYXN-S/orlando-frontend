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

  getPOReviews: async (status) => {
    const params = {};
    if (status && status !== 'ALL') params.status = status;
    const response = await api.get('/po-reviews', { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getPOReviewById: async (poId) => {
    const response = await api.get(`/po-reviews/${poId}`);
    return response.data;
  },

  savePOAllocations: async (poId, allocations) => {
    const response = await api.put(`/po-reviews/${poId}/allocations`, allocations);
    return response.data;
  },

  decidePO: async (poId, approved, note = '') => {
    const response = await api.patch(`/po-reviews/${poId}/decision`, { approved, note });
    return response.data;
  },

  getWarehouseSalesSummary: async (params = {}) => {
    const response = await api.get('/reports/sales/warehouses/summary', { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getWarehouseSalesDetails: async (params = {}) => {
    const response = await api.get('/reports/sales/warehouses/details', { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },
};

export default orderService;
