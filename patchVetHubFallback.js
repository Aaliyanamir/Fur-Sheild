const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', 'utf8');

const avatarComponent = `
const Avatar = ({ src, alt, name, className }) => {
  const [error, setError] = useState(false);
  
  if (error || !src || src.includes('product-placeholder')) {
    return (
      <div className={\`flex items-center justify-center font-bold text-espresso-500 bg-camel-100 \${className}\`}>
        {name ? name.charAt(0).toUpperCase() : 'U'}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};
`;

code = code.replace(
  "export default function VetHub() {",
  avatarComponent + "\nexport default function VetHub() {"
);

// 1. patient.petImage
code = code.replace(
  /<img src=\{patient\.petImage\} alt="Pet" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm relative z-10 bg-camel-50" \/>/g,
  `<Avatar src={patient.petImage} alt="Pet" name={patient.petName} className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm relative z-10 bg-camel-50" />`
);

// 2. patient.ownerImage
code = code.replace(
  /<img src=\{patient\.ownerImage\} alt="Owner" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-0 translate-y-1 bg-camel-50" \/>/g,
  `<Avatar src={patient.ownerImage} alt="Owner" name={patient.owner} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-0 translate-y-1 bg-camel-50" />`
);

// 3. activePatient.petImage
code = code.replace(
  /<img src=\{activePatient\.petImage\} className="w-full h-full object-cover" alt="Pet Cover" \/>/g,
  `<Avatar src={activePatient.petImage} alt="Pet Cover" name={activePatient.petName} className="w-full h-full object-cover" />`
);

// 4. activePatient.ownerImage
code = code.replace(
  /<img src=\{activePatient\.ownerImage\} className="w-10 h-10 rounded-full border-2 border-white\/20 ml-auto mb-1 object-cover bg-camel-50" alt="Owner" \/>/g,
  `<Avatar src={activePatient.ownerImage} alt="Owner" name={activePatient.owner} className="w-10 h-10 rounded-full border-2 border-white/20 ml-auto mb-1 object-cover bg-camel-50" />`
);

// 5. vet profile
code = code.replace(
  /\{user\?\.avatarUrl \? <img src=\{user\.avatarUrl\.startsWith\('http'\) \? user\.avatarUrl : `http:\/\/localhost:5000\$\{user\.avatarUrl\}`\} className="w-full h-full object-cover" alt="Vet" \/> : \(user\?\.name\?\.charAt\(0\) \|\| 'V'\)\}/g,
  `<Avatar src={user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : \`http://localhost:5000\${user.avatarUrl}\`) : null} name={user?.name || 'V'} className="w-full h-full object-cover" />`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', code);
