import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UserProfile() {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        password: '' // never pre-fill password
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const dataToSubmit = { name: formData.name, phone: formData.phone };
      if (formData.password) {
        dataToSubmit.password = formData.password;
      }
      
      const response = await updateProfile(dataToSubmit);
      if (response.success) {
        setMessage('Profile updated successfully!');
        setFormData(prev => ({ ...prev, password: '' })); // clear password field
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while updating profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full pt-8 pb-16">
      
      <div className="mb-8">
        <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">Account Settings</p>
        <h1 className="text-3xl md:text-4xl font-display font-black text-espresso-900 tracking-tight">
          My Profile
        </h1>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-sm">
        
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-camel-100">
           <div className="w-20 h-20 rounded-full bg-camel-100 flex items-center justify-center text-camel-900 font-black text-2xl shadow-sm border-2 border-camel-200">
             {user?.name?.substring(0, 2).toUpperCase()}
           </div>
           <div>
             <h2 className="text-2xl font-black text-espresso-900">{user?.name}</h2>
             <div className="flex items-center gap-2 mt-1">
               <span className="inline-flex items-center justify-center px-2.5 py-1 bg-camel-200 text-camel-900 text-[10px] font-black uppercase tracking-widest rounded-full">
                 {user?.role}
               </span>
               <span className="text-sm font-bold text-espresso-500">{user?.email}</span>
             </div>
           </div>
        </div>

        {message && (
          <div className="mb-6 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-2xl text-sm font-bold border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 size={16} /> {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
               <label className="flex items-center gap-2 text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">
                 <User size={14}/> Full Name
               </label>
               <input 
                 type="text" 
                 value={formData.name} 
                 onChange={(e) => setFormData({...formData, name: e.target.value})} 
                 className="w-full bg-bg-secondary border border-camel-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all text-espresso-900" 
                 required 
               />
            </div>

            {/* Phone */}
            <div>
               <label className="flex items-center gap-2 text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">
                 <Phone size={14}/> Phone Number
               </label>
               <input 
                 type="text" 
                 value={formData.phone} 
                 onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                 className="w-full bg-bg-secondary border border-camel-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all text-espresso-900" 
                 placeholder="(555) 123-4567"
               />
            </div>

            {/* Email (Read Only) */}
            <div className="md:col-span-2">
               <label className="flex items-center gap-2 text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">
                 <Mail size={14}/> Email Address (Cannot be changed)
               </label>
               <input 
                 type="email" 
                 value={user?.email || ''} 
                 disabled
                 className="w-full bg-camel-50 border border-camel-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-espresso-400 cursor-not-allowed" 
               />
            </div>

            {/* Password */}
            <div className="md:col-span-2">
               <label className="flex items-center gap-2 text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">
                 <Lock size={14}/> New Password
               </label>
               <input 
                 type="password" 
                 value={formData.password} 
                 onChange={(e) => setFormData({...formData, password: e.target.value})} 
                 className="w-full bg-bg-secondary border border-camel-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all text-espresso-900" 
                 placeholder="Leave blank to keep current password"
               />
            </div>

          </div>

          <div className="pt-4 flex justify-end">
             <button 
               type="submit" 
               disabled={isSubmitting}
               className="bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
             >
               {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
             </button>
          </div>

        </form>
      </div>

    </div>
  );
}

