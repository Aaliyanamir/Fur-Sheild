const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', 'utf8');

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

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', code);
