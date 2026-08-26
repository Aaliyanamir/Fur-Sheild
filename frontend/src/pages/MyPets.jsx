import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, ArrowRight, Edit2, Trash2, Camera, Upload, AlertCircle, X, Activity, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboard.service';

export default function MyPets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add/Edit Pet Modal State
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

  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getOwnerDashboardData();
      if (response.success) {
        setPets(response.data);
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
    fetchPets();
  }, []);

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
    setAvatarPreview(pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : `http://localhost:5000${pet.avatarUrl}`) : null);
    setModalError('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (pet) => {
    setPetToDelete(pet);
    setIsDeleteModalOpen(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
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
        await fetchPets();
        setIsModalOpen(false);
      } else {
        setModalError(petResponse.message || `Failed to ${isEditMode ? 'update' : 'add'} pet`);
      }
    } catch (err) {
      setModalError(`Error ${isEditMode ? 'updating' : 'adding'} pet. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePet = async () => {
    if (!petToDelete) return;
    setIsDeleting(true);
    try {
      const res = await dashboardService.deletePet(petToDelete._id);
      if (res.success) {
        await fetchPets();
        setIsDeleteModalOpen(false);
        setPetToDelete(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-camel-200 border-t-camel-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-camel-100 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-camel-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-2">Pet Management Hub</p>
            <h1 className="text-4xl md:text-5xl font-display font-black text-espresso-900 tracking-tight">
              My Digital Pet Family
            </h1>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md hover:-translate-y-0.5 w-max">
            <Plus size={18} /> Register New Pet
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {pets.length === 0 && !error ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3rem] p-16 text-center border border-camel-100 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto mt-12">
            <div className="w-24 h-24 rounded-full bg-camel-50 flex items-center justify-center text-camel-400 mb-6 shadow-inner">
               <PawPrint size={40} />
            </div>
            <h2 className="text-3xl font-display font-black text-espresso-900 mb-4">No Pets Found</h2>
            <p className="text-espresso-500 font-medium mb-10 text-lg leading-relaxed">
              Your digital family is currently empty. Add your first pet to generate their digital passport and start managing their health ecosystem.
            </p>
            <button onClick={openAddModal} className="bg-camel-600 hover:bg-camel-500 text-white px-10 py-4 rounded-full font-bold shadow-md shadow-camel-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 text-lg">
              <Plus size={20} /> Add Your First Pet
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {pets.map((pet) => (
              <motion.div key={pet._id} variants={itemVariants} className="group relative bg-white rounded-[2.5rem] border border-camel-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col">
                {/* Top Image Section */}
                <div className="relative w-full aspect-[4/3] bg-camel-50 overflow-hidden">
                  <img 
                    src={pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : `http://localhost:5000${pet.avatarUrl}`) : '/images/product-placeholder.jpg'} 
                    alt={pet.name} 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  
                  {/* Healthy Pill */}
                  <div className="absolute top-5 left-5 bg-emerald-50/90 text-emerald-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5 shadow-sm border border-emerald-100/50">
                    <CheckCircle2 size={14} /> Healthy
                  </div>
                  
                  {/* Actions Overlay */}
                  <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <button onClick={() => openEditModal(pet)} className="w-11 h-11 bg-white/90 backdrop-blur-md text-espresso-600 hover:text-espresso-900 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                       <Edit2 size={18} />
                     </button>
                     <button onClick={() => openDeleteModal(pet)} className="w-11 h-11 bg-white/90 backdrop-blur-md text-rose-500 hover:text-rose-700 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                       <Trash2 size={18} />
                     </button>
                  </div>
                </div>

                {/* Bottom Details Section */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <h3 className="text-[32px] font-display font-black text-espresso-900 tracking-tight leading-none mb-2">{pet.name}</h3>
                    <p className="text-sm font-bold text-camel-600 uppercase tracking-widest">{pet.breed} • {pet.species}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5 mb-8">
                    {pet.gender && (
                      <span className="bg-camel-50/80 border border-camel-100 text-espresso-700 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">{pet.gender}</span>
                    )}
                    {pet.age && (
                      <span className="bg-camel-50/80 border border-camel-100 text-espresso-700 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">{pet.age} Years</span>
                    )}
                    {pet.microchipId && (
                      <span className="bg-camel-50/80 border border-camel-100 text-espresso-700 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Activity size={12} /> {pet.microchipId}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-camel-100/60">
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg">
                       View Health Dashboard <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Add / Edit Pet Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-bg-secondary">
                    <h2 className="text-xl font-display font-black text-espresso-900">{isEditMode ? 'Edit Pet Profile' : 'Register Digital Passport'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>

                 <div className="p-8 flex-1 overflow-y-auto max-h-[80vh]">
                    {modalError && (
                      <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
                        <AlertCircle size={16} /> {modalError}
                      </div>
                    )}
                    
                    <form onSubmit={handleAddPetSubmit} className="space-y-5">
                       
                       {/* Avatar Upload */}
                       <div className="flex flex-col items-center justify-center mb-8">
                         <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-camel-300 flex items-center justify-center bg-camel-50 overflow-hidden group cursor-pointer shadow-sm">
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
                         <span className="text-xs font-bold text-espresso-400 uppercase tracking-widest mt-4">Upload Passport Photo</span>
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
                         {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Generate Passport')} <ArrowRight size={16} />
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
                    <h2 className="text-xl font-display font-black text-espresso-900 mb-2">Remove Record?</h2>
                    <p className="text-sm font-medium text-espresso-600 mb-8 leading-relaxed">
                      Are you sure you want to delete <strong>{petToDelete?.name}</strong>'s passport? This action is permanent and cannot be undone.
                    </p>
                    
                    <div className="flex w-full gap-3">
                      <button onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting} className="flex-1 bg-camel-50 hover:bg-camel-100 text-espresso-800 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleDeletePet} disabled={isDeleting} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-colors shadow-md">
                        {isDeleting ? 'Removing...' : 'Yes, Delete'}
                      </button>
                    </div>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
