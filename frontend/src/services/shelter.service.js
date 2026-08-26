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


const addDailyLog = async (animalId, logData) => {
  const response = await api.post(`/shelter/pipeline/${animalId}/logs`, logData);
  return response.data;
};

const submitAdoptionRequest = async (requestData) => {
  const response = await api.post('/shelter/adoption-requests', requestData);
  return response.data;
};

const getAdoptionRequests = async () => {
  const response = await api.get('/shelter/adoption-requests');
  return response.data;
};

const updateAdoptionRequestStatus = async (id, status) => {
  const response = await api.patch(`/shelter/adoption-requests/${id}/status`, { status });
  return response.data;
};

const shelterService = {
  getPipeline,
  updateStatus,
  addIntake,
  updateAnimal,
  deleteAnimal,
  addDailyLog,
  submitAdoptionRequest,
  getAdoptionRequests,
  updateAdoptionRequestStatus
};

export default shelterService;
