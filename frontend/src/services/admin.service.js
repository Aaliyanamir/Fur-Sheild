import api from './api';

const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getUsers: async (search = '') => {
    const response = await api.get(`/admin/users?search=${encodeURIComponent(search)}`);
    return response.data;
  },
  updateUserStatus: async (userId, action) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { action });
    return response.data;
  }
};

export default adminService;
