const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/services/dashboard.service.js', 'utf8');

const newServiceFuncs = `
const addVaccine = async (petId, data) => {
  const response = await api.post(\`/dashboard/pets/\${petId}/vaccinations\`, data);
  return response.data;
};

const addDocument = async (petId, formData) => {
  const response = await api.post(\`/dashboard/pets/\${petId}/documents\`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
`;

code = code.replace("const dashboardService = {", newServiceFuncs + "\nconst dashboardService = {");

code = code.replace(
  "  getMyAppointments\n};",
  "  getMyAppointments,\n  addVaccine,\n  addDocument\n};"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/services/dashboard.service.js', code);
