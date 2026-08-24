import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Heart, Stethoscope, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('owner');
  const [email, setEmail] = useState('alex.owner@furshield.com');
  const [password, setPassword] = useState('password123');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'owner') setEmail('alex.owner@furshield.com');
    if (role === 'vet') setEmail('dr.connor@furshield.com');
    if (role === 'shelter') setEmail('contact@happytails.org');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    login({
      name: selectedRole === 'owner' ? 'Alex Johnson' : selectedRole === 'vet' ? 'Dr. Sarah Connor' : 'Happy Tails Shelter',
      email: email,
      role: selectedRole
    });

    if (selectedRole === 'owner') navigate('/owner-dashboard');
    else if (selectedRole === 'vet') navigate('/vet-dashboard');
    else if (selectedRole === 'shelter') navigate('/shelter-dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-brand-dark text-white p-3.5 rounded-2xl shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign In to FurShield</h2>
          <p className="text-xs text-slate-500 font-medium">Select your portal role to access your dashboard</p>
        </div>

        {/* Custom Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-bg-soft p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleChange('owner')}
            className={`py-2.5 px-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'owner' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Pet Owner</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('vet')}
            className={`py-2.5 px-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'vet' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Veterinarian</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('shelter')}
            className={`py-2.5 px-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'shelter' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Shelter</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-dark text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-dark text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-dark hover:bg-brand-darker text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Sign In as {selectedRole.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-brand-dark hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
