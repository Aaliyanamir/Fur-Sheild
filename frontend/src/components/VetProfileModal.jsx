import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Stethoscope, MapPin, Clock, X, Check, ShieldCheck, Building } from 'lucide-react';

const VetProfileModal = ({ isOpen, onClose }) => {
  const [profileForm, setProfileForm] = useState({
    doctorName: 'Dr. Sarah Connor, DVM',
    licenseNo: 'VET-98412-NY',
    clinicName: 'Paws & Claws Veterinary Hospital',
    clinicAddress: '128 Health Avenue, Tech City',
    specialization: 'Small Animal Internal Medicine & Surgery',
    yearsExperience: 8,
    availableSlots: 'Monday - Friday: 09:00 AM - 05:00 PM'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

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
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 border border-slate-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-brand-dark text-white p-2.5 rounded-2xl">
                  <Stethoscope className="w-5 h-5 text-brand-sage" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Veterinary Clinical Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">Update your clinic registration & credentials.</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {savedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="bg-emerald-100 text-emerald-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Clinical Credentials Saved!</h4>
                <p className="text-xs text-slate-500">Your professional profile is updated across the FurShield network.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Doctor Name & Title</label>
                  <input
                    type="text"
                    required
                    value={profileForm.doctorName}
                    onChange={(e) => setProfileForm({ ...profileForm, doctorName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">License Number</label>
                    <input
                      type="text"
                      required
                      value={profileForm.licenseNo}
                      onChange={(e) => setProfileForm({ ...profileForm, licenseNo: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Specialization</label>
                    <input
                      type="text"
                      required
                      value={profileForm.specialization}
                      onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Clinic Hospital Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.clinicName}
                    onChange={(e) => setProfileForm({ ...profileForm, clinicName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Clinic Address</label>
                  <input
                    type="text"
                    required
                    value={profileForm.clinicAddress}
                    onChange={(e) => setProfileForm({ ...profileForm, clinicAddress: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Consultation Available Hours</label>
                  <input
                    type="text"
                    required
                    value={profileForm.availableSlots}
                    onChange={(e) => setProfileForm({ ...profileForm, availableSlots: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-sm"
                  >
                    Save Credentials
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VetProfileModal;
