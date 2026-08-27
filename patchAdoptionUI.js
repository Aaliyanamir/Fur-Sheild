const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/AdoptionCatalog.jsx', 'utf8');

code = code.replace(
  "import shelterService from '../services/shelter.service';",
  "import adoptService from '../services/adopt.service';"
);

code = code.replace(
  "const res = await shelterService.getPipeline();",
  "const res = await adoptService.getAdoptableAnimals();"
);

code = code.replace(
  "setAnimals(res.data.filter(a => a.status === 'ADOPTABLE'));",
  "setAnimals(res.data);"
);

code = code.replace(
  "const res = await shelterService.submitAdoptionRequest({ ...formData, animalId: selectedAnimal._id });",
  "const res = await adoptService.submitAdoptionRequest({ ...formData, animalId: selectedAnimal._id });"
);

// Fix potential image crashes
code = code.replace(
  /<img src=\{animal\.avatar\} alt=\{animal\.name\}/g,
  "<img src={animal.avatar?.startsWith('http') ? animal.avatar : (animal.avatar ? `http://localhost:5000${animal.avatar}` : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80')} alt={animal.name}"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/AdoptionCatalog.jsx', code);
