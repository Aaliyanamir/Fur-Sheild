const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/services/vet.service.js', 'utf8');

const str = `
const updateWalkin = async (id, payload) => {
  try {
    const response = await api.patch('/vethub/queue/' + id + '/walkin', payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update patient' };
  }
};
`;

code = code.replace(/const vetService = \{/, str + '\nconst vetService = {\n  updateWalkin,');

fs.writeFileSync('d:/Pet-Care/frontend/src/services/vet.service.js', code);
