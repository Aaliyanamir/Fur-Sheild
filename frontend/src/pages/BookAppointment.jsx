import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, Loader2, CheckCircle2 } from 'lucide-react';
import vetService from '../services/vet.service';

export default function BookAppointment() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ vetId: '', date: '', timeSlot: '', type: 'IN_PERSON', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await vetService.getVerifiedVets();
        if (res.success) setVets(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVets();
  }, []);

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await vetService.bookAppointment(formData);
      if (res.success) setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex-1 flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-camel-600" /></div>;

  return (
    <div className="flex-1 w-full bg-[#FAF8F5] min-h-screen pb-20">
      <div className="bg-espresso-900 pt-20 pb-24 px-4 text-center">
        <h1 className="text-4xl font-display font-black text-white mb-4">Book a Vet Appointment</h1>
        <p className="text-camel-200">Expert care for your furry friend is just a few clicks away.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl border border-camel-100 p-8 md:p-12"
        >
          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-espresso-900 mb-4">Appointment Confirmed!</h2>
              <p className="text-espresso-600 mb-8">We have sent a confirmation email with details.</p>
              <button onClick={() => window.location.href = '/dashboard'} className="px-8 py-3 bg-camel-600 text-white rounded-full font-bold">Go to Dashboard</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Select Vet */}
              <div>
                <h3 className="text-xl font-bold text-espresso-900 mb-4 flex items-center gap-2"><Stethoscope className="text-camel-600"/> Select Veterinarian</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vets.map(vet => (
                    <div 
                      key={vet._id} 
                      onClick={() => setFormData({...formData, vetId: vet._id})}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${formData.vetId === vet._id ? 'border-camel-600 bg-camel-50' : 'border-camel-100 hover:border-camel-300'}`}
                    >
                      <div className="w-12 h-12 bg-camel-200 rounded-full flex items-center justify-center mb-3">
                        <User size={20} className="text-camel-800" />
                      </div>
                      <p className="font-bold text-espresso-900">{vet.name}</p>
                      <p className="text-xs text-espresso-500">General Practice</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Date & Time */}
              {formData.vetId && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 border-t border-camel-100">
                  <h3 className="text-xl font-bold text-espresso-900 mb-4 flex items-center gap-2"><CalendarIcon className="text-camel-600"/> Select Date & Time</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-espresso-800 mb-2">Date</label>
                      <input 
                        type="date" 
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full p-4 bg-[#FAF8F5] border border-camel-200 rounded-2xl focus:ring-2 focus:ring-camel-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-espresso-800 mb-2">Time Slot</label>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map(t => (
                          <button 
                            key={t} type="button"
                            onClick={() => setFormData({...formData, timeSlot: t})}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${formData.timeSlot === t ? 'bg-camel-600 text-white' : 'bg-camel-100 text-camel-800 hover:bg-camel-200'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {formData.timeSlot && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 border-t border-camel-100">
                  <h3 className="text-xl font-bold text-espresso-900 mb-4">Appointment Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-espresso-800 mb-2">Consultation Type</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full p-4 bg-[#FAF8F5] border border-camel-200 rounded-2xl outline-none"
                      >
                        <option value="IN_PERSON">In-Person Visit</option>
                        <option value="TELEHEALTH">Telehealth (Video Call)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-espresso-800 mb-2">Reason for Visit</label>
                      <textarea 
                        required rows="3"
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full p-4 bg-[#FAF8F5] border border-camel-200 rounded-2xl outline-none"
                        placeholder="Please describe your pet's symptoms or needs..."
                      ></textarea>
                    </div>
                  </div>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={!formData.vetId || !formData.date || !formData.timeSlot || !formData.reason || isSubmitting}
                className="w-full py-4 bg-espresso-900 text-white rounded-2xl font-black text-lg disabled:opacity-50 flex justify-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
