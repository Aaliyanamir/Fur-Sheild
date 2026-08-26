import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',

});

// Request Interceptor: Automatically attach JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global 401s (token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      
      // Only force redirect to login if they are NOT already on a public guest page
      const publicPaths = ['/login', '/signup', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;


