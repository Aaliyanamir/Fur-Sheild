const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', 'utf8');

// Add the Add Walk-in logic
const walkinLogic = `
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
`;

code = code.replace("if (loading) {", walkinLogic + "\n  if (loading) {");

// Add button to header
const oldHeader = `<div className="flex gap-3 items-center">
          <div className="relative">`;
const newHeader = `<div className="flex gap-3 items-center">
          <button onClick={() => setIsWalkinModalOpen(true)} className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-5 py-3 rounded-full font-bold text-sm tracking-wide shadow-sm transition-transform hover:-translate-y-0.5 whitespace-nowrap">
            <Plus size={16} /> Add Walk-in
          </button>
          <div className="relative hidden md:block">`;
code = code.replace(oldHeader, newHeader);

// Add the Walkin Modal JSX right before </AnimatePresence> of Cancel Modal
const walkinModal = `
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
`;
code = code.replace("    </>\n  );\n}", walkinModal + "\n    </>\n  );\n}");

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', code);
