const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', 'utf8');

// 1. Add Age and Daily Log states
code = code.replace(
  "const [intakeForm, setIntakeForm] = useState({ name: '', breed: '', species: 'Dog', behaviorNotes: '' });",
  "const [intakeForm, setIntakeForm] = useState({ name: '', breed: '', species: 'Dog', age: '', behaviorNotes: '' });\n  const [isLogModalOpen, setIsLogModalOpen] = useState(false);\n  const [logForm, setLogForm] = useState({ activityType: 'Feeding', notes: '' });\n  const [logPetId, setLogPetId] = useState(null);"
);

// 2. Add handleLogSubmit
const newHandlers = `
  const openLogModal = (e, pet) => {
    e.stopPropagation();
    setLogPetId(pet._id);
    setLogForm({ activityType: 'Feeding', notes: '' });
    setIsLogModalOpen(true);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await shelterService.addDailyLog(logPetId, logForm);
      if (res.success) {
        setIsLogModalOpen(false);
        fetchPipeline();
      }
    } catch (error) {
      console.error(error);
    }
  };
`;

code = code.replace(
  "const handleIntakeSubmit = async (e) => {",
  newHandlers + "\n\n  const handleIntakeSubmit = async (e) => {"
);

// 3. Add Age to intake form submission
code = code.replace(
  "formData.append('species', intakeForm.species);",
  "formData.append('species', intakeForm.species);\n      if(intakeForm.age) formData.append('age', intakeForm.age);"
);

// 4. Update the Kanban card to have the Clipboard/ClipboardEdit button
code = code.replace(
  "truncate\">{pet.name}</h4>",
  "truncate\">{pet.name}</h4>\n                                  <button onClick={(e) => openLogModal(e, pet)} className=\"w-6 h-6 rounded-full bg-camel-50 hover:bg-camel-200 text-camel-600 flex items-center justify-center transition-colors\" title=\"Add Daily Log\"><FileDigit size={12}/></button>"
);

// 5. Add Age Input to Intake Drawer
const ageInput = `
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Species</label>
                         <select value={intakeForm.species} onChange={e => setIntakeForm({...intakeForm, species: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all appearance-none">
                           <option>Dog</option>
                           <option>Cat</option>
                           <option>Bird</option>
                           <option>Other</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Estimated Age</label>
                         <input type="text" value={intakeForm.age} onChange={e => setIntakeForm({...intakeForm, age: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" placeholder="e.g. 2 yrs" />
                       </div>
                     </div>
`;

code = code.replace(
  /<div>\s*<label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Species<\/label>[\s\S]*?<\/select>\s*<\/div>/,
  ageInput
);

// 6. Add Log Modal JSX
const logModalJSX = `
      {/* Daily Log Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsLogModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#FAF8F5] rounded-[2rem] w-full max-w-sm shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-display font-black text-espresso-900">Add Daily Log</h2>
                    <button onClick={() => setIsLogModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className="p-8">
                    <form onSubmit={handleLogSubmit} className="space-y-5">
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Activity Type</label>
                         <select required value={logForm.activityType} onChange={e => setLogForm({...logForm, activityType: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all appearance-none">
                           <option>Feeding</option>
                           <option>Grooming</option>
                           <option>Medication</option>
                           <option>Walk/Exercise</option>
                           <option>Other</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Notes</label>
                         <textarea required rows="4" value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all resize-none" placeholder="Add specific details here..." />
                       </div>
                       <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-2 flex items-center justify-center gap-2">
                         <Activity size={16} /> Save Log
                       </button>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
`;

const insertionIndex = code.lastIndexOf("    </div>");
if (insertionIndex !== -1) {
  code = code.substring(0, insertionIndex) + logModalJSX + "\n" + code.substring(insertionIndex);
}

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', code);
