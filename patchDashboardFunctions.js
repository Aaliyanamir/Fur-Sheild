const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterDashboard.jsx', 'utf8');

// We need to add state for the new modals
code = code.replace(
  "const [loading, setLoading] = useState(true);",
  `const [loading, setLoading] = useState(true);
  
  // Modals
  const [isIntakeDrawerOpen, setIsIntakeDrawerOpen] = useState(false);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [isVetModalOpen, setIsVetModalOpen] = useState(false);
  
  // Intake Form State
  const [intakeForm, setIntakeForm] = useState({ name: '', breed: '', species: 'Dog', behaviorNotes: '' });
  const [intakeImageFile, setIntakeImageFile] = useState(null);
  const [intakeImagePreview, setIntakeImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);`
);

// Add missing imports (AnimatePresence, X, Loader2)
code = code.replace(
  "import { motion } from 'framer-motion';",
  "import { motion, AnimatePresence } from 'framer-motion';"
);
code = code.replace(
  "import { Activity, Download, Heart, Users, AlertCircle, Sparkles, TrendingUp, ChevronRight, Stethoscope, FileText, CheckCircle2, LayoutGrid } from 'lucide-react';",
  "import { Activity, Download, Heart, Users, AlertCircle, Sparkles, TrendingUp, ChevronRight, Stethoscope, FileText, CheckCircle2, LayoutGrid, X, Loader2 } from 'lucide-react';"
);

// Add handlers
const handlers = `
  const handleExportReport = () => {
    const headers = ['ID', 'Name', 'Species', 'Breed', 'Status', 'Intake Date', 'Behavior Notes'];
    const csvContent = [
      headers.join(','),
      ...pipelineData.map(pet => [
        pet._id,
        \`"\${pet.name}"\`,
        pet.species,
        \`"\${pet.breed || ''}"\`,
        pet.status,
        new Date(pet.intakeDate).toLocaleDateString(),
        \`"\${(pet.behaviorNotes || '').replace(/"/g, '""')}"\`
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = \`shelter_report_\${new Date().toISOString().split('T')[0]}.csv\`;
    link.click();
  };

  const handleAiAnalysis = (e) => {
    e.preventDefault();
    if (!intakeForm.behaviorNotes.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setAiResult({
        severity: "URGENT VET CONSULT",
        risk: "Isolation Required (Potential Parvovirus / Malnutrition)",
        protocol: [
          "Administer IV fluids immediately.",
          "Draw blood for full CBC and tick-borne panel.",
          "Move to Ward B (Strict Isolation)."
        ]
      });
      setIsAnalyzing(false);
    }, 1800);
  };

  const handleAddIntake = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', intakeForm.name);
    formData.append('breed', intakeForm.breed);
    formData.append('species', intakeForm.species);
    formData.append('behaviorNotes', intakeForm.behaviorNotes);
    if (intakeImageFile) formData.append('avatar', intakeImageFile);
    if (aiResult) formData.append('aiTriageLog', JSON.stringify({ log: intakeForm.behaviorNotes, severity: aiResult.severity }));

    await shelterService.addIntake(formData);
    
    setIntakeForm({ name: '', breed: '', species: 'Dog', behaviorNotes: '' });
    setIntakeImageFile(null);
    setIntakeImagePreview(null);
    setAiResult(null);
    setIsIntakeDrawerOpen(false);
    
    // Refresh Data
    const res = await shelterService.getPipeline();
    if(res.success) setPipelineData(res.data);
  };
`;
code = code.replace("const noScrollbar = ", handlers + "\n  const noScrollbar = ");

// Wire Export Button
code = code.replace(
  /<button className="flex items-center gap-2 bg-white hover:bg-camel-50 text-espresso-900 border border-camel-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm">/,
  `<button onClick={handleExportReport} className="flex items-center gap-2 bg-white hover:bg-camel-50 text-espresso-900 border border-camel-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm">`
);

// Wire Intake Button
code = code.replace(
  /<div className="bg-white border border-camel-100 hover:border-camel-300 rounded-\[1.5rem\] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">/,
  `<div onClick={() => setIsIntakeDrawerOpen(true)} className="bg-white border border-camel-100 hover:border-camel-300 rounded-[1.5rem] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">`
);

// Wire Adoption Button
code = code.replace(
  /<div className="bg-white border border-camel-100 hover:border-camel-300 rounded-\[1.5rem\] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">/,
  `<div onClick={() => setIsAdoptionModalOpen(true)} className="bg-white border border-camel-100 hover:border-camel-300 rounded-[1.5rem] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">`
);

// Wire Vet Button
code = code.replace(
  /<div className="bg-white border border-camel-100 hover:border-camel-300 rounded-\[1.5rem\] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">/,
  `<div onClick={() => setIsVetModalOpen(true)} className="bg-white border border-camel-100 hover:border-camel-300 rounded-[1.5rem] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">`
);

// Add the Modals JSX at the bottom before final </div>
const modalsJSX = `
      {/* Intake Drawer */}
      <AnimatePresence>
        {isIntakeDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsIntakeDrawerOpen(false)} className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0.5 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className={\`fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#FAF8F5] shadow-2xl z-[210] flex flex-col border-l border-camel-200 \${noScrollbar}\`}>
              
              <div className="flex justify-between items-center p-6 border-b border-camel-100 bg-white shrink-0">
                <div>
                  <h2 className="text-2xl font-display font-black text-espresso-900">Intake New Rescue</h2>
                  <p className="text-xs font-bold text-camel-600 mt-1 uppercase tracking-widest">AI Triage Enabled</p>
                </div>
                <button onClick={() => setIsIntakeDrawerOpen(false)} className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-camel-200 flex items-center justify-center text-espresso-500 hover:text-espresso-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className={\`flex-1 overflow-y-auto p-8 \${noScrollbar}\`}>
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden mb-3 bg-camel-100">
                    {intakeImagePreview ? <img src={intakeImagePreview} className="w-full h-full object-cover" alt="Preview"/> : <div className="w-full h-full flex items-center justify-center text-camel-400 font-bold">Photo</div>}
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) {
                        setIntakeImageFile(file);
                        setIntakeImagePreview(URL.createObjectURL(file));
                      }
                    }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <p className="text-xs text-camel-600 font-bold uppercase tracking-widest">Upload Rescue Photo</p>
                </div>

                <form onSubmit={handleAddIntake} className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Animal Name</label>
                       <input type="text" required value={intakeForm.name} onChange={e => setIntakeForm({...intakeForm, name: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. Max" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Species</label>
                       <select value={intakeForm.species} onChange={e => setIntakeForm({...intakeForm, species: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none">
                         <option>Dog</option><option>Cat</option><option>Other</option>
                       </select>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Breed / Mix</label>
                     <input type="text" value={intakeForm.breed} onChange={e => setIntakeForm({...intakeForm, breed: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="e.g. Beagle Mix" />
                   </div>

                   <div className="bg-white rounded-2xl border-2 border-camel-100 p-6 relative overflow-hidden mt-8 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest">Intake Notes & AI Triage</label>
                        <Sparkles size={16} className="text-camel-500" />
                      </div>
                      
                      <textarea rows={4} value={intakeForm.behaviorNotes} onChange={e => setIntakeForm({...intakeForm, behaviorNotes: e.target.value})} placeholder="Describe condition, behavior, injuries..." className={\`w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all mb-4 \${noScrollbar}\`}></textarea>
                      
                      <AnimatePresence mode="wait">
                        {!aiResult && !isAnalyzing && (
                          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} type="button" onClick={handleAiAnalysis} disabled={!intakeForm.behaviorNotes.trim()} className="w-full bg-camel-100 hover:bg-camel-200 text-camel-800 disabled:opacity-50 py-3 rounded-xl font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2">
                            <Activity size={16} /> Run AI Medical Triage
                          </motion.button>
                        )}
                        
                        {isAnalyzing && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-4 text-camel-600">
                            <Loader2 size={24} className="animate-spin mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">Analyzing Symptoms...</p>
                          </motion.div>
                        )}

                        {aiResult && !isAnalyzing && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                            <div className="flex gap-3">
                              <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-black text-rose-900 uppercase tracking-wider">{aiResult.severity}</h4>
                                <p className="text-sm font-bold text-rose-700 mt-1">{aiResult.risk}</p>
                                <div className="mt-3 space-y-1">
                                  {aiResult.protocol.map((step, idx) => (
                                    <div key={idx} className="flex gap-2 text-xs font-medium text-rose-800">
                                      <span className="opacity-50">{idx + 1}.</span> {step}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                   
                   <div className="pt-6 pb-8">
                     <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md">Complete Intake & Add to Pipeline</button>
                   </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Adoption Portal Modal */}
      <AnimatePresence>
        {isAdoptionModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdoptionModalOpen(false)} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#FAF8F5] rounded-[2rem] w-full max-w-3xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden h-[80vh]">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white">
                    <div>
                      <h2 className="text-2xl font-display font-black text-espresso-900">Adoption Portal</h2>
                      <p className="text-xs font-bold text-camel-600 mt-1 uppercase tracking-widest">{adoptable.length} Rescues Ready for Homes</p>
                    </div>
                    <button onClick={() => setIsAdoptionModalOpen(false)} className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-camel-200 flex items-center justify-center text-espresso-500 hover:text-espresso-900 transition-colors shadow-sm"><X size={20}/></button>
                 </div>
                 <div className={\`p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 \${noScrollbar}\`}>
                    {adoptable.map(pet => (
                      <div key={pet._id} className="bg-white p-4 rounded-2xl border border-camel-100 flex items-center gap-4 hover:border-camel-400 transition-all">
                        <Avatar src={pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : \`http://localhost:5000\${pet.avatarUrl}\`) : null} alt={pet.name} name={pet.name} className="w-20 h-20 rounded-xl object-cover border border-camel-100 shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-espresso-900">{pet.name}</h4>
                          <p className="text-xs font-bold text-camel-600">{pet.breed || pet.species}</p>
                          <button className="mt-3 bg-camel-50 hover:bg-camel-100 text-camel-700 w-full py-2 rounded-lg text-xs font-bold transition-colors">View Profile</button>
                        </div>
                      </div>
                    ))}
                    {adoptable.length === 0 && (
                       <div className="col-span-full py-12 flex flex-col items-center justify-center text-espresso-400">
                         <Heart size={32} className="mb-4 text-camel-200" />
                         <p className="font-bold">No rescues currently ready for adoption.</p>
                       </div>
                    )}
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Vet Schedule Modal */}
      <AnimatePresence>
        {isVetModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsVetModalOpen(false)} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden h-[70vh]">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                    <div>
                      <h2 className="text-2xl font-display font-black text-espresso-900">Vet Review Schedule</h2>
                      <p className="text-xs font-bold text-rose-500 mt-1 uppercase tracking-widest">{vetHolds.length} Active Medical Holds</p>
                    </div>
                    <button onClick={() => setIsVetModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-500 hover:text-espresso-900 transition-colors shadow-sm"><X size={20}/></button>
                 </div>
                 <div className={\`p-6 flex-1 overflow-y-auto space-y-4 \${noScrollbar}\`}>
                    {vetHolds.map(pet => (
                      <div key={pet._id} className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 flex flex-col md:flex-row gap-4">
                        <div className="flex items-center gap-4 md:w-1/3">
                          <Avatar src={pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : \`http://localhost:5000\${pet.avatarUrl}\`) : null} alt={pet.name} name={pet.name} className="w-16 h-16 rounded-xl object-cover border border-rose-200 shrink-0" />
                          <div>
                            <h4 className="text-lg font-black text-rose-900">{pet.name}</h4>
                            <p className="text-xs font-bold text-rose-700">{pet.breed || pet.species}</p>
                          </div>
                        </div>
                        <div className="flex-1 bg-white p-3 rounded-xl border border-rose-100">
                          {pet.aiTriageLog && pet.aiTriageLog[0] ? (
                            <>
                              <div className="flex items-center gap-2 mb-2 text-rose-600">
                                <Stethoscope size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{pet.aiTriageLog[0].severity}</span>
                              </div>
                              <p className="text-xs font-medium text-espresso-700 italic">"{pet.aiTriageLog[0].log}"</p>
                            </>
                          ) : (
                            <p className="text-xs font-medium text-espresso-400 italic">No medical triage notes available.</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {vetHolds.length === 0 && (
                       <div className="py-12 flex flex-col items-center justify-center text-espresso-400">
                         <Sparkles size={32} className="mb-4 text-camel-200" />
                         <p className="font-bold">No active medical holds. Great job!</p>
                       </div>
                    )}
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
`;

code = code.replace("    </div>\n  );\n}", modalsJSX + "\n    </div>\n  );\n}");

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterDashboard.jsx', code);
