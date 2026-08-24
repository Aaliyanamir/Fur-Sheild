import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, CheckCircle2, ShieldCheck, Activity, Award, Calendar, Weight, Tag, User } from 'lucide-react';

const PetDetailsModal = ({ pet, isOpen, onClose }) => {
  if (!pet) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={pet.avatar}
                  alt={pet.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-sage shadow-sm"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-extrabold text-slate-900">{pet.name}</h3>
                    <span className="px-3 py-1 bg-brand-light text-brand-dark text-xs font-bold rounded-full uppercase">
                      {pet.species}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">{pet.breed} • {pet.age} Years Old • {pet.gender}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Weight</span>
                <span className="text-sm font-extrabold text-slate-900">{pet.weight}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Microchip</span>
                <span className="text-xs font-bold text-slate-900 truncate block">{pet.microchipNo}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Spayed/Neutered</span>
                <span className="text-xs font-bold text-emerald-700">Yes</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Vaccines</span>
                <span className="text-xs font-bold text-emerald-700">Up-to-Date</span>
              </div>
            </div>

            {/* Records Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Health Records Summary</h4>
              <div className="space-y-2">
                {pet.timeline.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.title}</span>
                      <span className="text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-slate-600">{item.notes}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Logged by {item.doctor} • {item.clinic}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close File
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PetDetailsModal;
