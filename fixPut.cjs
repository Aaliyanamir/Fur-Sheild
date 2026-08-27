const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/services/dashboard.service.js', 'utf8');

code = code.replace("await api.put(`/dashboard/pets/${petId}`, updateData);", "await api.put(`/dashboard/pets/${petId}`, updateData, { headers: { 'Content-Type': 'multipart/form-data' } });");

fs.writeFileSync('d:/Pet-Care/frontend/src/services/dashboard.service.js', code);
