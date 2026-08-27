import api from './api';

const adoptService = {
  getAdoptableAnimals: async () => {
    const res = await api.get('/adopt');
    return res.data;
  },
  submitAdoptionRequest: async (data) => {
    const res = await api.post('/adopt/request', data);
    return res.data;
  }
};

export default adoptService;
