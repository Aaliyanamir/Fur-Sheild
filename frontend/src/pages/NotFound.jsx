import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-center">
      <h1 className="text-4xl font-display text-slate-900 mb-2">404</h1>
      <p className="text-slate-500 mb-6">Clinical record not found.</p>
      <Link to="/" className="px-4 py-2 bg-forest-700 text-white rounded-lg font-medium hover:bg-forest-800 transition-colors">
        Return to Safety
      </Link>
    </div>
  );
}
