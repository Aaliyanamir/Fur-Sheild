const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', 'utf8');

// 1. Add activeViewTab state and document/vaccine modal states
code = code.replace(
  "const [activePetIndex, setActivePetIndex] = useState(0);",
  "const [activePetIndex, setActivePetIndex] = useState(0);\n  const [activeViewTab, setActiveViewTab] = useState('Overview');\n\n  // Medical Modals\n  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);\n  const [isDocModalOpen, setIsDocModalOpen] = useState(false);\n  const [vaccineForm, setVaccineForm] = useState({ name: '', dateAdministered: '', nextDue: '', status: 'Up to Date' });\n  const [docForm, setDocForm] = useState({ title: '', docType: 'X-Ray' });\n  const [docFile, setDocFile] = useState(null);"
);

// 2. Add handlers
const handlers = `
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
`;

code = code.replace("const fetchDashboardData = async () => {", handlers + "\n  const fetchDashboardData = async () => {");

// 3. Update the Right Column Content
const rightColumnRegex = /\{\/\* RIGHT COLUMN: Health Data & Analytics \*\/\}\s*<div className="lg:col-span-8 flex flex-col gap-8">([\s\S]*?)<\/div>\s*\{\/\* Appointments Section \*\/\}/;

const newRightColumn = `
              {/* RIGHT COLUMN: Health Data & Analytics */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-camel-100 pb-2">
                  {['Overview', 'Health Records'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveViewTab(tab)}
                      className={\`text-sm font-bold pb-2 border-b-2 transition-all \${activeViewTab === tab ? 'border-espresso-900 text-espresso-900' : 'border-transparent text-espresso-400 hover:text-camel-600'}\`}
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

                    {/* Weight Trajectory */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-xl text-espresso-900">Weight Trajectory</h3>
                        <button onClick={() => setIsVitalsModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-camel-700 bg-camel-50 hover:bg-camel-100 border border-camel-200 px-4 py-2 rounded-full transition-colors">
                          <Plus size={14} /> Log Weight
                        </button>
                      </div>
                      <div className="bg-white rounded-[2rem] p-6 pt-10 border border-camel-100 shadow-sm h-[300px]">
                        {activePet.weightHistory && activePet.weightHistory.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activePet.weightHistory.map(entry => ({ 
                                ...entry, 
                                displayDate: new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
                              }))}>
                              <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8C7A6B" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#8C7A6B" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D6C5" opacity={0.5} />
                              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C7A6B', fontWeight: 700 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C7A6B', fontWeight: 700 }} dx={-10} domain={['dataMin - 1', 'dataMax + 1']} />
                              <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Area type="monotone" dataKey="weight" stroke="#8C7A6B" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" dot={{ fill: '#8C7A6B', strokeWidth: 2, r: 4, stroke: '#FAF8F5' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#6D5D51' }} />
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
                                <div className={\`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white \${vax.status === 'Up to Date' ? 'bg-emerald-500' : vax.status === 'Due Soon' ? 'bg-amber-400' : 'bg-rose-500'}\`}></div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div>
                                    <h4 className="text-lg font-black text-espresso-900">{vax.name}</h4>
                                    <p className="text-xs font-bold text-espresso-500 mt-1">Administered: {new Date(vax.dateAdministered).toLocaleDateString()}</p>
                                  </div>
                                  <div className="flex flex-col sm:items-end">
                                    <span className={\`text-[10px] font-bold uppercase px-3 py-1 rounded-full w-fit \${vax.status === 'Up to Date' ? 'bg-emerald-50 text-emerald-700' : vax.status === 'Due Soon' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}\`}>{vax.status}</span>
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
                          <a key={idx} href={doc.fileUrl ? (doc.fileUrl.startsWith('http') || doc.fileUrl.startsWith('/images') ? doc.fileUrl : \`http://localhost:5000\${doc.fileUrl}\`) : '#'} target="_blank" rel="noreferrer" className="bg-white rounded-2xl p-5 border border-camel-100 shadow-sm flex items-center gap-4 hover:border-camel-300 hover:shadow-md transition-all group">
                            <div className={\`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 \${doc.docType === 'X-Ray' ? 'bg-indigo-50 text-indigo-500' : doc.docType === 'Lab Report' ? 'bg-sky-50 text-sky-500' : 'bg-emerald-50 text-emerald-500'}\`}>
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

              </div>
              {/* Appointments Section */}
`;

code = code.replace(rightColumnRegex, newRightColumn);


// 4. Modals JSX addition
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

// Insert the new modals right before the closing div
code = code.replace("    </div>\n  );\n}", medicalModalsJSX + "\n    </div>\n  );\n}");

// Add missing icon FileText
code = code.replace(
  "import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, PawPrint, HeartHandshake, Syringe, Stethoscope, AlertCircle, X, Edit2, Trash2, Camera, Upload } from 'lucide-react';",
  "import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, PawPrint, HeartHandshake, Syringe, Stethoscope, AlertCircle, X, Edit2, Trash2, Camera, Upload, FileText, Activity } from 'lucide-react';"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', code);
