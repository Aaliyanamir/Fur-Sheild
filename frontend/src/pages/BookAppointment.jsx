import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, Loader2, CheckCircle2, PawPrint } from 'lucide-react';
import vetService from '../services/vet.service';
import dashboardService from '../services/dashboard.service';
import { AuthContext } from '../context/AuthContext';

export default function BookAppointment() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    vetId: '',
    petId: '',
    date: '',
    timeSlot: '',
    type: 'IN_PERSON',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const DEFAULT_VETS = [
          { _id: '650000000000000000000010', name: 'Dr. Sarah Smith', specialty: 'General Practice & Small Animal Care', avatarUrl: '/images/dash-dog-1.jpg' },
          { _id: '650000000000000000000011', name: 'Dr. Ayesha Khan', specialty: 'Surgery & Orthopedics', avatarUrl: '/images/pet-1.jpg' },
          { _id: '650000000000000000000012', name: 'Dr. Daniel Park', specialty: 'Internal Medicine & Vaccination', avatarUrl: '/images/pet-2.jpg' }
        ];

        const DEFAULT_PETS = [
          { _id: '650000000000000000000020', name: 'Buddy', species: 'Dog', breed: 'Golden Retriever' },
          { _id: '650000000000000000000021', name: 'Luna', species: 'Cat', breed: 'Maine Coon' }
        ];

        const [vetRes, petRes] = await Promise.all([
          vetService.getVerifiedVets().catch(() => ({ success: false })),
          user ? dashboardService.getOwnerDashboardData().catch(() => ({ success: false })) : Promise.resolve({ success: true, data: [] })
        ]);

        if (vetRes && vetRes.success && vetRes.data && vetRes.data.length > 0) {
          setVets(vetRes.data);
        } else {
          setVets(DEFAULT_VETS);
        }

        if (petRes && petRes.success && petRes.data && petRes.data.length > 0) {
          setPets(petRes.data);
          setFormData((prev) => ({ ...prev, petId: petRes.data[0]._id }));
        } else {
          setPets(DEFAULT_PETS);
          setFormData((prev) => ({ ...prev, petId: DEFAULT_PETS[0]._id }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: '/book-vet' } });
      return;
    }

    if (!formData.petId) {
      return;
    }

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
              <p className="text-espresso-600 mb-8">Your vet appointment was successfully scheduled.</p>
              <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-camel-600 text-white rounded-full font-bold">Go to Dashboard</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-espresso-900 mb-4 flex items-center gap-2"><PawPrint className="text-camel-600"/> Select Pet</h3>
                {pets.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pets.map((pet) => (
                      <button
                        key={pet._id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, petId: pet._id }))}
                        className={`cursor-pointer rounded-[2rem] border-2 text-left transition-all overflow-hidden shadow-sm hover:shadow-lg ${formData.petId === pet._id ? 'border-camel-600 bg-camel-50 shadow-md' : 'border-camel-100 hover:border-camel-300 bg-white'}`}
                      >
                        <div className="p-5 flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-camel-200 to-camel-300 rounded-full flex items-center justify-center shadow-sm">
                            <PawPrint size={24} className="text-camel-900" />
                          </div>
                          <div className="w-full text-center">
                            <p className="font-black text-espresso-900 text-lg">{pet.name}</p>
                            <p className="text-xs font-bold text-camel-600 uppercase tracking-widest mt-1">{pet.species || 'Pet'}</p>
                            {pet.breed && <p className="text-xs text-espresso-500 mt-0.5">{pet.breed}</p>}
                          </div>
                          {formData.petId === pet._id && (
                            <div className="w-full flex items-center justify-center gap-1 text-xs font-black text-camel-700 bg-camel-100 rounded-lg py-2 mt-2">
                              ✓ Selected
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border-2 border-dashed border-camel-200 bg-camel-50 p-8 text-center">
                    <PawPrint size={32} className="text-camel-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-espresso-600">Add a pet profile to book an appointment.</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-espresso-900 mb-4 flex items-center gap-2"><Stethoscope className="text-camel-600"/> Select Veterinarian</h3>
                {vets.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vets.map(vet => (
                      <button
                        key={vet._id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, vetId: vet._id }))}
                        className={`cursor-pointer rounded-[2rem] border-2 text-left transition-all overflow-hidden shadow-sm hover:shadow-lg ${formData.vetId === vet._id ? 'border-camel-600 bg-camel-50 shadow-md' : 'border-camel-100 hover:border-camel-300 bg-white'}`}
                      >
                        <div className="p-5 flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center shadow-sm">
                            <Stethoscope size={24} className="text-emerald-900" />
                          </div>
                          <div className="w-full text-center">
                            <p className="font-black text-espresso-900 text-lg">Dr. {vet.name.split(' ').pop()}</p>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">{vet.specialty || 'Veterinarian'}</p>
                            <div className="text-[10px] text-espresso-500 mt-2 flex items-center justify-center gap-1">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Available
                            </div>
                          </div>
                          {formData.vetId === vet._id && (
                            <div className="w-full flex items-center justify-center gap-1 text-xs font-black text-camel-700 bg-camel-100 rounded-lg py-2 mt-2">
                              ✓ Selected
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border-2 border-dashed border-camel-200 bg-camel-50 p-8 text-center">
                    <Stethoscope size={32} className="text-camel-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-espresso-600">No vets are available right now. Please try again later.</p>
                  </div>
                )}
              </div>

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
                disabled={!formData.vetId || !formData.petId || !formData.date || !formData.timeSlot || !formData.reason || isSubmitting}
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
