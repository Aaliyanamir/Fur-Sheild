import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const register = async (name, email, password, role = 'OWNER') => {
  const response = await api.post('/auth/register', { name, email, password, role });
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put('/auth/me', profileData);
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const authService = { login, register, logout, getProfile, updateProfile };

export default authService;
