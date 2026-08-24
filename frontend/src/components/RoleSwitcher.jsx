import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, ChevronDown, Heart, Stethoscope, Building, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const rolesList = [
  {
    id: 'owner',
    title: 'Pet Owner',
    subtitle: 'Pet Health & Timeline',
    icon: Heart,
    color: 'text-rose-600 bg-rose-50'
  },
  {
    id: 'vet',
    title: 'Veterinarian',
    subtitle: 'Clinic Schedule & Logs',
    icon: Stethoscope,
    color: 'text-blue-600 bg-blue-50'
  },
  {
    id: 'shelter',
    title: 'Animal Shelter',
    subtitle: 'Adoptable Pets Inventory',
    icon: Building,
    color: 'text-emerald-700 bg-emerald-50'
  }
];

const RoleSwitcher = () => {
  const { role, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const currentRole = rolesList.find((r) => r.id === role) || rolesList[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (roleId) => {
    switchRole(roleId);
    setIsOpen(false);
    if (roleId === 'owner') navigate('/owner-dashboard');
    else if (roleId === 'vet') navigate('/vet-dashboard');
    else if (roleId === 'shelter') navigate('/shelter-dashboard');
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* CUSTOM ROLE SWITCHER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 transition-all shadow-sm focus:outline-none"
      >
        <UserCheck className="w-4 h-4 text-brand-dark" />
        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Demo Role:</span>
        <span className="text-brand-dark font-black">{currentRole.title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* CUSTOM DROPDOWN POPOVER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                Switch Portal Role (Competition Demo)
              </span>
            </div>

            <div className="space-y-1">
              {rolesList.map((r) => {
                const Icon = r.icon;
                const isSelected = r.id === role;

                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-brand-dark text-white shadow-sm'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20 text-white' : r.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {r.title}
                        </h4>
                        <p className={`text-[10px] font-medium ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {r.subtitle}
                        </p>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-brand-sage" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;
