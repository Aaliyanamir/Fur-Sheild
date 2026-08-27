const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', 'utf8');

const badStr2 = `<img src={pet.avatarUrl || '/images/product-placeholder.jpg'} alt={pet.name} className="w-full h-full object-cover mix-blend-multiply" />`;
const goodStr2 = `<img src={pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : \`http://localhost:5000\${pet.avatarUrl}\`) : '/images/product-placeholder.jpg'} alt={pet.name} className="w-full h-full object-cover mix-blend-multiply" />`;

code = code.replace(badStr2, goodStr2);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', code);
