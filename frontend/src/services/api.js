import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
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
      window.location.href = '/login'; // Force redirect to login on expiry
    }
    return Promise.reject(error);
  }
);

export default api;

export const fetchDashboardData = async (petId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pet: {
          id: petId,
          name: "Buddy",
          breed: "Golden Retriever",
          age: "3 Yrs 2 Mos",
          weight: "28.6 kg",
          blood: "DEA 1.1",
          image: "/images/dash-dog-1.jpg"
        },
        health: {
          activity: 78,
          sleep: 82,
          calories: 90,
          hydration: 62
        },
        chartData: [
          { month: 'May', weight: 29.5, calories: 950 },
          { month: 'Jun', weight: 29.2, calories: 920 },
          { month: 'Jul', weight: 29.0, calories: 900 },
          { month: 'Aug', weight: 28.8, calories: 880 },
          { month: 'Sep', weight: 28.7, calories: 860 },
          { month: 'Oct', weight: 28.6, calories: 850 }
        ],
        aiInsight: "Buddy's weight has stabilized at 28.6 kg, aligning perfectly with his reduced 850 kcal intake over the last 3 months. Considering his age and breed, this steady trajectory significantly reduces joint stress. Maintain current diet plan."
      });
    }, 800); // Simulate network latency
  });
};
