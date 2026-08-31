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
  createProduct: async (productData) => {
    // Check if productData is FormData (for file uploads) or normal object
    const res = await api.post('/shop/products', productData);
    return res.data;
  },
  updateProduct: async (id, productData) => {
    const res = await api.put(`/shop/products/${id}`, productData);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/shop/products/${id}`);
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

