import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, Activity, Thermometer, FileDigit, Syringe, Calendar, FileText, ActivitySquare, ShieldAlert, Heart, MoreHorizontal, Plus, AlertCircle, X } from 'lucide-react';
import vetService from '../services/vet.service';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VetHub() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  // Forms state
  const [vitalsForm, setVitalsForm] = useState({ temp: '', hr: '', weight: '', notes: '' });
  const [walkinForm, setWalkinForm] = useState({ petId: '', reason: '', severity: 'ROUTINE' }); // Ideally fetched pets dropdown, we'll use text for now or dummy ID

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await vetService.getQueue();
      if (res.success) {
        // Map backend appointment schema to the exact fields the UI expects
        const mappedQueue = res.data.map(appt => ({
          id: appt._id,
          petId: appt.petId?._id,
          petName: appt.petId?.name || 'Unknown Pet',
          breed: appt.petId?.breed || 'Unknown',
          species: appt.petId?.species || 'Unknown',
          age: 'Adult', // We don't have exact age calc here easily
          petImage: appt.petId?.avatarUrl ? (appt.petId.avatarUrl.startsWith('http') ? appt.petId.avatarUrl : `http://localhost:5000${appt.petId.avatarUrl}`) : '/images/pet-1.jpg',
          owner: appt.ownerId?.name || 'Unknown Owner',
          ownerImage: '/images/owner-1.jpg', // Dummy owner image as backend doesn't have owner avatars
          time: new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: appt.status === 'EXAM' ? 'In Progress' : (appt.status === 'WAITING' ? 'Waiting' : 'Discharged'),
          rawStatus: appt.status,
          severity: appt.severity,
          reason: appt.reason,
          notes: appt.medicalNotes || 'No notes provided.',
          vitals: {
            hr: appt.vitals?.heartRate || '-- bpm',
            temp: appt.vitals?.temperature ? `${appt.vitals.temperature}°` : '--',
            weight: appt.vitals?.weight ? `${appt.vitals.weight}kg` : '--',
          },
          history: [
            { event: 'Checked In', date: new Date(appt.scheduledAt).toLocaleTimeString() }
          ]
        }));
        setQueue(mappedQueue);
        // Refresh active patient if it was selected
        if (activePatient) {
          const updatedActive = mappedQueue.find(p => p.id === activePatient.id);
          setActivePatient(updatedActive || null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleFilterToggle = () => {
    const filters = ["All", "Waiting", "In Progress", "Critical"];
    const currentIndex = filters.indexOf(statusFilter);
    setStatusFilter(filters[(currentIndex + 1) % filters.length]);
  };

  const filteredQueue = queue.filter(patient => {
    const matchesSearch = patient.petName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          patient.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "All") return matchesSearch;
    if (statusFilter === "Critical") return matchesSearch && patient.severity === 'EMERGENCY';
    return matchesSearch && patient.status === statusFilter;
  });

  const getStatusDot = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500 animate-pulse';
      case 'Waiting': return 'bg-accent-500';
      default: return 'bg-espresso-300';
    }
  };

  // ACTIONS
  const handleUpdateVitals = async (e) => {
    e.preventDefault();
    const payload = {
      vitals: {
        heartRate: vitalsForm.hr,
        temperature: vitalsForm.temp,
        weight: vitalsForm.weight
      },
      medicalNotes: vitalsForm.notes
    };
    await vetService.updateVitalsAndNotes(activePatient.id, payload);
    await fetchQueue();
    setIsUpdateModalOpen(false);
  };

  const handleChangeStatus = async (newStatus) => {
    await vetService.updateStatus(activePatient.id, newStatus);
    await fetchQueue();
    setIsStatusDropdownOpen(false);
  };

  const handleCancelAppointment = async () => {
    await vetService.deleteAppointment(activePatient.id);
    setActivePatient(null);
    setIsCancelModalOpen(false);
    await fetchQueue();
  };

  const openUpdateModal = () => {
    setVitalsForm({
      temp: activePatient.vitals.temp.replace('°', '').replace('--', ''),
      hr: activePatient.vitals.hr.replace(' bpm', '').replace('--', ''),
      weight: activePatient.vitals.weight.replace('kg', '').replace('--', ''),
      notes: activePatient.notes === 'No notes provided.' ? '' : activePatient.notes
    });
    setIsUpdateModalOpen(true);
    setIsStatusDropdownOpen(false);
  };

  
  const handleAddWalkin = async (e) => {
    e.preventDefault();
    await vetService.createAppointment({
      reason: walkinForm.reason,
      severity: walkinForm.severity
    });
    setWalkinForm({ petId: '', reason: '', severity: 'ROUTINE' });
    setIsWalkinModalOpen(false);
    await fetchQueue();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-camel-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">Clinical Workspace</p>
          <h1 className="text-3xl md:text-4xl font-display font-black text-espresso-900 tracking-tight">
            Veterinary Hub
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => setIsWalkinModalOpen(true)} className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-5 py-3 rounded-full font-bold text-sm tracking-wide shadow-sm transition-transform hover:-translate-y-0.5 whitespace-nowrap">
            <Plus size={16} /> Add Walk-in
          </button>
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
            <input type="text" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-4 py-3 rounded-full border border-camel-100 bg-white text-sm font-medium focus:outline-none focus:border-camel-400 focus:ring-1 focus:ring-camel-400 w-full md:w-64 shadow-sm transition-all" />
          </div>
          <button onClick={handleFilterToggle} title={`Filter: ${statusFilter}`} className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-camel-100 text-espresso-500 hover:text-camel-600 hover:border-camel-300 shadow-sm transition-colors relative">
            <Filter size={18} />{statusFilter !== "All" && <span className="absolute top-0 right-0 w-3 h-3 bg-camel-600 border-2 border-white rounded-full"></span>}
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANE 1: VET PROFILE */}
        <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-32">
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-camel-50 shadow-sm relative bg-camel-100 flex items-center justify-center text-2xl font-black text-espresso-500">
               {user?.name?.charAt(0) || 'V'}
               <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="text-xl font-display font-black text-espresso-900 tracking-tight">Dr. {user?.name?.split(' ')[user?.name?.split(' ').length - 1] || 'Vet'}</h2>
            <p className="text-sm font-bold text-camel-600 mt-1">Lead Veterinarian</p>
            <div className="w-full h-[1px] bg-camel-100/50 my-5"></div>
            <div className="flex justify-around w-full">
              <div>
                <p className="text-2xl font-black text-espresso-900">{queue.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400 mt-1">Total Queue</p>
              </div>
            </div>
          </div>
        </div>

        {/* PANE 2: ACTIVE QUEUE */}
        <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2 px-2">
            <h2 className="text-lg font-display font-bold text-espresso-900">Active Queue</h2>
            <p className="text-xs font-bold text-camel-600">{filteredQueue.length} {statusFilter === "All" ? "Patients" : statusFilter}</p>
          </div>
          
          {filteredQueue.length === 0 ? (
            <div className="text-center p-8 bg-white border border-camel-100 rounded-[1.5rem] shadow-sm text-espresso-500 text-sm font-medium">No patients in queue.</div>
          ) : filteredQueue.map((patient) => (
            <motion.div 
              key={patient.id} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
              onClick={() => { setActivePatient(patient); setIsStatusDropdownOpen(false); }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`p-5 rounded-[1.5rem] cursor-pointer transition-all border relative overflow-hidden group ${activePatient?.id === patient.id ? 'bg-camel-50 border-camel-300 shadow-md' : 'bg-white border-camel-100 shadow-sm hover:border-camel-300 hover:shadow-md'}`}
            >
              {activePatient?.id === patient.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-camel-500 rounded-l-[1.5rem]"></div>}
              
              <div className="flex justify-between items-start mb-4">
                 <div className="flex -space-x-3 items-center">
                    <img src={patient.petImage} alt="Pet" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm relative z-10" />
                    <img src={patient.ownerImage} alt="Owner" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-0 translate-y-1" />
                 </div>
                 <div className="text-right">
                   <span className="text-xs font-bold text-espresso-500 flex items-center justify-end gap-1"><Clock size={12}/> {patient.time}</span>
                   <div className="flex items-center justify-end gap-1.5 mt-1">
                     <span className={`w-2 h-2 rounded-full ${getStatusDot(patient.status)}`}></span>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-espresso-900">{patient.status}</span>
                   </div>
                 </div>
              </div>

              <div>
                <h3 className="text-lg font-display font-black text-espresso-900 tracking-tight">{patient.petName}</h3>
                <p className="text-xs font-bold text-camel-600 truncate">{patient.breed} • {patient.owner}</p>
                <div className="mt-3 inline-block bg-[#FAF8F5] border border-camel-200 text-espresso-700 px-3 py-1.5 rounded-xl text-xs font-medium line-clamp-1 italic">
                  "{patient.reason}"
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* PANE 3: CLINICAL CHART (Col 5) */}
        <div className="lg:col-span-5 bg-white border border-camel-100 shadow-md rounded-[2.5rem] h-[80vh] flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activePatient ? (
              <motion.div key={activePatient.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide">
                
                <div className="h-56 relative shrink-0">
                   <img src={activePatient.petImage} className="w-full h-full object-cover" alt="Pet Cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/40 to-transparent"></div>
                   
                   <div className="absolute top-4 right-4 flex gap-2 relative">
                     <button onClick={(e) => { e.stopPropagation(); setIsStatusDropdownOpen(!isStatusDropdownOpen); }} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                       <MoreHorizontal size={18} />
                     </button>
                     {/* DROPDOWN MENU */}
                     <AnimatePresence>
                       {isStatusDropdownOpen && (
                         <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-camel-100 overflow-hidden z-50">
                           <div className="px-4 py-2 border-b border-camel-50 bg-camel-50/50">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Actions</p>
                           </div>
                           <button onClick={openUpdateModal} className="w-full text-left px-4 py-3 text-sm font-bold text-espresso-700 hover:bg-camel-50 transition-colors flex items-center gap-2"><Activity size={14} className="text-camel-500" /> Update Vitals</button>
                           <button onClick={() => handleChangeStatus('EXAM')} className="w-full text-left px-4 py-3 text-sm font-bold text-espresso-700 hover:bg-camel-50 transition-colors flex items-center gap-2"><ShieldAlert size={14} className="text-blue-500" /> Begin Exam</button>
                           <button onClick={() => handleChangeStatus('DISCHARGED')} className="w-full text-left px-4 py-3 text-sm font-bold text-espresso-700 hover:bg-camel-50 transition-colors flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Discharge</button>
                           <div className="border-t border-camel-100 my-1"></div>
                           <button onClick={() => { setIsStatusDropdownOpen(false); setIsCancelModalOpen(true); }} className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"><Trash2 size={14} /> Cancel Appointment</button>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                   
                   <div className="absolute bottom-0 left-0 w-full p-6 text-white flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-display font-black tracking-tight">{activePatient.petName}</h2>
                        <div className="flex gap-3 items-center mt-1">
                          <span className="text-sm font-medium text-white/90">{activePatient.breed}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <img src={activePatient.ownerImage} className="w-10 h-10 rounded-full border-2 border-white/20 ml-auto mb-1 object-cover" alt="Owner" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">{activePatient.owner}</span>
                      </div>
                   </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col gap-8 bg-white">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-4 flex items-center gap-2"><ActivitySquare size={14}/> Current Vitals</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#FAF8F5] border border-camel-100 rounded-[1.25rem] p-4 text-center">
                          <Activity className="mx-auto mb-2 text-camel-500" size={20}/>
                          <p className="text-xl font-black text-espresso-900 tracking-tight">{activePatient.vitals.hr}</p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-espresso-400 mt-1">Heart Rate</p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-camel-100 rounded-[1.25rem] p-4 text-center">
                          <Thermometer className="mx-auto mb-2 text-camel-500" size={20}/>
                          <p className="text-xl font-black text-espresso-900 tracking-tight">{activePatient.vitals.temp}</p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-espresso-400 mt-1">Temperature</p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-camel-100 rounded-[1.25rem] p-4 text-center">
                          <Heart className="mx-auto mb-2 text-camel-500" size={20}/>
                          <p className="text-xl font-black text-espresso-900 tracking-tight">{activePatient.vitals.weight}</p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-espresso-400 mt-1">Weight</p>
                        </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-4 flex items-center gap-2"><FileText size={14}/> Intake Notes</h3>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-camel-200 rounded-full"></div>
                      <p className="pl-5 text-sm font-medium text-espresso-800 leading-relaxed italic">
                          "{activePatient.notes}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-t border-camel-100 mt-auto shrink-0">
                  <button onClick={() => handleChangeStatus('EXAM')} className="w-full py-3.5 rounded-full bg-camel-600 text-white font-bold text-sm hover:bg-camel-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <ShieldAlert size={16} /> Begin Examination
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 h-full">
                <div className="w-24 h-24 bg-camel-50 rounded-full flex items-center justify-center mb-6">
                  <FileText size={40} className="text-camel-300" />
                </div>
                <h3 className="text-xl font-display font-bold text-espresso-900 mb-2">No Patient Selected</h3>
                <p className="text-sm font-medium text-espresso-500 max-w-xs">Select a patient from the active queue to view their clinical chart.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Update Vitals Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsUpdateModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-bg-secondary">
                    <h2 className="text-xl font-display font-black text-espresso-900">Update Vitals & Notes</h2>
                    <button onClick={() => setIsUpdateModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className="p-6 flex-1 overflow-y-auto">
                    <form onSubmit={handleUpdateVitals} className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Heart Rate (bpm)</label>
                           <input type="number" value={vitalsForm.hr} onChange={(e) => setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Temp (°C)</label>
                           <input type="number" step="0.1" value={vitalsForm.temp} onChange={(e) => setVitalsForm({...vitalsForm, temp: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Weight (kg)</label>
                         <input type="number" step="0.1" value={vitalsForm.weight} onChange={(e) => setVitalsForm({...vitalsForm, weight: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Intake Notes</label>
                         <textarea rows={4} value={vitalsForm.notes} onChange={(e) => setVitalsForm({...vitalsForm, notes: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all"></textarea>
                       </div>
                       <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md">Save Updates</button>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsCancelModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
                      <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-display font-black text-espresso-900 mb-2">Cancel Appointment?</h2>
                    <p className="text-sm font-medium text-espresso-600 mb-8 leading-relaxed">
                      Are you sure you want to cancel the appointment for <strong>{activePatient?.petName}</strong>?
                    </p>
                    <div className="flex w-full gap-3">
                      <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 bg-camel-50 hover:bg-camel-100 text-espresso-800 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-colors">No</button>
                      <button onClick={handleCancelAppointment} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-colors shadow-md">Yes, Cancel</button>
                    </div>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Add Walk-in Modal */}
      <AnimatePresence>
        {isWalkinModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsWalkinModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-bg-secondary">
                    <h2 className="text-xl font-display font-black text-espresso-900">Register Walk-in</h2>
                    <button onClick={() => setIsWalkinModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className="p-6 flex-1 overflow-y-auto">
                    <form onSubmit={handleAddWalkin} className="space-y-4">
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Reason for Visit</label>
                         <input type="text" required value={walkinForm.reason} onChange={(e) => setWalkinForm({...walkinForm, reason: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. Vaccination, Limping" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Severity</label>
                         <select value={walkinForm.severity} onChange={(e) => setWalkinForm({...walkinForm, severity: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none">
                           <option value="ROUTINE">Routine</option>
                           <option value="URGENT">Urgent</option>
                           <option value="EMERGENCY">Emergency</option>
                         </select>
                       </div>
                       <div className="pt-2">
                         <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md">Register to Queue</button>
                       </div>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
