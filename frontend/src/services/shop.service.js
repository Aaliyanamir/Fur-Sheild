import api from './api';

const getProducts = async (category = 'All') => {
  let url = '/shop/products';
  if (category !== 'All') {
    url += `?category=${category}`;
  }
  const response = await api.get(url);
  return response.data;
};

const checkout = async (cartItems, shippingAddress) => {
  const response = await api.post('/shop/checkout', { cartItems, shippingAddress });
  return response.data;
};

const shopService = { getProducts, checkout };
export default shopService;
