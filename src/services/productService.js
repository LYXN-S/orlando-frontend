import api from './api';

const API_BASE = '/catalog/products';

const productService = {
  getAll: async () => {
    const response = await api.get(API_BASE);
    const data = response.data;
    // Handle Spring Boot paginated responses (Page<T>) which wrap the array in { content: [...] }
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getById: async (id) => {
    const response = await api.get(`${API_BASE}/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post(API_BASE, productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`${API_BASE}/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`${API_BASE}/${id}`);
  },

  adjustStock: async (id, adjustment) => {
    const response = await api.patch(`${API_BASE}/${id}/stock`, { adjustment });
    return response.data;
  },

  uploadImage: async (productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Do NOT set Content-Type manually — the browser sets it with the correct boundary
    const response = await api.post(`${API_BASE}/${productId}/images`, formData);
    return response.data;
  },

  deleteImage: async (productId, imageId) => {
    await api.delete(`${API_BASE}/${productId}/images/${imageId}`);
  },

  getImageUrl: (productId, imageId) => {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
    return `${baseURL}/catalog/products/${productId}/images/${imageId}`;
  },
};

export default productService;
