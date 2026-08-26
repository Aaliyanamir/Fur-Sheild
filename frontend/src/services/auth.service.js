import api from './api';

const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email: email.toLowerCase(), password });
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed. Please try again.' };
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error; // Let context handle this
  }
};

const register = async (name, email, password, role = 'OWNER') => {
  try {
    const response = await api.post('/auth/register', { name, email: email.toLowerCase(), password, role });
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Registration failed.' };
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/me', profileData);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Profile update failed.' };
  }
};

const authService = { login, register, logout, getProfile, updateProfile };

export default authService;
