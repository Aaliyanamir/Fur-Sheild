import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/molecules/Navbar';
import Footer from '../components/molecules/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      if (result.role === 'SUPER_ADMIN' || result.role === 'SYSTEM_ADMIN') navigate('/admin');
      else if (result.role === 'VET') navigate('/vet');
      else if (result.role === 'SHELTER_ADMIN') navigate('/shelter');
      else navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full font-sans">
      
      {/* Split Screen Container */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-[75vh]">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <div className="w-12 h-12 bg-camel-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-camel-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#5A3825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#5A3825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9H9.01" stroke="#5A3825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9H15.01" stroke="#5A3825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-black text-espresso-900 tracking-tight mb-3">
                Welcome Back
              </h1>
              <p className="text-espresso-500 font-medium text-lg">
                Sign in to your FurShield Ecosystem.
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-50 text-red-600 px-5 py-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-camel-200 rounded-2xl pl-12 pr-12 py-4 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all text-espresso-900 shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-camel-700 transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-espresso-900 hover:bg-espresso-800 text-white px-8 py-4 rounded-2xl font-bold text-base tracking-wide transition-all shadow-[0_8px_20px_rgba(90,56,37,0.2)] hover:shadow-[0_12px_25px_rgba(90,56,37,0.3)] flex items-center justify-center gap-3 mt-2 group"
              >
                Sign In 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-camel-100 text-center">
              <p className="text-sm font-medium text-espresso-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-black text-camel-700 hover:text-camel-900 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block md:w-1/2 relative p-6 md:pl-0 md:py-12 lg:py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full h-full rounded-[40px] overflow-hidden relative shadow-2xl"
          >
            <img 
              src="/images/login-bg.jpg" 
              alt="Welcome to FurShield" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        </div>

      </main>
    </div>
  );
}



