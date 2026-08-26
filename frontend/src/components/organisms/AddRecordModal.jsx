import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud, Calendar } from 'lucide-react';
import CustomSelect from '../molecules/CustomSelect';

export default function AddRecordModal({ isOpen, onClose }) {
  const [recordType, setRecordType] = useState('Vaccination Certificate');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      {/* Glassmorphic Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-espresso-900/60 backdrop-blur-sm"
      ></motion.div>

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(90,56,37,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-camel-100/50 bg-bg-secondary/50">
          <div>
            <h2 className="text-2xl font-display font-bold text-espresso-900">Add Medical Record</h2>
            <p className="text-sm font-medium text-espresso-500 mt-1">Upload lab results, prescriptions, or vet notes.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-camel-100 flex items-center justify-center text-espresso-400 hover:text-camel-600 hover:border-camel-300 hover:bg-camel-50 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-8 overflow-y-auto">
          <form className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-espresso-900 uppercase tracking-wide">Record Type</label>
                <CustomSelect 
                  options={['Vaccination Certificate', 'Lab Blood Work', 'Surgical Notes', 'General Prescription']}
                  value={recordType}
                  onChange={setRecordType}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-espresso-900 uppercase tracking-wide">Date of Visit</label>
                <div className="relative">
                  <input type="date" className="w-full bg-bg-secondary border border-camel-100 rounded-xl px-4 py-3 text-sm font-medium text-espresso-900 focus:outline-none focus:border-camel-400 focus:ring-1 focus:ring-camel-400 transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-espresso-900 uppercase tracking-wide">Veterinarian / Clinic (Optional)</label>
              <input type="text" placeholder="e.g. Dr. Mark Thorne, City Paws" className="w-full bg-bg-secondary border border-camel-100 rounded-xl px-4 py-3.5 text-sm font-medium text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:border-camel-400 focus:ring-1 focus:ring-camel-400 transition-colors" />
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-espresso-900 uppercase tracking-wide">Upload Document</label>
              <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-camel-200 bg-camel-50/50 px-6 py-10 hover:bg-camel-50 transition-colors cursor-pointer group">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-camel-100 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="text-camel-500" size={24} />
                  </div>
                  <div className="flex text-sm leading-6 text-espresso-600 justify-center">
                    <span className="relative cursor-pointer rounded-md font-bold text-camel-600 hover:text-camel-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-espresso-400 mt-1">PDF, PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-camel-100/50 bg-bg-secondary/30 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-full text-sm font-bold text-espresso-500 hover:bg-white hover:text-espresso-900 transition-colors">
            Cancel
          </button>
          <button className="px-8 py-3 rounded-full text-sm font-bold bg-camel-600 text-white hover:bg-camel-500 shadow-md shadow-camel-600/20 transition-all hover:-translate-y-0.5">
            Save Record
          </button>
        </div>

      </motion.div>
    </div>
  );
}
