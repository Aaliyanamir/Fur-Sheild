import api from './api';

/**
 * Fetches all pets and profile data for the logged-in owner.
 */
const getOwnerDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/pets');
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch dashboard data. Please try again later.'
    };
  }
};

/**
 * Creates a new pet profile securely linked to the active user.
 * @param {Object} petData - The payload containing name, species, breed, etc.
 */
const addNewPet = async (petData) => {
  try {
    const response = await api.post('/dashboard/pets', petData);
    return response.data;
  } catch (error) {
    console.error("Error adding new pet:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create pet profile.'
    };
  }
};

/**
 * Appends new vitals (e.g., weight) to a specific pet's history.
 * @param {string} petId - The ID of the pet to update.
 * @param {Object} vitalsData - The payload (e.g., { weight: 29.5 }).
 */
const updatePetVitals = async (petId, vitalsData) => {
  try {
    const response = await api.patch(`/dashboard/pets/${petId}/vitals`, vitalsData);
    return response.data;
  } catch (error) {
    console.error("Error updating pet vitals:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update vitals.'
    };
  }
};

const updatePet = async (petId, updateData) => {
  try {
    const response = await api.put(`/dashboard/pets/${petId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating pet:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update pet profile.'
    };
  }
};

const deletePet = async (petId) => {
  try {
    const response = await api.delete(`/dashboard/pets/${petId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pet:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete pet profile.'
    };
  }
};


const getVets = async () => {
  const response = await api.get('/dashboard/vets');
  return response.data;
};

const bookAppointment = async (data) => {
  const response = await api.post('/dashboard/appointments', data);
  return response.data;
};

const getMyAppointments = async () => {
  const response = await api.get('/dashboard/appointments');
  return response.data;
};


const addVaccine = async (petId, data) => {
  const response = await api.post(`/dashboard/pets/${petId}/vaccinations`, data);
  return response.data;
};

const addDocument = async (petId, formData) => {
  const response = await api.post(`/dashboard/pets/${petId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const dashboardService = {
  getOwnerDashboardData,
  addNewPet,
  updatePetVitals,
  updatePet,
  deletePet,
  getVets,
  bookAppointment,
  getMyAppointments,
  addVaccine,
  addDocument
};

export default dashboardService;


