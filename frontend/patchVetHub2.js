const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', 'utf8');

const modalsCode = `
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
                           {vetImagePreview ? <img src={vetImagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-camel-300">Upload</div>}
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
                       <div className="flex flex-col items-center mb-4">
                         <div className="relative w-24 h-24 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                           {editPatientImagePreview ? <img src={editPatientImagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-camel-300">Upload</div>}
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files[0];
                             if(file) {
                               setEditPatientImageFile(file);
                               setEditPatientImagePreview(URL.createObjectURL(file));
                             }
                           }} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                         <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Change Pet Photo</p>
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
`;

code = code.replace(/\{(\/\* MODALS \*\/)\}/, '{/* MODALS */}\n' + modalsCode);

// Walkin Modal Image addition
const walkinFormStart = /<form onSubmit=\{handleAddWalkin\} className="space-y-4">/;
const walkinImageAdd = `<form onSubmit={handleAddWalkin} className="space-y-4">
                       <div className="flex flex-col items-center mb-4">
                         <div className="relative w-24 h-24 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                           {walkinImagePreview ? <img src={walkinImagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-camel-300">Upload</div>}
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files[0];
                             if(file) {
                               setWalkinImageFile(file);
                               setWalkinImagePreview(URL.createObjectURL(file));
                             }
                           }} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                         <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Pet Photo</p>
                       </div>`;

code = code.replace(walkinFormStart, walkinImageAdd);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', code);
