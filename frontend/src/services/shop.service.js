import api from './api';

const shopService = {
  getProducts: async (category = 'All', search = '') => {
    const res = await api.get(`/shop/products?category=${category}&search=${search}`);
    return res.data;
  },
  getProductById: async (id) => {
    const res = await api.get(`/shop/products/${id}`);
    return res.data;
  },
  seedProducts: async () => {
    const res = await api.post('/shop/seed');
    return res.data;
  },
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get('/orders/myorders');
    return res.data;
  }
};

export default shopService;
