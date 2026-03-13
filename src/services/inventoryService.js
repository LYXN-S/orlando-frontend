import api from './api';

const API_BASE = '/inventory';

const inventoryService = {
  getAll: async () => {
    const response = await api.get(API_BASE);
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getById: async (id) => {
    const response = await api.get(`${API_BASE}/${id}`);
    return response.data;
  },

  adjustStock: async (id, adjustment, note = '') => {
    const response = await api.patch(`${API_BASE}/${id}/adjust`, { adjustment, note });
    return response.data;
  },

  getWarehouses: async () => {
    const response = await api.get(`${API_BASE}/warehouses`);
    return response.data;
  },

  getWarehouseStocks: async (params = {}) => {
    const response = await api.get(`${API_BASE}/warehouses/stocks`, { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  stockInByWarehouse: async (productId, warehouseCode, quantity, note = '') => {
    const response = await api.post(`${API_BASE}/stock-in`, {
      productId,
      warehouseCode,
      quantity,
      note,
    });
    return response.data;
  },

  updateProductDetails: async (inventoryItemId, payload) => {
    const response = await api.patch(`${API_BASE}/${inventoryItemId}/product`, payload);
    return response.data;
  },

  getMovements: async (params = {}) => {
    const response = await api.get(`${API_BASE}/movements`, { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getDailySummary: async (params = {}) => {
    const response = await api.get(`${API_BASE}/movements/daily`, { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },
};

export default inventoryService;
