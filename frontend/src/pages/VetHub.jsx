import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, Activity, Thermometer, FileDigit, Syringe, Calendar, FileText, ActivitySquare, ShieldAlert, Heart, MoreHorizontal, Plus, AlertCircle, X, CheckCircle2, Trash2 } from 'lucide-react';
import vetService from '../services/vet.service';
import authService from '../services/auth.service';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


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

export default function VetHub() {
  const { user, dispatch } = useContext(AuthContext) || { user: {} };
  const [loading, setLoading] = useState(true);
  const [activePatient, setActivePatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [queue, setQueue] = useState([]);

  // Modals state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isVetProfileModalOpen, setIsVetProfileModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  
  // Forms state
  const [vitalsForm, setVitalsForm] = useState({ temp: '', hr: '', weight: '', notes: '' });
  
  // Walkin Modal
  const [walkinForm, setWalkinForm] = useState({ petName: '', breed: '', species: 'Dog', age: '', ownerName: '', reason: '', severity: 'ROUTINE' });
  const [walkinImageFile, setWalkinImageFile] = useState(null);
  const [walkinImagePreview, setWalkinImagePreview] = useState(null);
  const [walkinOwnerImageFile, setWalkinOwnerImageFile] = useState(null);
  const [walkinOwnerImagePreview, setWalkinOwnerImagePreview] = useState(null);

  // Vet Profile Modal
  const [vetProfileForm, setVetProfileForm] = useState({ name: user?.name || '' });
  const [vetImageFile, setVetImageFile] = useState(null);
  const [vetImagePreview, setVetImagePreview] = useState(user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:5000${user.avatarUrl}`) : null);

  // Edit Patient Modal
  const [editPatientForm, setEditPatientForm] = useState({ petName: '', breed: '', species: 'Dog', age: '', ownerName: '' });
  const [editPatientImageFile, setEditPatientImageFile] = useState(null);
  const [editPatientImagePreview, setEditPatientImagePreview] = useState(null);
  const [editOwnerImageFile, setEditOwnerImageFile] = useState(null);
  const [editOwnerImagePreview, setEditOwnerImagePreview] = useState(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await vetService.getQueue();
      if (res.success) {
        const mappedQueue = res.data.map(appt => {
          const isWalkin = !appt.petId && appt.walkInDetails;
          const petAvatarUrl = isWalkin ? appt.walkInDetails.petAvatarUrl : appt.petId?.avatarUrl;
          const ownerAvatarUrl = isWalkin ? appt.walkInDetails.ownerAvatarUrl : appt.ownerId?.avatarUrl;
          
          return {
            id: appt._id,
            displayId: appt._id.slice(-6).toUpperCase(),
            petId: appt.petId?._id || null,
            petName: isWalkin ? appt.walkInDetails.petName : (appt.petId?.name || 'Unknown Pet'),
            breed: isWalkin ? appt.walkInDetails.breed : (appt.petId?.breed || 'Unknown'),
            species: isWalkin ? appt.walkInDetails.species : (appt.petId?.species || 'Unknown'),
            age: isWalkin ? appt.walkInDetails.age : 'Adult', 
            petImage: petAvatarUrl ? (petAvatarUrl.startsWith('http') ? petAvatarUrl : `http://localhost:5000${petAvatarUrl}`) : '/images/product-placeholder.jpg',
            owner: isWalkin ? appt.walkInDetails.ownerName : (appt.ownerId?.name || 'Unknown Owner'),
            ownerImage: ownerAvatarUrl ? (ownerAvatarUrl.startsWith('http') ? ownerAvatarUrl : `http://localhost:5000${ownerAvatarUrl}`) : '/images/product-placeholder.jpg',
            time: new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appt.status === 'EXAM' ? 'In Progress' : (appt.status === 'WAITING' ? 'Waiting' : 'Discharged'),
            rawStatus: appt.status,
            type: appt.reason,
            vitals: {
              hr: appt.vitals?.heartRate ? `${appt.vitals.heartRate} bpm` : '-- bpm',
              temp: appt.vitals?.temperature ? `${appt.vitals.temperature} °C` : '-- °C',
              weight: appt.vitals?.weight ? `${appt.vitals.weight} kg` : '-- kg',
            },
            notes: appt.medicalNotes || 'No notes provided.',
            history: [
              { date: new Date(appt.scheduledAt).toLocaleDateString(), event: 'Registered to queue' }
            ]
          };
        });
        setQueue(mappedQueue);
        // Refresh active patient if it was selected
        if (activePatient) {
          const updatedActive = mappedQueue.find(p => p.id === activePatient.id);
          setActivePatient(updatedActive || null);
        } else if (mappedQueue.length > 0) {
          setActivePatient(mappedQueue[0]);
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

  const filteredQueue = queue.filter(patient => {
    const matchesSearch = 
      patient.petName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      patient.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.displayId.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && patient.status === statusFilter;
  });

  const handleFilterToggle = () => {
    const filters = ["All", "Waiting", "In Progress"];
    const currentIndex = filters.indexOf(statusFilter);
    setStatusFilter(filters[(currentIndex + 1) % filters.length]);
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500 animate-pulse';
      case 'Waiting': return 'bg-accent-500';
      default: return 'bg-espresso-300';
    }
  };

  // ACTIONS
  const handleBeginExamination = async () => {
    if (!activePatient) return;
    await vetService.updateStatus(activePatient.id, 'EXAM');
    await fetchQueue();
  };

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

  const handleAddWalkin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reason', walkinForm.reason);
    formData.append('severity', walkinForm.severity);
    formData.append('petName', walkinForm.petName);
    formData.append('breed', walkinForm.breed);
    formData.append('species', walkinForm.species);
    formData.append('age', walkinForm.age);
    formData.append('ownerName', walkinForm.ownerName);
    if (walkinImageFile) formData.append('petAvatar', walkinImageFile);
    if (walkinOwnerImageFile) formData.append('ownerAvatar', walkinOwnerImageFile);

    await vetService.createAppointment(formData);
    
    setWalkinForm({ petName: '', breed: '', species: 'Dog', age: '', ownerName: '', reason: '', severity: 'ROUTINE' });
    setWalkinImageFile(null);
    setWalkinImagePreview(null);
    setWalkinOwnerImageFile(null);
    setWalkinOwnerImagePreview(null);
    setIsWalkinModalOpen(false);
    await fetchQueue();
  };

  const handleVetProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', vetProfileForm.name);
    if (vetImageFile) {
      formData.append('avatar', vetImageFile);
    }
    const res = await authService.updateProfile(formData);
    if (res.success) {
      window.location.reload();
    }
  };

  const openUpdateModal = () => {
    setVitalsForm({
      temp: activePatient.vitals.temp.replace(' °C', '').replace('--', ''),
      hr: activePatient.vitals.hr.replace(' bpm', '').replace('--', ''),
      weight: activePatient.vitals.weight.replace(' kg', '').replace('--', ''),
      notes: activePatient.notes === 'No notes provided.' ? '' : activePatient.notes
    });
    setIsUpdateModalOpen(true);
    setIsStatusDropdownOpen(false);
  };

  const openEditPatientModal = () => {
    setEditPatientForm({
      petName: activePatient.petName,
      breed: activePatient.breed,
      species: activePatient.species || 'Dog',
      age: activePatient.age,
      ownerName: activePatient.owner
    });
    setEditPatientImagePreview(activePatient.petImage);
    setEditOwnerImagePreview(activePatient.ownerImage);
    setEditPatientImageFile(null);
    setEditOwnerImageFile(null);
    setIsEditPatientModalOpen(true);
    setIsStatusDropdownOpen(false);
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('petName', editPatientForm.petName);
    formData.append('breed', editPatientForm.breed);
    formData.append('species', editPatientForm.species);
    formData.append('age', editPatientForm.age);
    formData.append('ownerName', editPatientForm.ownerName);
    if (editPatientImageFile) formData.append('petAvatar', editPatientImageFile);
    if (editOwnerImageFile) formData.append('ownerAvatar', editOwnerImageFile);

    await vetService.updateWalkin(activePatient.id, formData);
    await fetchQueue();
    setIsEditPatientModalOpen(false);
  };

  const handleOrderMeds = () => alert(`Opening pharmacy modal for ${activePatient?.petName}...`);
  const handleViewLabs = () => alert(`Loading lab results for ${activePatient?.petName}...`);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-camel-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Workspace Header */}
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
            <input type="text" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-4 py-3 rounded-full border border-camel-100 bg-white text-sm font-medium focus:outline-none focus:border-camel-400 focus:ring-1 focus:ring-camel-400 w-full md:w-64 shadow-sm transition-all"
            />
          </div>
          <button onClick={handleFilterToggle} title={`Filter: ${statusFilter}`} className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-camel-100 text-espresso-500 hover:text-camel-600 hover:border-camel-300 shadow-sm transition-colors relative">
            <Filter size={18} />{statusFilter !== "All" && <span className="absolute top-0 right-0 w-3 h-3 bg-camel-600 border-2 border-white rounded-full"></span>}
          </button>
        </div>
      </div>

      {/* High-Density 3-Pane Architecture */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANE 1: VET PROFILE & GLOBAL STATS (Col 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-32">
          
          {/* Vet ID Card */}
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col items-center text-center">
            <div onClick={() => setIsVetProfileModalOpen(true)} className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-camel-50 shadow-sm relative flex items-center justify-center bg-camel-100 text-2xl font-black text-espresso-500 cursor-pointer group">
               <Avatar src={user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:5000${user.avatarUrl}`) : null} name={user?.name || 'V'} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs font-bold transition-all">Edit</div>
               <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full z-10"></div>
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

          {/* Mini Calendar/Schedule */}
          <div className="bg-[#FAF8F5] rounded-[2rem] p-6 border border-camel-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-display font-bold text-espresso-900">Schedule</h3>
              <Calendar size={16} className="text-camel-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-camel-400"></div>
                <p className="text-xs font-bold text-espresso-600 w-16">10:00 AM</p>
                <p className="text-xs font-medium text-espresso-900">Rounds & Charts</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <p className="text-xs font-bold text-espresso-600 w-16">10:30 AM</p>
                <p className="text-xs font-bold text-espresso-900">Consultations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div>
                <p className="text-xs font-bold text-espresso-600 w-16">01:00 PM</p>
                <p className="text-xs font-medium text-espresso-900">Surgery Block</p>
              </div>
            </div>
          </div>
        </div>

        {/* PANE 2: THE ACTIVE QUEUE (Col 4) */}
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
              {/* Active Indicator Bar */}
              {activePatient?.id === patient.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-camel-500 rounded-l-[1.5rem]"></div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                 <div className="flex -space-x-3 items-center">
                    <Avatar src={patient.petImage} alt="Pet" name={patient.petName} className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm relative z-10 bg-camel-50" />
                    <Avatar src={patient.ownerImage} alt="Owner" name={patient.owner} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-0 translate-y-1 bg-camel-50" />
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
                <h3 className="text-lg font-display font-black text-espresso-900 tracking-tight">{patient.petName} <span className="text-xs font-bold text-camel-600 align-middle ml-1">({patient.displayId})</span></h3>
                <p className="text-sm font-bold text-camel-600 mt-0.5">{patient.type}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* PANE 3: CLINICAL CHART (Col 5) */}
        <div className="lg:col-span-5 bg-white border border-camel-100 shadow-md rounded-[2.5rem] h-[80vh] flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activePatient ? (
              <motion.div 
                key={activePatient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide relative"
              >
                {/* Cover Image & Primary Info */}
                <div className="h-56 relative shrink-0">
                   <Avatar src={activePatient.petImage} alt="Pet Cover" name={activePatient.petName} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/40 to-transparent"></div>
                   
                   <div className="absolute top-4 right-4 flex gap-2">
                     <button onClick={(e) => { e.stopPropagation(); setIsStatusDropdownOpen(!isStatusDropdownOpen); }} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10 relative">
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
                           <button onClick={openEditPatientModal} className="w-full text-left px-4 py-3 text-sm font-bold text-espresso-700 hover:bg-camel-50 transition-colors flex items-center gap-2"><FileDigit size={14} className="text-camel-500" /> Edit Patient</button>
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
                          <span className="w-1 h-1 rounded-full bg-white/50"></span>
                          <span className="text-sm font-medium text-white/90">{activePatient.age}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Avatar src={activePatient.ownerImage} alt="Owner" name={activePatient.owner} className="w-10 h-10 rounded-full border-2 border-white/20 ml-auto mb-1 object-cover bg-camel-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">{activePatient.owner}</span>
                      </div>
                   </div>
                </div>
                
                {/* Clinical Content Area */}
                <div className="p-6 flex-1 flex flex-col gap-8 bg-white">
                  
                  {/* Vitals Architectural Grid */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-4 flex items-center gap-2">
                      <ActivitySquare size={14}/> Current Vitals
                    </h3>
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
                  
                  {/* Intake Notes (Editorial Style) */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-4 flex items-center gap-2">
                      <FileText size={14}/> Intake Notes
                    </h3>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-camel-200 rounded-full"></div>
                      <p className="pl-5 text-sm font-medium text-espresso-800 leading-relaxed italic">
                          "{activePatient.notes}"
                      </p>
                    </div>
                  </div>

                  {/* Medical History Timeline */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-4 flex items-center gap-2">
                      <Clock size={14}/> Recent History
                    </h3>
                    <div className="space-y-4 pl-1 border-l border-camel-100 ml-2">
                      {activePatient.history.map((hist, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-camel-300 ring-4 ring-white"></div>
                          <p className="text-sm font-bold text-espresso-900">{hist.event}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400 mt-0.5">{hist.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Fixed Action Footer */}
                <div className="p-6 bg-white border-t border-camel-100 mt-auto shrink-0 space-y-3">
                  <button onClick={handleBeginExamination} className="w-full py-3.5 rounded-full bg-camel-600 text-white font-bold text-sm hover:bg-camel-700 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"><ShieldAlert size={16} /> Begin Examination</button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleOrderMeds} className="py-3 rounded-full bg-[#FAF8F5] border border-camel-200 text-espresso-900 font-bold text-sm hover:bg-camel-50 transition-all flex justify-center items-center gap-2"><Syringe size={16} className="text-camel-600"/> Order Meds</button>
                    <button onClick={handleViewLabs} className="py-3 rounded-full bg-[#FAF8F5] border border-camel-200 text-espresso-900 font-bold text-sm hover:bg-camel-50 transition-all flex justify-center items-center gap-2"><FileDigit size={16} className="text-camel-600"/> View Labs</button>
                  </div>
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

      {/* MODALS */}

      {/* Vet Profile Modal */}
      <AnimatePresence>
        {isVetProfileModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsVetProfileModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                    <h2 className="text-xl font-display font-black text-espresso-900">Edit Profile</h2>
                    <button onClick={() => setIsVetProfileModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className="p-6">
                    <form onSubmit={handleVetProfileUpdate} className="space-y-4">
                       <div className="flex flex-col items-center mb-4">
                         <div className="relative w-24 h-24 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                           {vetImagePreview ? <img src={vetImagePreview} className="w-full h-full object-cover" alt="Preview"/> : <div className="w-full h-full flex items-center justify-center text-camel-300 font-medium">Upload</div>}
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files[0];
                             if(file) {
                               setVetImageFile(file);
                               setVetImagePreview(URL.createObjectURL(file));
                             }
                           }} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                         <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Change Avatar</p>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Full Name</label>
                         <input type="text" value={vetProfileForm.name} onChange={(e) => setVetProfileForm({...vetProfileForm, name: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                       </div>
                       <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md">Save Profile</button>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Patient Modal */}
      <AnimatePresence>
        {isEditPatientModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsEditPatientModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                    <h2 className="text-xl font-display font-black text-espresso-900">Edit Patient Details</h2>
                    <button onClick={() => setIsEditPatientModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className="p-6 flex-1 overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleEditPatient} className="space-y-4">
                       <div className="flex flex-row justify-center gap-8 mb-6">
                         <div className="flex flex-col items-center">
                           <div className="relative w-20 h-20 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                             {editPatientImagePreview ? <img src={editPatientImagePreview} className="w-full h-full object-cover" alt="Pet"/> : <div className="w-full h-full flex items-center justify-center text-camel-300 font-medium text-[10px]">Pet</div>}
                             <input type="file" accept="image/*" onChange={(e) => {
                               const file = e.target.files[0];
                               if(file) {
                                 setEditPatientImageFile(file);
                                 setEditPatientImagePreview(URL.createObjectURL(file));
                               }
                             }} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Pet Photo</p>
                         </div>
                         <div className="flex flex-col items-center">
                           <div className="relative w-20 h-20 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                             {editOwnerImagePreview ? <img src={editOwnerImagePreview} className="w-full h-full object-cover" alt="Owner"/> : <div className="w-full h-full flex items-center justify-center text-camel-300 font-medium text-[10px]">Owner</div>}
                             <input type="file" accept="image/*" onChange={(e) => {
                               const file = e.target.files[0];
                               if(file) {
                                 setEditOwnerImageFile(file);
                                 setEditOwnerImagePreview(URL.createObjectURL(file));
                               }
                             }} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Owner Photo</p>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Pet Name</label>
                           <input type="text" required value={editPatientForm.petName} onChange={(e) => setEditPatientForm({...editPatientForm, petName: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Owner Name</label>
                           <input type="text" required value={editPatientForm.ownerName} onChange={(e) => setEditPatientForm({...editPatientForm, ownerName: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Species</label>
                           <select value={editPatientForm.species} onChange={(e) => setEditPatientForm({...editPatientForm, species: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none">
                             <option value="Dog">Dog</option>
                             <option value="Cat">Cat</option>
                             <option value="Other">Other</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Breed</label>
                           <input type="text" required value={editPatientForm.breed} onChange={(e) => setEditPatientForm({...editPatientForm, breed: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Age</label>
                           <input type="text" value={editPatientForm.age} onChange={(e) => setEditPatientForm({...editPatientForm, age: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                         </div>
                       </div>
                       
                       <div className="pt-4">
                         <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md">Save Changes</button>
                       </div>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Update Vitals Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsUpdateModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
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

      {/* Cancel Modal */}
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

      {/* Walk-in Modal */}
      <AnimatePresence>
        {isWalkinModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsWalkinModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                    <h2 className="text-xl font-display font-black text-espresso-900">Register New Patient</h2>
                    <button onClick={() => setIsWalkinModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className="p-6 flex-1 overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleAddWalkin} className="space-y-4">
                       <div className="flex flex-row justify-center gap-8 mb-6">
                         <div className="flex flex-col items-center">
                           <div className="relative w-20 h-20 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                             {walkinImagePreview ? <img src={walkinImagePreview} className="w-full h-full object-cover" alt="Pet"/> : <div className="w-full h-full flex items-center justify-center text-camel-300 font-medium text-[10px]">Pet</div>}
                             <input type="file" accept="image/*" onChange={(e) => {
                               const file = e.target.files[0];
                               if(file) {
                                 setWalkinImageFile(file);
                                 setWalkinImagePreview(URL.createObjectURL(file));
                               }
                             }} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Pet Photo</p>
                         </div>
                         <div className="flex flex-col items-center">
                           <div className="relative w-20 h-20 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                             {walkinOwnerImagePreview ? <img src={walkinOwnerImagePreview} className="w-full h-full object-cover" alt="Owner"/> : <div className="w-full h-full flex items-center justify-center text-camel-300 font-medium text-[10px]">Owner</div>}
                             <input type="file" accept="image/*" onChange={(e) => {
                               const file = e.target.files[0];
                               if(file) {
                                 setWalkinOwnerImageFile(file);
                                 setWalkinOwnerImagePreview(URL.createObjectURL(file));
                               }
                             }} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Owner Photo</p>
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Pet Name</label>
                           <input type="text" required value={walkinForm.petName} onChange={(e) => setWalkinForm({...walkinForm, petName: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. Max" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Owner Name</label>
                           <input type="text" required value={walkinForm.ownerName} onChange={(e) => setWalkinForm({...walkinForm, ownerName: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. Sarah Jenkins" />
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Species</label>
                           <select value={walkinForm.species} onChange={(e) => setWalkinForm({...walkinForm, species: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none">
                             <option value="Dog">Dog</option>
                             <option value="Cat">Cat</option>
                             <option value="Other">Other</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Breed</label>
                           <input type="text" required value={walkinForm.breed} onChange={(e) => setWalkinForm({...walkinForm, breed: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. Beagle" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Age</label>
                           <input type="text" value={walkinForm.age} onChange={(e) => setWalkinForm({...walkinForm, age: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. 2 Yrs" />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
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
                       </div>
                       
                       <div className="pt-4">
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
