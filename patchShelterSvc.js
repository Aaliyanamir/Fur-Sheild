const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/services/shelter.service.js', 'utf8');

const newServiceFuncs = `
const addDailyLog = async (animalId, logData) => {
  const response = await api.post(\`/shelter/pipeline/\${animalId}/logs\`, logData);
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
  const response = await api.patch(\`/shelter/adoption-requests/\${id}/status\`, { status });
  return response.data;
};
`;

code = code.replace("const shelterService = {", newServiceFuncs + "\nconst shelterService = {");

code = code.replace(
  "  deleteAnimal\n};",
  "  deleteAnimal,\n  addDailyLog,\n  submitAdoptionRequest,\n  getAdoptionRequests,\n  updateAdoptionRequestStatus\n};"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/services/shelter.service.js', code);
