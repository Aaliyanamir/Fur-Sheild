import api from './api';

const getPipeline = async () => {
  const response = await api.get('/shelter/pipeline');
  return response.data;
};

const updateStatus = async (id, status) => {
  const response = await api.patch(`/shelter/pipeline/${id}/status`, { status });
  return response.data;
};

const addIntake = async (formData) => {
  const response = await api.post('/shelter/intake', formData);
  return response.data;
};

const updateAnimal = async (id, formData) => {
  const response = await api.patch(`/shelter/pipeline/${id}`, formData);
  return response.data;
};

const deleteAnimal = async (id) => {
  const response = await api.delete(`/shelter/pipeline/${id}`);
  return response.data;
};

const shelterService = {
  getPipeline,
  updateStatus,
  addIntake,
  updateAnimal,
  deleteAnimal
};

export default shelterService;
