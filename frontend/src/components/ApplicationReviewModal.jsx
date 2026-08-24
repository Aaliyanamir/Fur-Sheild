import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, X, CheckCircle2, ShieldCheck, Mail, Phone, Home, Sparkles } from 'lucide-react';

const ApplicationReviewModal = ({ req, isOpen, onClose, onApprove, onFinalize }) => {
  if (!req) return null;

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
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-brand-dark text-white p-3 rounded-2xl">
                  <UserCheck className="w-6 h-6 text-brand-sage" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Application: {req.applicantName}</h3>
                  <p className="text-xs text-slate-500 font-medium">Interest in adopting <strong className="text-brand-dark">{req.petName}</strong></p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Applicant Details */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicant Email</span>
                  <span className="font-semibold text-slate-900">{req.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                  <span className="font-semibold text-slate-900">{req.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Housing Situation</span>
                  <span className="font-semibold text-slate-900">{req.housingType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Existing Pets</span>
                  <span className="font-semibold text-slate-900">{req.hasOtherPets}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Applicant Personal Note</span>
                <p className="italic text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  "{req.message}"
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close Review
              </button>

              {req.status === 'Under Review' && (
                <button
                  onClick={() => {
                    onApprove(req.id);
                    onClose();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm"
                >
                  Approve Application
                </button>
              )}

              {req.status !== 'Finalized' && (
                <button
                  onClick={() => {
                    onFinalize(req);
                    onClose();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Finalize Adoption 🎉
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationReviewModal;
