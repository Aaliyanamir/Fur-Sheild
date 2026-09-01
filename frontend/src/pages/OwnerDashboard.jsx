import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, PawPrint, HeartHandshake, Syringe, Stethoscope, AlertCircle, X, Edit2, Trash2, Camera, Upload, FileText, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dashboardService from '../services/dashboard.service';
import adoptService from '../services/adopt.service';
import { getImageUrl, getSpeciesFallback } from '../lib/imageUtils';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activePetIndex, setActivePetIndex] = useState(0);
  const [activeViewTab, setActiveViewTab] = useState('Overview');
  const [myAdoptionListings, setMyAdoptionListings] = useState([]);

  // Medical Modals
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [vaccineForm, setVaccineForm] = useState({ name: '', dateAdministered: '', nextDue: '', status: 'Up to Date' });
  const [docForm, setDocForm] = useState({ title: '', docType: 'X-Ray' });
  const [docFile, setDocFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyAdoptionListings = async () => {
    try {
      const res = await adoptService.getMyAdoptionListings();
      if (res.success) {
        setMyAdoptionListings(res.data);
      }
    } catch (err) {
      console.error('Error fetching adoption listings:', err);
    }
  };

  const handleToggleListingStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ADOPTED' ? 'ADOPTABLE' : 'ADOPTED';
      const res = await adoptService.updateMyListingStatus(id, newStatus);
      if (res.success) {
        fetchMyAdoptionListings();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to remove this adoption listing?')) return;
    try {
      const res = await adoptService.deleteMyListing(id);
      if (res.success) {
        fetchMyAdoptionListings();
      }
    } catch (err) {
      alert('Failed to remove listing');
    }
  };
  

  // Add Pet / Edit Pet Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [petToEdit, setPetToEdit] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', species: 'Dog', breed: '', weight: '', gender: 'Male', age: '', microchipId: '' });
  const [modalError, setModalError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


    // Update Vitals Modal State
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isVitalsSubmitting, setIsVitalsSubmitting] = useState(false);
  const [vitalsWeight, setVitalsWeight] = useState('');
  const [vitalsError, setVitalsError] = useState('');

  // Timeframe for charts (mock logic for now, but UI ready)
  const [timeframe, setTimeframe] = useState('This Week');


  const openAddModal = () => {
    setIsEditMode(false);
    setPetToEdit(null);
    setNewPet({ name: '', species: 'Dog', breed: '', weight: '', gender: 'Male', age: '', microchipId: '' });
    setAvatarFile(null);
    setAvatarPreview(null);
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (pet) => {
    setIsEditMode(true);
    setPetToEdit(pet._id);
    setNewPet({
      name: pet.name || '',
      species: pet.species || 'Dog',
      breed: pet.breed || '',
      weight: pet.weightHistory?.length > 0 ? pet.weightHistory[pet.weightHistory.length - 1].weight : '',
      gender: pet.gender || 'Male',
      age: pet.age || '',
      microchipId: pet.microchipId || ''
    });
    setAvatarFile(null);
    setAvatarPreview(pet.avatarUrl ? getImageUrl(pet.avatarUrl, getSpeciesFallback(pet.species)) : null);
    setModalError('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (pet) => {
    setPetToDelete(pet);
    setIsDeleteModalOpen(true);
  };

  
  const handleAddVaccine = async (e) => {
    e.preventDefault();
    try {
      const res = await dashboardService.addVaccine(activePet._id, vaccineForm);
      if (res.success) {
        setIsVaccineModalOpen(false);
        setVaccineForm({ name: '', dateAdministered: '', nextDue: '', status: 'Up to Date' });
        fetchDashboardData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', docForm.title);
      formData.append('docType', docForm.docType);
      if (docFile) formData.append('document', docFile);
      // Fallback if no file uploaded just to make UI work without actual backend file storage (uses fake URL)
      if (!docFile) formData.append('fileUrl', '/images/demo-doc.jpg');

      const res = await dashboardService.addDocument(activePet._id, formData);
      if (res.success) {
        setIsDocModalOpen(false);
        setDocForm({ title: '', docType: 'X-Ray' });
        setDocFile(null);
        fetchDashboardData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [response, apptRes] = await Promise.all([dashboardService.getOwnerDashboardData(), dashboardService.getMyAppointments()]);
      if (response.success) {
        setPets(response.data);
        if (apptRes.success) setAppointments(apptRes.data);
      } else {
        setError(response.message || "Failed to load pets.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDeletePet = async () => {
    if (!petToDelete) return;
    setIsDeleting(true);
    try {
      const res = await dashboardService.deletePet(petToDelete._id);
      if (res.success) {
        await fetchDashboardData();
        setIsDeleteModalOpen(false);
        setPetToDelete(null);
        setActivePetIndex(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddPetSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', newPet.name);
      formData.append('species', newPet.species);
      formData.append('breed', newPet.breed);
      if (newPet.gender) formData.append('gender', newPet.gender);
      if (newPet.age) formData.append('age', newPet.age);
      if (newPet.microchipId) formData.append('microchipId', newPet.microchipId);
      if (avatarFile) formData.append('avatar', avatarFile);

      let petResponse;
      if (isEditMode) {
        petResponse = await dashboardService.updatePet(petToEdit, formData);
      } else {
        petResponse = await dashboardService.addNewPet(formData);
      }

      if (petResponse.success) {
        const processedPet = petResponse.data;
        if (newPet.weight && (!isEditMode || (processedPet.weightHistory?.length === 0 || processedPet.weightHistory[processedPet.weightHistory.length - 1]?.weight != newPet.weight))) {
           await dashboardService.updatePetVitals(processedPet._id, { weight: parseFloat(newPet.weight) });
        }
        
        await fetchDashboardData();
        
        setIsModalOpen(false);
        if (!isEditMode) setActivePetIndex(0);
      } else {
        setModalError(petResponse.message || `Failed to ${isEditMode ? 'update' : 'add'} pet`);
      }
    } catch (err) {
      setModalError(`Error ${isEditMode ? 'updating' : 'adding'} pet. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVitalsSubmit = async (e) => {
    e.preventDefault();
    setVitalsError('');
    setIsVitalsSubmitting(true);
    
    try {
      const response = await dashboardService.updatePetVitals(pets[activePetIndex]._id, { weight: parseFloat(vitalsWeight) });
      if (response.success) {
        // Refresh dashboard data to sync charts and latest weight
        await fetchDashboardData();
        setIsVitalsModalOpen(false);
        setVitalsWeight('');
      } else {
        setVitalsError(response.message || "Failed to update vitals.");
      }
    } catch (err) {
      setVitalsError("An error occurred while updating vitals.");
    } finally {
      setIsVitalsSubmitting(false);
    }
  };

  // Circular Progress Helper
  const CircularProgress = ({ percentage, colorClass, icon: Icon, label }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-24 h-24 mb-3">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-camel-100" />
            <circle 
              cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" 
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${colorClass}`} 
            />
          </svg>
          <div className="flex flex-col items-center justify-center relative z-10">
            <Icon size={16} className={`mb-0.5 ${colorClass}`} />
            <span className="text-lg font-black text-espresso-900 leading-none">{percentage}%</span>
          </div>
        </div>
        <span className="text-xs font-bold text-espresso-600 uppercase tracking-widest">{label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
         <div className="w-12 h-12 border-4 border-camel-200 border-t-camel-600 rounded-full animate-spin mb-4"></div>
         <p className="text-espresso-500 font-bold tracking-widest uppercase text-sm">Loading Ecosystem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
         <div className="bg-red-50 text-red-600 px-6 py-4 rounded-3xl flex items-center gap-3">
            <AlertCircle size={24} />
            <span className="font-bold">{error}</span>
         </div>
         <button onClick={fetchDashboardData} className="mt-4 text-camel-600 font-bold hover:underline">Try Again</button>
      </div>
    );
  }

  const activePet = pets[activePetIndex];
  return (
    <div className="w-full relative">
      {/* Header & Multi-Pet Tabs */}
      <div className="flex flex-col mb-8 gap-4 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">Owner Dashboard</p>
             <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">
               {pets.length > 0 ? `${activePet?.name}'s Health` : 'Welcome to FurShield'}
             </h1>
           </div>
           <button onClick={openAddModal} className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:-translate-y-0.5 w-max">
             <Plus size={18} /> Add Pet
           </button>
        </div>

        {pets.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 border-b border-camel-100">
            {pets.map((pet, idx) => (
              <button 
                key={pet._id}
                onClick={() => setActivePetIndex(idx)}
                className={`relative px-4 py-2 flex items-center gap-2 rounded-full transition-colors ${activePetIndex === idx ? 'text-espresso-900 font-bold bg-camel-100/50' : 'text-espresso-500 font-medium hover:bg-camel-50'}`}
              >
                {activePetIndex === idx && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-camel-100 rounded-full -z-10" />
                )}
                <div className="w-6 h-6 rounded-full bg-camel-200 overflow-hidden">
                   <img 
                     src={getImageUrl(pet.avatarUrl, getSpeciesFallback(pet.species))} 
                     alt={pet.name} 
                     className="w-full h-full object-cover mix-blend-multiply" 
                     onError={(e) => { e.target.onerror = null; e.target.src = getSpeciesFallback(pet.species); }}
                   />
                </div>
                <span className="text-sm">{pet.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {pets.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 border border-camel-100 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="w-24 h-24 rounded-full bg-camel-50 flex items-center justify-center text-camel-400 mb-6">
              <PawPrint size={40} />
           </div>
           <h2 className="text-2xl font-display font-black text-espresso-900 mb-2">No Pets Found</h2>
           <p className="text-espresso-500 font-medium max-w-md mb-8">Your dashboard is empty. Add your first pet to start tracking their health, managing appointments, and accessing the clinical ecosystem.</p>
           <button onClick={openAddModal} className="bg-camel-600 hover:bg-camel-500 text-white px-8 py-3.5 rounded-full font-bold shadow-md shadow-camel-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
             <Plus size={18} /> Register First Pet
           </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={activePet._id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative"
          >
            {/* LEFT COLUMN: Pet Identity & Profile Bento */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col">
                <div className="w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 relative group bg-camel-50 flex items-center justify-center">
                  <img 
                    src={getImageUrl(activePet.avatarUrl, getSpeciesFallback(activePet.species))} 
                    alt={activePet.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" 
                    onError={(e) => { e.target.onerror = null; e.target.src = getSpeciesFallback(activePet.species); }}
                  />
                </div>
                
                                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-display font-black text-espresso-900 tracking-tight">{activePet.name}</h2>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        <span className="text-camel-600 font-bold">{activePet.breed} â€¢ {activePet.species}</span>
                        {activePet.age && <span className="text-camel-600 font-bold">â€¢ {activePet.age} yrs</span>}
                        {activePet.gender && <span className="text-camel-600 font-bold">â€¢ {activePet.gender}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(activePet)} className="w-10 h-10 rounded-full bg-camel-50 border border-camel-100 flex items-center justify-center text-camel-600 hover:text-espresso-900 hover:border-camel-300 transition-colors shadow-sm" aria-label="Edit Pet">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => openDeleteModal(activePet)} className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-100 transition-colors shadow-sm" aria-label="Delete Pet">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-camel-100/50">
                  <div className="bg-bg-secondary rounded-2xl p-4">
                    <p className="text-espresso-400 text-[10px] font-bold uppercase tracking-widest mb-1">Latest Weight</p>
                    <p className="text-espresso-900 font-black text-lg">
                       {activePet.weightHistory && activePet.weightHistory.length > 0 
                          ? `${activePet.weightHistory[activePet.weightHistory.length-1].weight} kg` 
                          : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-bg-secondary rounded-2xl p-4">
                    <p className="text-espresso-400 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="text-emerald-600 font-black text-lg">Healthy</p>
                  </div>
                </div>
              </div>
            </div>

            
              {/* RIGHT COLUMN: Health Data & Analytics */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                      {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-camel-100 pb-2">
                  {['Overview', 'Health Records', 'My Adoption Listings'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveViewTab(tab)}
                      className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeViewTab === tab ? 'border-espresso-900 text-espresso-900' : 'border-transparent text-espresso-400 hover:text-camel-600'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeViewTab === 'Overview' && (
                  <>
                    {/* Daily Vitals Overview */}
                    <div>
                      <h3 className="font-display font-bold text-xl text-espresso-900 mb-4">Daily Vitals</h3>
                      <div className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-sm">
                        <div className="flex flex-wrap justify-center gap-12 sm:gap-16">
                          <CircularProgress percentage={78} colorClass="text-accent-500" icon={Flame} label="Activity" />
                          <CircularProgress percentage={82} colorClass="text-indigo-400" icon={Moon} label="Rest" />
                          <CircularProgress percentage={62} colorClass="text-sky-400" icon={Droplets} label="Hydration" />
                        </div>
                      </div>
                    </div>

                    {/* Advanced Charting Block */}
                    <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                          <h3 className="font-display font-bold text-xl text-espresso-900 mb-1">Weight Trajectory</h3>
                          <p className="text-xs font-bold text-espresso-400 uppercase tracking-widest">Historical Data</p>
                        </div>
                        <button onClick={() => setIsVitalsModalOpen(true)} className="flex items-center justify-center gap-2 bg-camel-50 hover:bg-camel-100 text-camel-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors border border-camel-200 shadow-sm shrink-0">
                          <Plus size={16} /> Log Weight
                        </button>
                      </div>
      
                      <div className="h-64 w-full">
                        {activePet.weightHistory && activePet.weightHistory.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activePet.weightHistory.map(entry => ({ 
                               date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                               weight: entry.weight 
                            }))}>
                              <defs>
                                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#BA7F48" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#BA7F48" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9e1" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8b7355', fontSize: 10, fontWeight: 700}} dy={10} />
                              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#8b7355', fontSize: 10, fontWeight: 700}} dx={-10} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(90,56,37,0.1)', fontWeight: 'bold' }}
                                itemStyle={{ color: '#3E2A20' }}
                              />
                              <Area type="monotone" dataKey="weight" stroke="#BA7F48" strokeWidth={3} fillOpacity={1} fill="url(#weightGrad)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-espresso-400 font-medium">
                            No weight data logged yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeViewTab === 'Health Records' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Vaccination Timeline */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-xl text-espresso-900">Vaccination History</h3>
                        <button onClick={() => setIsVaccineModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-camel-700 bg-camel-50 hover:bg-camel-100 border border-camel-200 px-4 py-2 rounded-full transition-colors">
                          <Plus size={14} /> Add Vaccine
                        </button>
                      </div>
                      <div className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-sm">
                        {(!activePet.medicalPassport?.vaccinations || activePet.medicalPassport.vaccinations.length === 0) ? (
                          <p className="text-sm text-espresso-500 italic text-center py-4">No vaccination records found.</p>
                        ) : (
                          <div className="relative border-l-2 border-camel-200 ml-4 space-y-8 pb-4">
                            {activePet.medicalPassport.vaccinations.map((vax, idx) => (
                              <div key={idx} className="relative pl-6">
                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${vax.status === 'Up to Date' ? 'bg-emerald-500' : vax.status === 'Due Soon' ? 'bg-amber-400' : 'bg-rose-500'}`}></div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div>
                                    <h4 className="text-lg font-black text-espresso-900">{vax.name}</h4>
                                    <p className="text-xs font-bold text-espresso-500 mt-1">Administered: {new Date(vax.dateAdministered).toLocaleDateString()}</p>
                                  </div>
                                  <div className="flex flex-col sm:items-end">
                                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full w-fit ${vax.status === 'Up to Date' ? 'bg-emerald-50 text-emerald-700' : vax.status === 'Due Soon' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{vax.status}</span>
                                    {vax.nextDue && <p className="text-[10px] font-bold text-camel-500 mt-2 uppercase tracking-widest">Next Due: {new Date(vax.nextDue).toLocaleDateString()}</p>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document Vault */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-xl text-espresso-900">Document Vault</h3>
                        <button onClick={() => setIsDocModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-camel-700 bg-camel-50 hover:bg-camel-100 border border-camel-200 px-4 py-2 rounded-full transition-colors">
                          <Upload size={14} /> Upload File
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(!activePet.documents || activePet.documents.length === 0) ? (
                          <div className="col-span-full bg-white rounded-[2rem] p-8 border border-camel-100 text-center">
                            <FileText size={32} className="mx-auto text-camel-300 mb-3" />
                            <p className="text-sm text-espresso-500 font-bold">No medical documents uploaded yet.</p>
                          </div>
                        ) : activePet.documents.map((doc, idx) => (
                          <a key={idx} href={doc.fileUrl ? (doc.fileUrl.startsWith('http') || doc.fileUrl.startsWith('/images') || doc.fileUrl.startsWith('/uploads') ? doc.fileUrl : `http://localhost:5000${doc.fileUrl}`) : '#'} target="_blank" rel="noreferrer" className="bg-white rounded-2xl p-5 border border-camel-100 shadow-sm flex items-center gap-4 hover:border-camel-300 hover:shadow-md transition-all group">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.docType === 'X-Ray' ? 'bg-indigo-50 text-indigo-500' : doc.docType === 'Lab Report' ? 'bg-sky-50 text-sky-500' : 'bg-emerald-50 text-emerald-500'}`}>
                              {doc.docType === 'X-Ray' ? <Activity size={24}/> : doc.docType === 'Lab Report' ? <Stethoscope size={24}/> : <FileText size={24}/>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="text-sm font-black text-espresso-900 truncate">{doc.title}</h4>
                              <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest mt-1">{doc.docType} &bull; {new Date(doc.dateUploaded).toLocaleDateString()}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {activeViewTab === 'My Adoption Listings' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-display font-bold text-xl text-espresso-900">Pets You Listed For Adoption</h3>
                      <button onClick={() => navigate('/adoption')} className="flex items-center gap-2 bg-camel-600 hover:bg-camel-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm">
                        <Plus size={14} /> Add New Listing
                      </button>
                    </div>

                    {myAdoptionListings.length === 0 ? (
                      <div className="bg-white rounded-[2rem] p-10 border border-camel-100 text-center">
                        <PawPrint size={36} className="mx-auto text-camel-300 mb-3" />
                        <h4 className="text-base font-black text-espresso-900 mb-1">No Adoption Listings Yet</h4>
                        <p className="text-xs text-espresso-500 max-w-sm mx-auto mb-4">You haven't posted any pet for adoption yet. You can list a pet for adoption so other users can view, contact, and adopt it.</p>
                        <button onClick={() => navigate('/adoption')} className="bg-espresso-900 hover:bg-espresso-800 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md">
                          List Pet For Adoption
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {myAdoptionListings.map(listing => (
                          <div key={listing._id} className="bg-white rounded-3xl p-6 border border-camel-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-2xl bg-camel-100 overflow-hidden shrink-0 border border-camel-200">
                                <img 
                                  src={getImageUrl(listing.avatarUrl, getSpeciesFallback(listing.species))} 
                                  alt={listing.name} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => { e.target.onerror = null; e.target.src = getSpeciesFallback(listing.species); }}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-xl font-black text-espresso-900">{listing.name}</h4>
                                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${listing.status === 'ADOPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {listing.status === 'ADOPTED' ? 'Adopted' : 'Available'}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-camel-600 uppercase tracking-widest">{listing.breed || listing.species} &bull; Fee: ${listing.adoptionFee || 0}</p>
                                {listing.pickupAddress && <p className="text-xs text-espresso-500 mt-1 font-medium">Pickup: {listing.pickupAddress}</p>}
                              </div>
                            </div>

                            {/* If adopted, show Adopter info */}
                            {listing.status === 'ADOPTED' && (
                              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-1 w-full md:w-auto shrink-0">
                                <p className="font-black text-emerald-900 uppercase tracking-wider text-[10px] mb-1">Adopter Details</p>
                                <p className="text-espresso-900 font-bold">Name: {listing.adopterInfo?.applicantName || listing.adoptedBy?.name || 'N/A'}</p>
                                <p className="text-espresso-700">Phone: {listing.adopterInfo?.phone || listing.adoptedBy?.phone || 'N/A'}</p>
                                <p className="text-espresso-700">Email: {listing.adopterInfo?.email || listing.adoptedBy?.email || 'N/A'}</p>
                                <p className="text-espresso-700">Payment: {listing.adopterInfo?.paymentMethod || 'Paid'} ({listing.adopterInfo?.paymentStatus || 'Paid'})</p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                              <button 
                                onClick={() => handleToggleListingStatus(listing._id, listing.status)} 
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                  listing.status === 'ADOPTED' ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                              >
                                {listing.status === 'ADOPTED' ? 'Mark as Available' : 'Mark as Adopted'}
                              </button>
                              <button 
                                onClick={() => handleDeleteListing(listing._id)} 
                                className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors" 
                                title="Remove Listing"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
              
</motion.div>
        </AnimatePresence>
      )}

      {/* Appointments Section */}
      <div className="mt-8 mb-12">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-black text-espresso-900 flex items-center gap-2"><Calendar size={24} className="text-camel-500"/> Upcoming Appointments</h2>
            <button onClick={() => navigate('/book-appointment')} className="bg-camel-600 hover:bg-camel-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-camel-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
              <Plus size={16} /> Book Appointment
            </button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.length === 0 ? (
               <div className="col-span-full bg-white rounded-[2rem] border border-camel-100 p-8 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-camel-50 rounded-full flex items-center justify-center text-camel-300 mb-4">
                   <Calendar size={24} />
                 </div>
                 <p className="text-espresso-500 font-bold">No upcoming appointments.</p>
                 <button onClick={() => navigate('/book-appointment')} className="mt-4 text-camel-600 font-bold hover:underline">Schedule one now</button>
               </div>
            ) : appointments.map(appt => (
               <div key={appt._id} className="bg-white rounded-[2rem] border border-camel-100 p-6 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-camel-100 overflow-hidden border border-camel-200">
                       <img 
                         src={getImageUrl(appt.petId?.avatarUrl, getSpeciesFallback(appt.petId?.species))} 
                         alt={appt.petId?.name || 'Pet'} 
                         className="w-full h-full object-cover" 
                         onError={(e) => { e.target.onerror = null; e.target.src = getSpeciesFallback(appt.petId?.species); }}
                       />
                     </div>
                     <div>
                       <h3 className="font-black text-espresso-900 leading-tight">{appt.petId?.name}</h3>
                       <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest mt-0.5">{appt.severity}</p>
                     </div>
                   </div>
                   <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${appt.status === 'WAITING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{appt.status}</span>
                 </div>
                 
                 <div className="space-y-2 mb-4 bg-[#FAF8F5] p-3 rounded-xl border border-camel-50">
                   <div className="flex items-center gap-2 text-sm text-espresso-900">
                     <Calendar size={14} className="text-camel-500 shrink-0" />
                     <span className="font-bold">{new Date(appt.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-espresso-600">
                     <Stethoscope size={14} className="text-camel-400 shrink-0" />
                     <span className="font-medium">Dr. {appt.vetId?.name}</span>
                   </div>
                 </div>
                 
                 <p className="text-xs text-espresso-500 italic line-clamp-2 border-l-2 border-camel-200 pl-3">"{appt.reason}"</p>
               </div>
            ))}
         </div>
      </div>

      {/* Add Pet Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 
                 
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-bg-secondary">
                    <h2 className="text-xl font-display font-black text-espresso-900">{isEditMode ? 'Edit Pet Profile' : 'Add New Pet'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>

                 <div className="p-8 flex-1 overflow-y-auto">
                    {modalError && (
                      <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
                        <AlertCircle size={16} /> {modalError}
                      </div>
                    )}
                    
                    <form onSubmit={handleAddPetSubmit} className="space-y-5">
                       
                       {/* Avatar Upload */}
                       <div className="flex flex-col items-center justify-center mb-6">
                         <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-camel-300 flex items-center justify-center bg-camel-50 overflow-hidden group cursor-pointer">
                           {avatarPreview ? (
                             <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             <Camera className="text-camel-400 group-hover:text-camel-600 transition-colors" size={32} />
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="text-white" size={24} />
                           </div>
                           <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                         </div>
                         <span className="text-xs font-bold text-espresso-400 uppercase tracking-widest mt-3">Upload Photo</span>
                       </div>

                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Pet Name</label>
                         <input type="text" value={newPet.name} onChange={(e) => setNewPet({...newPet, name: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="E.g. Buddy" required />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Species</label>
                           <select value={newPet.species} onChange={(e) => setNewPet({...newPet, species: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none">
                             <option value="Dog">Dog</option>
                             <option value="Cat">Cat</option>
                             <option value="Bird">Bird</option>
                             <option value="Other">Other</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Breed</label>
                           <input type="text" value={newPet.breed} onChange={(e) => setNewPet({...newPet, breed: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="Golden Retriever" required />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Gender</label>
                           <select value={newPet.gender} onChange={(e) => setNewPet({...newPet, gender: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none">
                             <option value="Male">Male</option>
                             <option value="Female">Female</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Age (Years)</label>
                           <input type="number" step="0.1" value={newPet.age} onChange={(e) => setNewPet({...newPet, age: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="E.g. 2.5" />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Current Weight (kg)</label>
                           <input type="number" step="0.1" value={newPet.weight} onChange={(e) => setNewPet({...newPet, weight: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="E.g. 28.5" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Microchip ID</label>
                           <input type="text" value={newPet.microchipId} onChange={(e) => setNewPet({...newPet, microchipId: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="Optional" />
                         </div>
                       </div>
                       
                       <button type="submit" disabled={isSubmitting} className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-4">
                         {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Complete Registration')} <ArrowRight size={16} />
                       </button>
                    </form>
                 </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsDeleteModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 
                 <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
                      <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-display font-black text-espresso-900 mb-2">Remove Pet?</h2>
                    <p className="text-sm font-medium text-espresso-600 mb-8">
                      Are you sure you want to remove <strong>{petToDelete?.name}</strong> from your ecosystem? This action cannot be undone.
                    </p>
                    
                    <div className="flex w-full gap-3">
                      <button onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting} className="flex-1 bg-camel-50 hover:bg-camel-100 text-espresso-800 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleDeletePet} disabled={isDeleting} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-colors shadow-md">
                        {isDeleting ? 'Removing...' : 'Yes, Remove'}
                      </button>
                    </div>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Log Vitals Modal */}
      <AnimatePresence>
        {isVitalsModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsVitalsModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-bg-secondary">
                    <h2 className="text-xl font-display font-black text-espresso-900">Log Weight</h2>
                    <button onClick={() => setIsVitalsModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>

                 <div className="p-8">
                    {vitalsError && (
                      <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
                        <AlertCircle size={16} /> {vitalsError}
                      </div>
                    )}
                    
                    <form onSubmit={handleVitalsSubmit} className="space-y-5">
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">New Weight (kg)</label>
                         <input type="number" step="0.1" value={vitalsWeight} onChange={(e) => setVitalsWeight(e.target.value)} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-4 text-center text-2xl font-black text-espresso-900 focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all shadow-inner" placeholder="29.5" required autoFocus />
                       </div>
                       
                       <button type="submit" disabled={isVitalsSubmitting} className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-4">
                         {isVitalsSubmitting ? 'Saving...' : 'Update Vitals'} <ArrowRight size={16} />
                       </button>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Add Vaccine Modal */}
      <AnimatePresence>
        {isVaccineModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsVaccineModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#FAF8F5] rounded-[2rem] w-full max-w-md shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-display font-black text-espresso-900">Add Vaccine Record</h2>
                    <button onClick={() => setIsVaccineModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className="p-8">
                    <form onSubmit={handleAddVaccine} className="space-y-5">
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Vaccine Name</label>
                         <input type="text" required value={vaccineForm.name} onChange={e => setVaccineForm({...vaccineForm, name: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. Rabies" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Date Administered</label>
                         <input type="date" required value={vaccineForm.dateAdministered} onChange={e => setVaccineForm({...vaccineForm, dateAdministered: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Next Due Date</label>
                         <input type="date" value={vaccineForm.nextDue} onChange={e => setVaccineForm({...vaccineForm, nextDue: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Status</label>
                         <select value={vaccineForm.status} onChange={e => setVaccineForm({...vaccineForm, status: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all appearance-none">
                           <option>Up to Date</option>
                           <option>Due Soon</option>
                           <option>Overdue</option>
                         </select>
                       </div>
                       <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-2">Save Record</button>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Add Document Modal */}
      <AnimatePresence>
        {isDocModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsDocModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#FAF8F5] rounded-[2rem] w-full max-w-md shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-display font-black text-espresso-900">Upload Medical Document</h2>
                    <button onClick={() => setIsDocModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className="p-8">
                    <form onSubmit={handleAddDocument} className="space-y-5">
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Document Title</label>
                         <input type="text" required value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. Annual Bloodwork" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Document Type</label>
                         <select value={docForm.docType} onChange={e => setDocForm({...docForm, docType: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all appearance-none">
                           <option>X-Ray</option>
                           <option>Lab Report</option>
                           <option>Insurance</option>
                           <option>Certificate</option>
                           <option>Other</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Upload File</label>
                         <input type="file" onChange={e => setDocFile(e.target.files[0])} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                         <p className="text-[10px] text-camel-600 mt-2 italic px-1">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                       </div>
                       <button type="submit" className="w-full bg-camel-600 hover:bg-camel-700 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-2 flex justify-center items-center gap-2"><Upload size={16}/> Upload to Vault</button>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}





