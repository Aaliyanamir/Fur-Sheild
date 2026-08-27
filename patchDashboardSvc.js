const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/services/dashboard.service.js', 'utf8');

const newFunctions = `
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
`;

code = code.replace(
  "const dashboardService = {",
  newFunctions + "\nconst dashboardService = {"
);

code = code.replace(
  "deletePet\n};",
  "deletePet,\n  getVets,\n  bookAppointment,\n  getMyAppointments\n};"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/services/dashboard.service.js', code);
