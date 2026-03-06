import api from './api';

const billingService = {
  getMyProfiles: async () => {
    const response = await api.get('/billing-profiles/my');
    return response.data;
  },

  createProfile: async (data) => {
    const response = await api.post('/billing-profiles', data);
    return response.data;
  },

  updateProfile: async (id, data) => {
    const response = await api.put(`/billing-profiles/${id}`, data);
    return response.data;
  },

  deleteProfile: async (id) => {
    await api.delete(`/billing-profiles/${id}`);
  },
};

export default billingService;
