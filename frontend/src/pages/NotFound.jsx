import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF8F5] text-center px-6">
      <PawPrint className="text-camel-400 mb-4" size={40} />
      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-camel-600 mb-3">Error 404</p>
      <h1 className="text-5xl font-display font-black text-espresso-900 mb-3">This trail went cold.</h1>
      <p className="text-espresso-500 mb-8 max-w-md">The page you are looking for is missing — but your pets are still waiting on the other side.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="px-6 py-3 bg-espresso-900 text-white rounded-full font-bold">Back home</Link>
        <Link to="/shop" className="px-6 py-3 bg-white border border-camel-200 text-espresso-800 rounded-full font-bold">Visit shop</Link>
        <Link to="/adopt" className="px-6 py-3 bg-white border border-camel-200 text-espresso-800 rounded-full font-bold">Meet pets</Link>
      </div>
    </div>
  );
}
