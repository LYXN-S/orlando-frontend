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
