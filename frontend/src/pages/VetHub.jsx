import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, X, Search, FileText, Activity } from 'lucide-react';
import vetService from '../services/vet.service';

export default function VetHub() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);
  
  // Modals
  const [showPrescription, setShowPrescription] = useState(false);
  const [rxForm, setRxForm] = useState({ medication: '', dosage: '', instructions: '' });

  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const res = await vetService.getVetAppointments();
        if (res.success) setAppointments(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await vetService.updateAppointment(id, { status });
      if (res.success) {
        setAppointments(prev => prev.map(a => a._id === id ? res.data : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleIssueRx = async (e) => {
    e.preventDefault();
    try {
      const res = await vetService.updateAppointment(selectedAppt._id, { prescription: rxForm });
      if (res.success) {
        setAppointments(prev => prev.map(a => a._id === selectedAppt._id ? res.data : a));
        setShowPrescription(false);
        setRxForm({ medication: '', dosage: '', instructions: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex-1 p-8">Loading...</div>;

  return (
    <div className="flex-1 p-8 bg-[#FAF8F5]">
      <h1 className="text-3xl font-black text-espresso-900 mb-8">Clinical Queue</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Queue List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-[2rem] border border-camel-100 shadow-sm flex items-center gap-2 mb-6">
            <Search size={20} className="text-camel-400" />
            <input type="text" placeholder="Search patients..." className="bg-transparent border-none outline-none w-full text-sm" />
          </div>

          {appointments.map(appt => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={appt._id}
              onClick={() => setSelectedAppt(appt)}
              className={`p-6 rounded-[2rem] border cursor-pointer transition-colors ${selectedAppt?._id === appt._id ? 'bg-camel-900 text-white border-camel-900' : 'bg-white text-espresso-900 border-camel-100 hover:border-camel-300'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{appt.pet ? appt.pet.name : 'Unknown Pet'}</h3>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : appt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {appt.status}
                </span>
              </div>
              <p className={`text-sm mb-2 ${selectedAppt?._id === appt._id ? 'text-camel-100' : 'text-espresso-600'}`}><User size={14} className="inline mr-1"/> {appt.user?.name}</p>
              <div className="flex gap-4 text-xs font-bold">
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(appt.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {appt.timeSlot}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-2">
          {selectedAppt ? (
            <div className="bg-white rounded-[2rem] border border-camel-100 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-espresso-900">Consultation Details</h2>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateStatus(selectedAppt._id, 'CONFIRMED')} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm">Confirm</button>
                  <button onClick={() => handleUpdateStatus(selectedAppt._id, 'COMPLETED')} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm">Mark Complete</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="p-6 bg-[#FAF8F5] rounded-[1.5rem]">
                  <h4 className="text-xs font-black uppercase tracking-widest text-camel-500 mb-2">Reason for visit</h4>
                  <p className="text-espresso-800 font-medium">{selectedAppt.reason}</p>
                </div>
                <div className="p-6 bg-[#FAF8F5] rounded-[1.5rem]">
                  <h4 className="text-xs font-black uppercase tracking-widest text-camel-500 mb-2">Type</h4>
                  <p className="text-espresso-800 font-medium">{selectedAppt.type}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 border-t border-camel-100 pt-8">
                <button 
                  onClick={() => setShowPrescription(true)}
                  className="flex-1 py-4 bg-camel-50 text-camel-800 hover:bg-camel-100 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText size={18} /> Issue E-Prescription
                </button>
                <button 
                  className="flex-1 py-4 bg-camel-50 text-camel-800 hover:bg-camel-100 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Activity size={18} /> Upload Lab Results
                </button>
              </div>

              {/* Existing Prescription */}
              {selectedAppt.prescription && (
                <div className="mt-8 p-6 border-2 border-dashed border-emerald-200 bg-emerald-50 rounded-[1.5rem]">
                  <h3 className="text-lg font-black text-emerald-900 mb-4 flex items-center gap-2"><CheckCircle size={20} /> Active Prescription</h3>
                  <p className="text-sm font-bold text-emerald-800">Rx: {selectedAppt.prescription.medication}</p>
                  <p className="text-sm text-emerald-700">Dosage: {selectedAppt.prescription.dosage}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-camel-200 rounded-[2rem] text-camel-400 font-bold">
              Select an appointment from the queue to view details.
            </div>
          )}
        </div>
      </div>

      {/* E-Prescription Modal */}
      <AnimatePresence>
        {showPrescription && (
          <div className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-camel-100"
            >
              <div className="bg-camel-900 p-6 flex justify-between items-center text-white">
                <h3 className="font-black text-lg">New Digital Prescription</h3>
                <button onClick={() => setShowPrescription(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><X size={16} /></button>
              </div>
              <form onSubmit={handleIssueRx} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-espresso-800 mb-2">Medication Name</label>
                  <input required value={rxForm.medication} onChange={e => setRxForm({...rxForm, medication: e.target.value})} type="text" className="w-full p-4 bg-[#FAF8F5] border border-camel-200 rounded-2xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-espresso-800 mb-2">Dosage & Frequency</label>
                  <input required value={rxForm.dosage} onChange={e => setRxForm({...rxForm, dosage: e.target.value})} type="text" placeholder="e.g. 1 tablet twice a day" className="w-full p-4 bg-[#FAF8F5] border border-camel-200 rounded-2xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-espresso-800 mb-2">Special Instructions</label>
                  <textarea value={rxForm.instructions} onChange={e => setRxForm({...rxForm, instructions: e.target.value})} rows="3" className="w-full p-4 bg-[#FAF8F5] border border-camel-200 rounded-2xl outline-none"></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-camel-600 text-white font-black rounded-2xl shadow-md hover:bg-camel-700">Issue Prescription (PDF)</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
