import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/molecules/Navbar';
import Footer from '../components/molecules/Footer';
import { cn } from '../lib/utils';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'OWNER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await register(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        if (result.role === 'VET') navigate('/vet');
        else if (result.role === 'SHELTER_ADMIN') navigate('/shelter');
        else navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col font-sans">
      <Navbar />
      
      {/* Split Screen Container */}
      <main className="flex-1 flex flex-col lg:flex-row mt-[88px] md:mt-[104px]">
        
        {/* Left Side: Image */}
        <div className="hidden md:block md:w-1/2 relative p-6 md:pr-0 md:py-12 lg:py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full h-full rounded-[40px] overflow-hidden relative shadow-2xl"
          >
            <img 
              src="/images/signup-bird.jpg" 
              alt="Join FurShield" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <h1 className="text-4xl lg:text-5xl font-display font-black text-espresso-900 tracking-tight mb-3">
                Create Account
              </h1>
              <p className="text-espresso-500 font-medium text-lg">
                Choose your role and join FurShield.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-red-50 text-red-600 px-5 py-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                  <AlertCircle size={18} /> {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-emerald-50 text-emerald-600 px-5 py-4 rounded-2xl text-sm font-bold border border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 size={18} /> Account created successfully! Redirecting...
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Role Selection */}
              <div className="flex bg-camel-50 p-1.5 rounded-2xl mb-8">
                {['OWNER', 'VET', 'SHELTER_ADMIN'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={cn(
                      "flex-1 py-3 text-[10px] md:text-xs font-black tracking-widest uppercase rounded-xl transition-all",
                      formData.role === r 
                        ? "bg-white text-camel-900 shadow-sm border border-camel-100" 
                        : "text-espresso-400 hover:text-espresso-900"
                    )}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-camel-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all text-espresso-900 shadow-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-camel-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all text-espresso-900 shadow-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white border border-camel-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all text-espresso-900 shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={success}
                className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white px-8 py-4 rounded-2xl font-bold text-base tracking-wide transition-all shadow-[0_8px_20px_rgba(90,56,37,0.2)] hover:shadow-[0_12px_25px_rgba(90,56,37,0.3)] flex items-center justify-center gap-3 mt-4 group"
              >
                {success ? 'Success!' : 'Create Account'}
                {!success && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-camel-100 text-center">
              <p className="text-sm font-medium text-espresso-500">
                Already have an account?{' '}
                <Link to="/login" className="font-black text-camel-700 hover:text-camel-900 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}



