/**
 * Resolves image URLs cleanly across Vite frontend assets (/images) and Express backend uploads (/uploads).
 */
export const getImageUrl = (url, fallback = '/images/dash-dog-1.jpg') => {
  if (!url || typeof url !== 'string' || url.trim() === '' || url.includes('placeholder')) {
    return fallback;
  }
  
  const cleanUrl = url.trim();

  // If already absolute HTTP/HTTPS URL or data URI
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) {
    return cleanUrl;
  }

  // If stored under /images/ in frontend public folder
  if (cleanUrl.startsWith('/images/')) {
    return cleanUrl;
  }

  // If stored under Express backend /uploads/
  if (cleanUrl.startsWith('/uploads/')) {
    return `http://localhost:5000${cleanUrl}`;
  }

  if (cleanUrl.startsWith('uploads/')) {
    return `http://localhost:5000/${cleanUrl}`;
  }

  // Default fallback if path is relative
  return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
};

export const getSpeciesFallback = (species) => {
  const s = (species || '').toLowerCase();
  if (s.includes('cat')) return '/images/dash-cat-1.jpg';
  if (s.includes('bird')) return '/images/signup-bird.jpg';
  return '/images/dash-dog-1.jpg';
};
