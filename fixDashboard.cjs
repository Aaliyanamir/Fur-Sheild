const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', 'utf8');

const oldHandleAddPet = `  const handleAddPetSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);
    try {
      // 1. Create Pet
      const petResponse = await dashboardService.addNewPet({
        name: newPet.name,
        species: newPet.species,
        breed: newPet.breed
      });

      if (petResponse.success) {
        const createdPet = petResponse.data;
        // 2. If weight was provided, add it to vitals
        if (newPet.weight) {
           await dashboardService.updatePetVitals(createdPet._id, { weight: parseFloat(newPet.weight) });
        }
        
        // Refresh dashboard data to get complete updated records
        await fetchDashboardData();
        
        // Close and reset
        setIsModalOpen(false);
        setNewPet({ name: '', species: 'Dog', breed: '', weight: '' });
        // Set active to the newly created pet (which will be at index 0 because of reverse sorting in backend)
        setActivePetIndex(0);
      } else {
        setModalError(petResponse.message || "Failed to add pet");
      }
    } catch (err) {
      setModalError("Error adding pet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };`;

const newHandleAddPet = `  const handleImageChange = (e) => {
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
  };`;

code = code.replace(oldHandleAddPet, newHandleAddPet);


const oldPetTitleArea = `                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-display font-black text-espresso-900 tracking-tight">{activePet.name}</h2>
                      <p className="text-camel-600 font-bold mt-1">{activePet.breed} • {activePet.species}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-camel-50 flex items-center justify-center text-camel-600">
                      <PawPrint size={24} />
                    </div>
                  </div>`;

const newPetTitleArea = `                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-display font-black text-espresso-900 tracking-tight">{activePet.name}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-camel-600 font-bold">{activePet.breed} • {activePet.species}</span>
                        {activePet.age && <span className="text-camel-600 font-bold">• {activePet.age} yrs</span>}
                        {activePet.gender && <span className="text-camel-600 font-bold">• {activePet.gender}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(activePet)} className="w-12 h-12 rounded-full bg-camel-50 border border-camel-100 flex items-center justify-center text-camel-600 hover:text-espresso-900 hover:border-camel-300 transition-colors shadow-sm" aria-label="Edit Pet">
                        <Edit2 size={20} />
                      </button>
                      <button onClick={() => openDeleteModal(activePet)} className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-100 transition-colors shadow-sm" aria-label="Delete Pet">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>`;

code = code.replace(oldPetTitleArea, newPetTitleArea);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', code);
