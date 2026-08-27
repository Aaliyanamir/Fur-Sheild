const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', 'utf8');

const startIndex = code.indexOf('{/* RIGHT COLUMN: Health Data & Analytics */}');
const endIndex = code.indexOf('</motion.div>', startIndex);

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

                    {/* Advanced Charting Block */}
                    <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                          <h3 className="font-display font-bold text-xl text-espresso-900 mb-1">Weight Trajectory</h3>
                          <p className="text-xs font-bold text-espresso-400 uppercase tracking-widest">Historical Data</p>
                        </div>
                        <button onClick={() => setIsVitalsModalOpen(true)} className="flex items-center justify-center gap-2 bg-camel-50 hover:bg-camel-100 text-camel-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors border border-camel-200 shadow-sm shrink-0">
                          <Plus size={16} /> Log Weight
                        </button>
                      </div>
      
                      <div className="h-64 w-full">
                        {activePet.weightHistory && activePet.weightHistory.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activePet.weightHistory.map(entry => ({ 
                               date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                               weight: entry.weight 
                            }))}>
                              <defs>
                                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#BA7F48" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#BA7F48" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9e1" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8b7355', fontSize: 10, fontWeight: 700}} dy={10} />
                              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#8b7355', fontSize: 10, fontWeight: 700}} dx={-10} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(90,56,37,0.1)', fontWeight: 'bold' }}
                                itemStyle={{ color: '#3E2A20' }}
                              />
                              <Area type="monotone" dataKey="weight" stroke="#BA7F48" strokeWidth={3} fillOpacity={1} fill="url(#weightGrad)" />
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
                          <a key={idx} href={doc.fileUrl ? (doc.fileUrl.startsWith('http') || doc.fileUrl.startsWith('/images') || doc.fileUrl.startsWith('/uploads') ? doc.fileUrl : \`http://localhost:5000\${doc.fileUrl}\`) : '#'} target="_blank" rel="noreferrer" className="bg-white rounded-2xl p-5 border border-camel-100 shadow-sm flex items-center gap-4 hover:border-camel-300 hover:shadow-md transition-all group">
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
              
`;

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = code.substring(0, startIndex) + newRightColumn + code.substring(endIndex);
  fs.writeFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', newCode);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find start or end index.", startIndex, endIndex);
}
