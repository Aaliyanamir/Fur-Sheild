import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, AlertCircle, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('OWNER');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is already authenticated, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === 'VET') navigate('/vet');
      else if (user.role === 'SHELTER_ADMIN') navigate('/shelter');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await register(name, email, password, role);
      if (data.success) {
        if (data.role === 'VET') navigate('/vet');
        else if (data.role === 'SHELTER_ADMIN') navigate('/shelter');
        else navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-camel-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent-200/30 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-camel-100 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(90,56,37,0.08)]"
      >
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-full bg-espresso-900 flex items-center justify-center shadow-lg">
            <UserPlus className="text-camel-400" size={28} />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-black text-espresso-900 mb-2">Join FurShield</h2>
          <p className="text-sm font-medium text-espresso-500">Create an account to access the ecosystem.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all shadow-sm"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all shadow-sm"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all shadow-sm appearance-none"
            >
              <option value="OWNER">Pet Owner</option>
              <option value="VET">Veterinarian</option>
              <option value="SHELTER_ADMIN">Shelter Admin</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-espresso-500">
            Already have an account? <Link to="/login" className="font-bold text-camel-600 hover:text-camel-700">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
