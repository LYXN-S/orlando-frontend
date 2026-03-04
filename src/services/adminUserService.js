import api from './api';

const adminUserService = {
  // ====== Staff ======
  getStaff: async () => {
    const res = await api.get('/admin/users/staff');
    return res.data;
  },

  getStaffMember: async (id) => {
    const res = await api.get(`/admin/users/staff/${id}`);
    return res.data;
  },

  createStaff: async (data) => {
    const res = await api.post('/admin/users/staff', data);
    return res.data;
  },

  updatePermissions: async (id, permissions) => {
    const res = await api.patch(`/admin/users/staff/${id}/permissions`, { permissions });
    return res.data;
  },

  deactivateStaff: async (id) => {
    await api.delete(`/admin/users/staff/${id}`);
  },

  // ====== Customers ======
  getCustomers: async () => {
    const res = await api.get('/admin/users/customers');
    return res.data;
  },

  getCustomer: async (id) => {
    const res = await api.get(`/admin/users/customers/${id}`);
    return res.data;
  },

  deactivateCustomer: async (id) => {
    await api.delete(`/admin/users/customers/${id}`);
  },
};

export default adminUserService;
