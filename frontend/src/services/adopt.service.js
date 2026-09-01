import api from './api';

const adoptService = {
  getAdoptableAnimals: async () => {
    const res = await api.get('/adopt');
    return res.data;
  },
  listPetForAdoption: async (formData) => {
    const res = await api.post('/adopt/list-pet', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getMyAdoptionListings: async () => {
    const res = await api.get('/adopt/my-listings');
    return res.data;
  },
  updateMyListingStatus: async (id, status) => {
    const res = await api.patch(`/adopt/my-listings/${id}/status`, { status });
    return res.data;
  },
  deleteMyListing: async (id) => {
    const res = await api.delete(`/adopt/my-listings/${id}`);
    return res.data;
  },
  submitAdoptionRequest: async (data) => {
    const res = await api.post('/adopt/request', data);
    return res.data;
  },
  adoptPetDirect: async (petId) => {
    const res = await api.post(`/adopt/${petId}/adopt`);
    return res.data;
  }
};

export default adoptService;

