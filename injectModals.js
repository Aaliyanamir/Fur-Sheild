const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', 'utf8');

const medicalModalsJSX = `
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
`;

// Insert the medicalModalsJSX right before the final closing tag.
// Instead of matching exact whitespace, we can just replace the last occurrence of "    </div>" or find the position.
const insertionIndex = code.lastIndexOf("    </div>");
if (insertionIndex !== -1) {
  const newCode = code.substring(0, insertionIndex) + medicalModalsJSX + "\n" + code.substring(insertionIndex);
  fs.writeFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', newCode);
  console.log("Modals injected successfully!");
} else {
  console.log("Could not find insertion point.");
}

