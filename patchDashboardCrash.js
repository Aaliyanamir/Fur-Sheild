const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterDashboard.jsx', 'utf8');

// 1. Move Avatar outside
code = code.replace(
  /  \/\/ Avatar Fallback inline[\s\S]*?  \};/,
  ""
);

const avatarCode = `
const Avatar = ({ src, alt, name, className }) => {
  const [error, setError] = React.useState(false);
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

code = code.replace("export default function ShelterDashboard() {", avatarCode + "export default function ShelterDashboard() {");

// 2. Fix getRelativeTime
code = code.replace(
  /  const getRelativeTime = \(dateString\) => \{[\s\S]*?  \};/,
  `  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    const diffDays = Math.round((date - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffDays, 'day');
  };`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterDashboard.jsx', code);
