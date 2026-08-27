const fs = require('fs');
const original = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.txt', 'utf8');

let newCode = original;

// 1. Imports
newCode = newCode.replace(
  "import { Search, Filter, Clock, Activity, Thermometer, FileDigit, Syringe, Calendar, FileText, ActivitySquare, ShieldAlert, Heart, MoreHorizontal } from 'lucide-react';",
  "import { Search, Filter, Clock, Activity, Thermometer, FileDigit, Syringe, Calendar, FileText, ActivitySquare, ShieldAlert, Heart, MoreHorizontal, Plus, AlertCircle, X, CheckCircle2, Trash2 } from 'lucide-react';\nimport vetService from '../services/vet.service';\nimport { AuthContext } from '../context/AuthContext';\nimport { useContext } from 'react';"
);

// 2. Component top
newCode = newCode.replace(
  "export default function VetHub() {\n  const [loading, setLoading] = useState(true);",
  "export default function VetHub() {\n  const { user } = useContext(AuthContext);\n  const [loading, setLoading] = useState(true);\n  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);\n  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);\n  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);\n  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);\n  const [vitalsForm, setVitalsForm] = useState({ temp: '', hr: '', weight: '', notes: '' });\n  const [walkinForm, setWalkinForm] = useState({ petName: '', breed: '', species: 'Dog', age: '', ownerName: '', reason: '', severity: 'ROUTINE' });"
);

// 3. Remove initialMockQueue and the old useEffect
const mockQueueRegex = /const initialMockQueue = \[[\s\S]*?\];/;
newCode = newCode.replace(mockQueueRegex, '');

const oldUseEffectRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;
const fetchQueueCode = `
  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await vetService.getQueue();
      if (res.success) {
        const mappedQueue = res.data.map(appt => {
          const isWalkin = !appt.petId && appt.walkInDetails;
          return {
            id: appt._id,
            petName: isWalkin ? appt.walkInDetails.petName : (appt.petId?.name || 'Unknown Pet'),
            breed: isWalkin ? appt.walkInDetails.breed : (appt.petId?.breed || 'Unknown'),
            age: isWalkin ? appt.walkInDetails.age : 'Adult',
            petImage: appt.petId?.avatarUrl ? (appt.petId.avatarUrl.startsWith('http') ? appt.petId.avatarUrl : \`http://localhost:5000\${appt.petId.avatarUrl}\`) : '/images/pet-1.jpg',
            owner: isWalkin ? appt.walkInDetails.ownerName : (appt.ownerId?.name || 'Walk-in'),
            ownerImage: '/images/owner-1.jpg',
            time: new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appt.status === 'EXAM' ? 'In Progress' : (appt.status === 'WAITING' ? 'Waiting' : 'Discharged'),
            type: appt.reason,
            vitals: {
              hr: appt.vitals?.heartRate ? \`\${appt.vitals.heartRate} bpm\` : '-- bpm',
              temp: appt.vitals?.temperature ? \`\${appt.vitals.temperature} °C\` : '-- °C',
              weight: appt.vitals?.weight ? \`\${appt.vitals.weight} kg\` : '-- kg',
            },
            notes: appt.medicalNotes || 'No intake notes provided.',
            history: [
              { date: new Date(appt.scheduledAt).toLocaleDateString(), event: 'Registered to queue' }
            ]
          };
        });
        setQueue(mappedQueue);
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
`;
newCode = newCode.replace(oldUseEffectRegex, fetchQueueCode);

// 4. Update Header with the button
const headerSearchRegex = /<div className="flex gap-3">\n\s*<div className="relative">/g;
newCode = newCode.replace(
  headerSearchRegex,
  `<div className="flex gap-3 items-center">\n          <button onClick={() => setIsWalkinModalOpen(true)} className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-5 py-3 rounded-full font-bold text-sm tracking-wide shadow-sm transition-transform hover:-translate-y-0.5 whitespace-nowrap">\n            <Plus size={16} /> Add Walk-in\n          </button>\n          <div className="relative hidden md:block">`
);

// 5. Replace Vet Profile logic
const drMarkThorneRegex = /<h2 className="text-xl font-display font-black text-espresso-900 tracking-tight">Dr\. M\. Thorne<\/h2>/;
newCode = newCode.replace(
  drMarkThorneRegex,
  `<h2 className="text-xl font-display font-black text-espresso-900 tracking-tight">Dr. {user?.name?.split(' ')[user?.name?.split(' ').length - 1] || 'Vet'}</h2>`
);
const patientsCountRegex = /<p className="text-2xl font-black text-espresso-900">12<\/p>/;
newCode = newCode.replace(
  patientsCountRegex,
  `<p className="text-2xl font-black text-espresso-900">{queue.length}</p>`
);

// 6. Action Handlers logic
const handleBeginExaminationRegex = /const handleBeginExamination = \(\) => \{[\s\S]*?alert\([\s\S]*?\);\n  \};/;
const handleBeginExaminationNew = `const handleBeginExamination = async () => {
    if (!activePatient) return;
    await vetService.updateStatus(activePatient.id, 'EXAM');
    await fetchQueue();
  };
  
  const handleUpdateVitals = async (e) => {
    e.preventDefault();
    await vetService.updateVitalsAndNotes(activePatient.id, {
      vitals: { heartRate: vitalsForm.hr, temperature: vitalsForm.temp, weight: vitalsForm.weight },
      medicalNotes: vitalsForm.notes
    });
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
    await vetService.createAppointment({
      reason: walkinForm.reason,
      severity: walkinForm.severity,
      walkInDetails: { petName: walkinForm.petName, breed: walkinForm.breed, species: walkinForm.species, age: walkinForm.age, ownerName: walkinForm.ownerName }
    });
    setWalkinForm({ petName: '', breed: '', species: 'Dog', age: '', ownerName: '', reason: '', severity: 'ROUTINE' });
    setIsWalkinModalOpen(false);
    await fetchQueue();
  };

  const openUpdateModal = () => {
    setVitalsForm({
      temp: activePatient.vitals.temp.replace(' °C', '').replace('--', ''),
      hr: activePatient.vitals.hr.replace(' bpm', '').replace('--', ''),
      weight: activePatient.vitals.weight.replace(' kg', '').replace('--', ''),
      notes: activePatient.notes === 'No intake notes provided.' ? '' : activePatient.notes
    });
    setIsUpdateModalOpen(true);
    setIsStatusDropdownOpen(false);
  };
`;
newCode = newCode.replace(handleBeginExaminationRegex, handleBeginExaminationNew);

// 7. Right column ellipsis button and dropdown
const oldEllipsisButton = /<button className="w-10 h-10 rounded-full bg-white\/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white\/30 transition-colors">\n\s*<MoreHorizontal size=\{18\} \/>\n\s*<\/button>/;
const newEllipsisButton = `<button onClick={(e) => { e.stopPropagation(); setIsStatusDropdownOpen(!isStatusDropdownOpen); }} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">\n                       <MoreHorizontal size={18} />\n                     </button>\n                     <AnimatePresence>\n                       {isStatusDropdownOpen && (\n                         <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-camel-100 overflow-hidden z-50">\n                           <div className="px-4 py-2 border-b border-camel-50 bg-camel-50/50">\n                             <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Actions</p>\n                           </div>\n                           <button onClick={openUpdateModal} className="w-full text-left px-4 py-3 text-sm font-bold text-espresso-700 hover:bg-camel-50 transition-colors flex items-center gap-2"><Activity size={14} className="text-camel-500" /> Update Vitals</button>\n                           <button onClick={() => handleChangeStatus('EXAM')} className="w-full text-left px-4 py-3 text-sm font-bold text-espresso-700 hover:bg-camel-50 transition-colors flex items-center gap-2"><ShieldAlert size={14} className="text-blue-500" /> Begin Exam</button>\n                           <button onClick={() => handleChangeStatus('DISCHARGED')} className="w-full text-left px-4 py-3 text-sm font-bold text-espresso-700 hover:bg-camel-50 transition-colors flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Discharge</button>\n                           <div className="border-t border-camel-100 my-1"></div>\n                           <button onClick={() => { setIsStatusDropdownOpen(false); setIsCancelModalOpen(true); }} className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"><Trash2 size={14} /> Cancel Appointment</button>\n                         </motion.div>\n                       )}\n                     </AnimatePresence>`;
newCode = newCode.replace(oldEllipsisButton, newEllipsisButton);

// 8. Add Modals at the bottom
const endRegex = /<\/motion\.div>\n\s*<\/>\n\s*\);\n\}/;
const modalsCode = `</motion.div>

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
}`;

newCode = newCode.replace(endRegex, modalsCode);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', newCode);
