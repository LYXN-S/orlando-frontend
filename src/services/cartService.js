import api from './api';

const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (productId, quantity = 1) => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },

  updateItem: async (productId, quantity) => {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  removeItem: async (productId) => {
    await api.delete(`/cart/items/${productId}`);
  },

  clearCart: async () => {
    await api.delete('/cart');
  },
};

export default cartService;
