const fs = require('fs');
const content = `import api from './api';

const getQueue = async () => {
  try {
    const response = await api.get('/vethub/queue');
    return response.data;
  } catch (error) {
    console.error("Error fetching vet queue:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch queue'
    };
  }
};

const updateStatus = async (id, status) => {
  try {
    const response = await api.patch(\`/vethub/queue/\${id}/status\`, { status });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update status'
    };
  }
};

const updateVitalsAndNotes = async (id, payload) => {
  try {
    const response = await api.patch(\`/vethub/queue/\${id}/vitals\`, payload);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update vitals/notes'
    };
  }
};

const createAppointment = async (payload) => {
  try {
    const response = await api.post('/vethub/queue', payload);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create appointment'
    };
  }
};

const deleteAppointment = async (id) => {
  try {
    const response = await api.delete(\`/vethub/queue/\${id}\`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete appointment'
    };
  }
};

const vetService = {
  getQueue,
  updateStatus,
  updateVitalsAndNotes,
  createAppointment,
  deleteAppointment
};

export default vetService;
`;
fs.writeFileSync('d:/Pet-Care/frontend/src/services/vet.service.js', content);
