import api from './api';

const reviewService = {
  getReviews: async (targetId) => {
    const res = await api.get(`/reviews/${targetId}`);
    return res.data;
  },
  addReview: async (data) => {
    const res = await api.post('/reviews', data);
    return res.data;
  }
};

export default reviewService;
