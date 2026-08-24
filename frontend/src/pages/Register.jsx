import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('owner');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole(role);
    login({
      name: formData.name || 'New Registered User',
      email: formData.email,
      role: role
    });

    if (role === 'owner') navigate('/owner-dashboard');
    else if (role === 'vet') navigate('/vet-dashboard');
    else if (role === 'shelter') navigate('/shelter-dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-primary-600 text-white p-3 rounded-2xl shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Create Your FurShield Account</h2>
          <p className="text-xs text-gray-500">Select your account type to register</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'owner' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Pet Owner
          </button>
          <button
            type="button"
            onClick={() => setRole('vet')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'vet' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Veterinarian
          </button>
          <button
            type="button"
            onClick={() => setRole('shelter')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'shelter' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Animal Shelter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              {role === 'owner' ? 'Full Name' : role === 'vet' ? 'Doctor / Practice Name' : 'Shelter Organization Name'}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={role === 'owner' ? 'Jane Doe' : role === 'vet' ? 'Dr. Alex Smith' : 'Haven Pet Shelter'}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street, City, State"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Register Account ({role.toUpperCase()})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
