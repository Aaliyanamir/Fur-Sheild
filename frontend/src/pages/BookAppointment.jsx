import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar, Clock, Stethoscope, FileText, AlertCircle, Loader2, Sparkles, MapPin } from 'lucide-react';
import dashboardService from '../services/dashboard.service';

const Avatar = ({ src, alt, name, className }) => {
  const [error, setError] = useState(false);
  if (error || !src || src.includes('product-placeholder')) {
    return (
      <div className={`flex items-center justify-center font-bold text-espresso-500 bg-camel-100 ${className}`}>
        {name ? name.charAt(0).toUpperCase() : 'U'}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

export default function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);

  const [formData, setFormData] = useState({
    petId: '',
    vetId: '',
    date: '',
    time: '',
    reason: '',
    severity: 'ROUTINE'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [petsRes, vetsRes] = await Promise.all([
          dashboardService.getOwnerDashboardData(),
          dashboardService.getVets()
        ]);
        
        if (petsRes.success) setPets(petsRes.data);
        if (vetsRes.success) setVets(vetsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}:00`);
      
      const res = await dashboardService.bookAppointment({
        petId: formData.petId,
        vetId: formData.vetId,
        scheduledAt,
        reason: formData.reason,
        severity: formData.severity
      });

      if (res.success) {
        setStep(4); // Success step
      }
    } catch (error) {
      console.error(error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.petId !== '';
    if (step === 2) return formData.vetId !== '';
    if (step === 3) return formData.date !== '' && formData.time !== '' && formData.reason.trim() !== '';
    return true;
  };

  // Time slots for demo
  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camel-600" />
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="flex-1 max-w-4xl mx-auto w-full py-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-display font-black text-espresso-900 mb-4">No Pets Found</h2>
        <p className="text-espresso-500 mb-8 max-w-md">You need to register at least one pet before you can book an appointment.</p>
        <button onClick={() => navigate('/my-pets')} className="bg-camel-600 hover:bg-camel-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors">
          Go to My Pets
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full py-8 px-4 font-sans">
      
      {/* Header */}
      {step < 4 && (
        <div className="mb-10 text-center">
          <p className="text-camel-600 font-bold text-xs tracking-[0.25em] uppercase mb-2">Clinical Access</p>
          <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">Book Appointment</h1>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === i ? 'bg-espresso-900 text-white shadow-md' : step > i ? 'bg-camel-100 text-camel-600' : 'bg-white border-2 border-camel-100 text-camel-300'}`}>
                  {step > i ? <CheckCircle2 size={16} /> : i}
                </div>
                {i < 3 && <div className={`w-12 h-0.5 rounded-full ${step > i ? 'bg-camel-200' : 'bg-camel-50'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-camel-900/5 border border-camel-100 p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Select Pet */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <h2 className="text-2xl font-black text-espresso-900 mb-2">Who needs care?</h2>
              <p className="text-sm font-bold text-espresso-400 uppercase tracking-widest mb-8">Select a patient</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map(pet => (
                  <div 
                    key={pet._id} 
                    onClick={() => setFormData({ ...formData, petId: pet._id })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.petId === pet._id ? 'border-camel-500 bg-camel-50 shadow-md scale-[1.02]' : 'border-camel-100 hover:border-camel-300 hover:bg-[#FAF8F5]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar src={pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : `http://localhost:5000${pet.avatarUrl}`) : null} alt={pet.name} name={pet.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h3 className="font-black text-espresso-900 text-lg">{pet.name}</h3>
                        <p className="text-xs font-bold text-camel-600">{pet.breed || pet.species}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Select Vet */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <h2 className="text-2xl font-black text-espresso-900 mb-2">Choose a Veterinarian</h2>
              <p className="text-sm font-bold text-espresso-400 uppercase tracking-widest mb-8">Select primary care provider</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vets.map(vet => (
                  <div 
                    key={vet._id} 
                    onClick={() => setFormData({ ...formData, vetId: vet._id })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 ${formData.vetId === vet._id ? 'border-camel-500 bg-camel-50 shadow-md scale-[1.02]' : 'border-camel-100 hover:border-camel-300 hover:bg-[#FAF8F5]'}`}
                  >
                     <Avatar src={vet.avatarUrl ? (vet.avatarUrl.startsWith('http') ? vet.avatarUrl : `http://localhost:5000${vet.avatarUrl}`) : null} alt={vet.name} name={vet.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                     <div>
                       <h3 className="font-black text-espresso-900 text-lg">{vet.name}</h3>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-camel-600 mt-1">
                         <Stethoscope size={12} /> General Practice
                       </div>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-espresso-400 mt-1">
                         <MapPin size={12} /> FurShield Main Clinic
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Date, Time & Reason */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <h2 className="text-2xl font-black text-espresso-900 mb-2">Appointment Details</h2>
              <p className="text-sm font-bold text-espresso-400 uppercase tracking-widest mb-8">When and Why?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date & Time */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-espresso-900 uppercase tracking-widest mb-3">
                      <Calendar size={14} className="text-camel-500" /> Select Date
                    </label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all font-bold text-espresso-900"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-espresso-900 uppercase tracking-widest mb-3">
                      <Clock size={14} className="text-camel-500" /> Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(time => (
                        <button 
                          key={time}
                          onClick={() => setFormData({...formData, time})}
                          className={`py-2 rounded-lg text-sm font-bold border transition-colors ${formData.time === time ? 'bg-espresso-900 text-white border-espresso-900' : 'bg-white text-espresso-600 border-camel-200 hover:border-camel-400'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reason & Severity */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-espresso-900 uppercase tracking-widest mb-3">
                      <AlertCircle size={14} className="text-camel-500" /> Appointment Type
                    </label>
                    <select 
                      value={formData.severity}
                      onChange={(e) => setFormData({...formData, severity: e.target.value})}
                      className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all font-bold text-espresso-900 appearance-none"
                    >
                      <option value="ROUTINE">Routine Checkup / Vaccination</option>
                      <option value="URGENT">Urgent Concern (Sick, Minor Injury)</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-espresso-900 uppercase tracking-widest mb-3">
                      <FileText size={14} className="text-camel-500" /> Reason for visit
                    </label>
                    <textarea 
                      rows={5}
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="Please describe symptoms, behavior changes, or specific concerns..."
                      className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-display font-black text-espresso-900 mb-4 tracking-tight">Appointment Confirmed!</h2>
              <p className="text-espresso-500 mb-8 max-w-md">Your appointment has been successfully booked. We've notified the clinic and they are ready to welcome your pet.</p>
              
              <div className="flex gap-4">
                <button onClick={() => navigate('/dashboard')} className="bg-camel-600 hover:bg-camel-700 text-white px-8 py-3.5 rounded-full font-bold shadow-md transition-colors flex items-center gap-2">
                  <Sparkles size={18}/> Go to Dashboard
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="mt-auto pt-8 border-t border-camel-100 flex items-center justify-between">
            <button 
              onClick={handleBack} 
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-espresso-500 hover:bg-camel-50'}`}
            >
              <ChevronLeft size={16} /> Back
            </button>
            
            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm transition-all ${isStepValid() ? 'bg-espresso-900 hover:bg-espresso-800 text-white shadow-md' : 'bg-camel-100 text-camel-300 pointer-events-none'}`}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm transition-all ${isStepValid() && !isSubmitting ? 'bg-camel-600 hover:bg-camel-700 text-white shadow-md' : 'bg-camel-100 text-camel-300 pointer-events-none'}`}
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Booking'}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
