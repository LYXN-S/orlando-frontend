import api from './api';

const procurementService = {
  list: async (status) => {
    const params = {};
    if (status && status !== 'ALL') params.status = status;
    const response = await api.get('/procurement/pos', { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },

  getById: async (id) => {
    const response = await api.get(`/procurement/pos/${id}`);
    return response.data;
  },

  createDraft: async (payload) => {
    const response = await api.post('/procurement/pos', payload);
    return response.data;
  },

  updateDraft: async (id, payload) => {
    const response = await api.put(`/procurement/pos/${id}`, payload);
    return response.data;
  },

  confirm: async (id, note = '') => {
    const response = await api.patch(`/procurement/pos/${id}/confirm`, { note });
    return response.data;
  },

  uploadAndExtract: async (file, poId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (poId) formData.append('poId', String(poId));
    const response = await api.post('/procurement/pos/upload-extract', formData);
    return response.data;
  },

  getAttachmentUrl: (attachmentId) => {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
    return `${baseURL}/procurement/pos/attachments/${attachmentId}`;
  },
};

export default procurementService;
