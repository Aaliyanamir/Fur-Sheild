import api from './api';

const vetService = {
  getVerifiedVets: async () => {
    const res = await api.get('/vet/list');
    return res.data;
  },
  bookAppointment: async (data) => {
    const res = await api.post('/vet/appointments', data);
    return res.data;
  },
  getUserAppointments: async () => {
    const res = await api.get('/vet/appointments/me');
    return res.data;
  },
  getVetAppointments: async () => {
    const res = await api.get('/vet/appointments');
    return res.data;
  },
  updateAppointment: async (id, data) => {
    const res = await api.put(`/vet/appointments/${id}`, data);
    return res.data;
  }
};

export default vetService;
