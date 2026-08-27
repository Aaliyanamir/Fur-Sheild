const fs = require('fs');

let content = fs.readFileSync('d:\\Pet-Care\\frontend\\src\\pages\\OwnerDashboard.txt', 'utf8');

// 1. Add new icons
content = content.replace(
  "import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, PawPrint, HeartHandshake, Syringe, Stethoscope, AlertCircle, X } from 'lucide-react';",
  "import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, PawPrint, HeartHandshake, Syringe, Stethoscope, AlertCircle, X, Edit2, Trash2, Camera, Upload } from 'lucide-react';"
);

// 2. Add New States
const newStates = `
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
`;

content = content.replace(
  /  \/\/ Add Pet Modal State[\s\S]*?const \[modalError, setModalError\] = useState\(''\);/,
  newStates
);

// 3. New Modal Open Handlers
const modalHandlers = `
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
    setAvatarPreview(pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : \`http://localhost:5000\${pet.avatarUrl}\`) : null);
    setModalError('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (pet) => {
    setPetToDelete(pet);
    setIsDeleteModalOpen(true);
  };
`;

content = content.replace(
  "  const fetchDashboardData = async () => {",
  modalHandlers + "\n  const fetchDashboardData = async () => {"
);

// 4. Update the active tabs to use openAddModal
content = content.replace(
  /onClick=\{\(\) => setIsModalOpen\(true\)\}/g,
  "onClick={openAddModal}"
);

// 5. Replace handleAddPetSubmit with the FormData version
const handleAddPetSubmitStr = `
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
        // If weight was provided and it's new/different, add to vitals
        if (newPet.weight && (!isEditMode || (processedPet.weightHistory?.length === 0 || processedPet.weightHistory[processedPet.weightHistory.length - 1]?.weight != newPet.weight))) {
           await dashboardService.updatePetVitals(processedPet._id, { weight: parseFloat(newPet.weight) });
        }
        
        await fetchDashboardData();
        
        setIsModalOpen(false);
        if (!isEditMode) setActivePetIndex(0);
      } else {
        setModalError(petResponse.message || \`Failed to \${isEditMode ? 'update' : 'add'} pet\`);
      }
    } catch (err) {
      setModalError(\`Error \${isEditMode ? 'updating' : 'adding'} pet. Please try again.\`);
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
`;

content = content.replace(
  /  const handleAddPetSubmit = async \(e\) => \{[\s\S]*?setIsSubmitting\(false\);\s*\n\s*\};\n/,
  handleAddPetSubmitStr + "\n"
);

// 6. Update the Pet Title area to include Edit and Delete buttons
const petTitleArea = `
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-[32px] md:text-[40px] font-display font-black text-espresso-900 leading-none mb-2">
                              {activePet.name}
                            </h2>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-espresso-500 uppercase tracking-widest">{activePet.species} • {activePet.breed}</span>
                              {activePet.age && <span className="text-sm font-bold text-espresso-500 uppercase tracking-widest">• {activePet.age} yrs</span>}
                              {activePet.gender && <span className="text-sm font-bold text-espresso-500 uppercase tracking-widest">• {activePet.gender}</span>}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal(activePet)} className="w-10 h-10 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 hover:border-camel-300 transition-colors shadow-sm" aria-label="Edit Pet">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => openDeleteModal(activePet)} className="w-10 h-10 rounded-full bg-white border border-rose-200 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm" aria-label="Delete Pet">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
`;
content = content.replace(
  /<div className="flex justify-between items-start">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  petTitleArea + "\n                        </div>"
);

// Fix potential missing closing div
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="bg-camel-100\/50 rounded-\[32px\] p-8 flex items-center gap-6 border border-camel-200\/50">/g,
  "</div>\n                          <div className=\"bg-camel-100/50 rounded-[32px] p-8 flex items-center gap-6 border border-camel-200/50\">"
);
content = content.replace(petTitleArea + "\n                        </div>\n                        </div>", petTitleArea);


// 7. Update Modal HTML Form
const modalForm = `
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
`;
content = content.replace(
  /<div className="p-6 border-b border-camel-100 flex justify-between items-center bg-bg-secondary">[\s\S]*?<\/form>\s*<\/div>/,
  modalForm
);

// 8. Add Delete Confirmation Modal just before Log Vitals Modal
const deleteModal = `
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
`;
content = content.replace(
  "{/* Log Vitals Modal */}",
  deleteModal + "\n      {/* Log Vitals Modal */}"
);

// Add Avatar Image to the Pet Title area
const avatarDisplay = `
                        <div className="flex justify-between items-start">
                          <div className="flex gap-6 items-center">
                            {activePet.avatarUrl ? (
                              <img src={activePet.avatarUrl.startsWith('http') ? activePet.avatarUrl : \`http://localhost:5000\${activePet.avatarUrl}\`} alt={activePet.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                            ) : (
                              <div className="w-20 h-20 bg-camel-200 text-camel-600 rounded-full flex items-center justify-center shadow-inner">
                                <PawPrint size={40} />
                              </div>
                            )}
                            <div>
                              <h2 className="text-[32px] md:text-[40px] font-display font-black text-espresso-900 leading-none mb-2">
`;
content = content.replace(
  /<div className="flex justify-between items-start">\s*<div>\s*<h2 className="text-\[32px\] md:text-\[40px\] font-display font-black text-espresso-900 leading-none mb-2">/,
  avatarDisplay
);


fs.writeFileSync('d:\\Pet-Care\\frontend\\src\\pages\\OwnerDashboard.jsx', content);
