import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, Activity, Thermometer, FileDigit, Syringe, Calendar, FileText, ActivitySquare, ShieldAlert, Heart, MoreHorizontal } from 'lucide-react';

export default function VetHub() {
  const [loading, setLoading] = useState(true);
  const [activePatient, setActivePatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [queue, setQueue] = useState([]);

  // Deep, highly-detailed mock clinical data
  const initialMockQueue = [
    { 
      id: 'PT-101', 
      petName: 'Buddy', 
      breed: 'Golden Retriever',
      age: '3 Yrs 2 Mos',
      petImage: '/images/pet-1.jpg',
      owner: 'Sarah Jenkins', 
      ownerImage: '/images/owner-1.jpg',
      time: '10:30 AM', 
      status: 'In Progress', 
      type: 'Annual Checkup',
      vitals: { weight: '28.6 kg', temp: '101.2 °F', hr: '80 bpm' },
      notes: "Buddy is here for his annual checkup and DHPP booster. Owner noted slight lethargy yesterday after a long run.",
      history: [
        { date: 'Oct 20, 2024', event: 'DHPP Vaccine Administered' },
        { date: 'May 12, 2024', event: 'Flea & Tick Prevention Refill' }
      ]
    },
    { 
      id: 'PT-102', 
      petName: 'Luna',
      breed: 'Persian Cat',
      age: '2 Yrs 5 Mos', 
      petImage: '/images/pet-2.jpg',
      owner: 'Mike Ross', 
      ownerImage: '/images/owner-2.jpg',
      time: '11:15 AM', 
      status: 'Waiting', 
      type: 'Vaccination',
      vitals: { weight: '4.2 kg', temp: '100.5 °F', hr: '120 bpm' },
      notes: "Routine Rabies and FVRCP vaccination. No known allergies.",
      history: [
        { date: 'Jan 05, 2024', event: 'Annual Checkup - Healthy' }
      ]
    },
    { 
      id: 'PT-103', 
      petName: 'Max',
      breed: 'Beagle',
      age: '5 Yrs 1 Mo', 
      petImage: '/images/pet-3.jpg',
      owner: 'Emma Stone', 
      ownerImage: '/images/owner-3.jpg',
      time: '12:00 PM', 
      status: 'Scheduled', 
      type: 'Skin Allergy',
      vitals: { weight: '12.4 kg', temp: '102.1 °F', hr: '95 bpm' },
      notes: "Severe scratching on hind legs. Possible contact dermatitis. Prescribe topical cream.",
      history: [
        { date: 'Jul 18, 2024', event: 'Treated for ear infection' },
        { date: 'Mar 22, 2024', event: 'Allergy panel drawn' }
      ]
    },
    { 
      id: 'PT-104', 
      petName: 'Bella',
      breed: 'French Bulldog',
      age: '1 Yr 8 Mos', 
      petImage: '/images/pet-1.jpg',
      owner: 'John Doe', 
      ownerImage: '/images/pet-owner.jpg',
      time: '02:30 PM', 
      status: 'Scheduled', 
      type: 'Post-Op Review',
      vitals: { weight: '9.8 kg', temp: '101.0 °F', hr: '105 bpm' },
      notes: "Two weeks post-spay checkup. Check incision site for proper healing.",
      history: [
        { date: 'Oct 01, 2024', event: 'Ovariohysterectomy (Spay)' }
      ]
    },
  ];

  useEffect(() => {
    // Simulate network fetch
    // TODO: Replace with backend API call (e.g., fetch('/api/vet/queue'))
    setTimeout(() => {
      setQueue(initialMockQueue);
      setLoading(false);
      setActivePatient(initialMockQueue[0]); // Auto-select first patient
    }, 800);
  }, []);

  // Filter Logic
  const filteredQueue = queue.filter(patient => {
    const matchesSearch = 
      patient.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === "All" || patient.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Action Handlers
  const handleFilterToggle = () => {
    const filters = ["All", "Waiting", "In Progress", "Scheduled"];
    const currentIndex = filters.indexOf(statusFilter);
    setStatusFilter(filters[(currentIndex + 1) % filters.length]);
  };

  const handleBeginExamination = () => {
    // TODO: Replace with backend API call (e.g., POST /api/vet/examine/{patient.id})
    if (!activePatient) return;
    
    const updatedQueue = queue.map(p => 
      p.id === activePatient.id ? { ...p, status: 'In Progress' } : p
    );
    setQueue(updatedQueue);
    setActivePatient({ ...activePatient, status: 'In Progress' });
    
    alert(`Examination started for ${activePatient.petName}. Status updated to IN PROGRESS.`);
  };

  const handleOrderMeds = () => alert(`Opening pharmacy modal for ${activePatient?.petName}...`);
  const handleViewLabs = () => alert(`Loading lab results for ${activePatient?.petName}...`);

  const getStatusDot = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500 animate-pulse';
      case 'Waiting': return 'bg-accent-500';
      default: return 'bg-espresso-300';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-camel-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">Clinical Workspace</p>
          <h1 className="text-3xl md:text-4xl font-display font-black text-espresso-900 tracking-tight">
            Veterinary Hub
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
            <input type="text" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-4 py-3 rounded-full border border-camel-100 bg-white text-sm font-medium focus:outline-none focus:border-camel-400 focus:ring-1 focus:ring-camel-400 w-full md:w-64 shadow-sm transition-all"
            />
          </div>
          <button onClick={handleFilterToggle} title={`Filter: ${statusFilter}`} className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-camel-100 text-espresso-500 hover:text-camel-600 hover:border-camel-300 shadow-sm transition-colors relative">
            <Filter size={18} />{statusFilter !== "All" && <span className="absolute top-0 right-0 w-3 h-3 bg-camel-600 border-2 border-white rounded-full"></span>}
          </button>
        </div>
      </div>

      {/* High-Density 3-Pane Architecture */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANE 1: VET PROFILE & GLOBAL STATS (Col 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-32">
          
          {/* Vet ID Card */}
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-camel-50 shadow-sm relative">
               <img src="/images/vet-portrait.jpg" alt="Dr. Mark Thorne" className="w-full h-full object-cover" />
               <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="text-xl font-display font-black text-espresso-900 tracking-tight">Dr. M. Thorne</h2>
            <p className="text-sm font-bold text-camel-600 mt-1">Lead Veterinarian</p>
            <div className="w-full h-[1px] bg-camel-100/50 my-5"></div>
            <div className="flex justify-around w-full">
              <div>
                <p className="text-2xl font-black text-espresso-900">12</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400 mt-1">Patients</p>
              </div>
              <div className="w-[1px] h-full bg-camel-100/50"></div>
              <div>
                <p className="text-2xl font-black text-espresso-900">2</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400 mt-1">Surgeries</p>
              </div>
            </div>
          </div>

          {/* Mini Calendar/Schedule */}
          <div className="bg-[#FAF8F5] rounded-[2rem] p-6 border border-camel-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-display font-bold text-espresso-900">Schedule</h3>
              <Calendar size={16} className="text-camel-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-camel-400"></div>
                <p className="text-xs font-bold text-espresso-600 w-16">10:00 AM</p>
                <p className="text-xs font-medium text-espresso-900">Rounds & Charts</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <p className="text-xs font-bold text-espresso-600 w-16">10:30 AM</p>
                <p className="text-xs font-bold text-espresso-900">Consultations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div>
                <p className="text-xs font-bold text-espresso-600 w-16">01:00 PM</p>
                <p className="text-xs font-medium text-espresso-900">Surgery Block</p>
              </div>
            </div>
          </div>
        </div>

        {/* PANE 2: THE ACTIVE QUEUE (Col 4) */}
        <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2 px-2">
            <h2 className="text-lg font-display font-bold text-espresso-900">Active Queue</h2>
            <p className="text-xs font-bold text-camel-600">{filteredQueue.length} {statusFilter === "All" ? "Patients" : statusFilter}</p>
          </div>
          
          {filteredQueue.map((patient) => (
            <motion.div 
              key={patient.id} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
              onClick={() => setActivePatient(patient)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`p-5 rounded-[1.5rem] cursor-pointer transition-all border relative overflow-hidden group ${activePatient?.id === patient.id ? 'bg-camel-50 border-camel-300 shadow-md' : 'bg-white border-camel-100 shadow-sm hover:border-camel-300 hover:shadow-md'}`}
            >
              {/* Active Indicator Bar */}
              {activePatient?.id === patient.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-camel-500 rounded-l-[1.5rem]"></div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                 <div className="flex -space-x-3 items-center">
                    <img src={patient.petImage} alt="Pet" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm relative z-10" />
                    <img src={patient.ownerImage} alt="Owner" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-0 translate-y-1" />
                 </div>
                 <div className="text-right">
                   <span className="text-xs font-bold text-espresso-500 flex items-center justify-end gap-1"><Clock size={12}/> {patient.time}</span>
                   <div className="flex items-center justify-end gap-1.5 mt-1">
                     <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(patient.status)}`}></div>
                     <span className="text-[9px] font-black uppercase tracking-wider text-espresso-600">{patient.status}</span>
                   </div>
                 </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-espresso-900 tracking-tight">{patient.petName} <span className="text-xs font-medium text-espresso-400 font-sans ml-1">({patient.id})</span></h3>
                <p className="text-sm font-bold text-camel-700 mt-0.5">{patient.type}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* PANE 3: DEEP CLINICAL CHART (Col 5) */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-[calc(100vh-10rem)] bg-white rounded-[2rem] border border-camel-100 shadow-sm overflow-hidden flex flex-col">
          
          <AnimatePresence mode="wait">
            {activePatient ? (
              <motion.div 
                key={activePatient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide"
              >
                {/* Cover Image & Primary Info */}
                <div className="h-56 relative shrink-0">
                   <img src={activePatient.petImage} className="w-full h-full object-cover" alt="Pet Cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/40 to-transparent"></div>
                   
                   <div className="absolute top-4 right-4 flex gap-2">
                     <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                       <MoreHorizontal size={18} />
                     </button>
                   </div>
                   
                   <div className="absolute bottom-0 left-0 w-full p-6 text-white flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-display font-black tracking-tight">{activePatient.petName}</h2>
                        <div className="flex gap-3 items-center mt-1">
                          <span className="text-sm font-medium text-white/90">{activePatient.breed}</span>
                          <span className="w-1 h-1 rounded-full bg-white/50"></span>
                          <span className="text-sm font-medium text-white/90">{activePatient.age}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <img src={activePatient.ownerImage} className="w-10 h-10 rounded-full border-2 border-white/20 ml-auto mb-1 object-cover" alt="Owner" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">{activePatient.owner}</span>
                      </div>
                   </div>
                </div>
                
                {/* Clinical Content Area */}
                <div className="p-6 flex-1 flex flex-col gap-8 bg-white">
                  
                  {/* Vitals Architectural Grid */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-4 flex items-center gap-2">
                      <ActivitySquare size={14}/> Current Vitals
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#FAF8F5] border border-camel-100 rounded-[1.25rem] p-4 text-center">
                          <Activity className="mx-auto mb-2 text-camel-500" size={20}/>
                          <p className="text-xl font-black text-espresso-900 tracking-tight">{activePatient.vitals.hr}</p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-espresso-400 mt-1">Heart Rate</p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-camel-100 rounded-[1.25rem] p-4 text-center">
                          <Thermometer className="mx-auto mb-2 text-camel-500" size={20}/>
                          <p className="text-xl font-black text-espresso-900 tracking-tight">{activePatient.vitals.temp}</p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-espresso-400 mt-1">Temperature</p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-camel-100 rounded-[1.25rem] p-4 text-center">
                          <Heart className="mx-auto mb-2 text-camel-500" size={20}/>
                          <p className="text-xl font-black text-espresso-900 tracking-tight">{activePatient.vitals.weight}</p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-espresso-400 mt-1">Weight</p>
                        </div>
                    </div>
                  </div>
                  
                  {/* Intake Notes (Editorial Style) */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-4 flex items-center gap-2">
                      <FileText size={14}/> Intake Notes
                    </h3>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-camel-200 rounded-full"></div>
                      <p className="pl-5 text-sm font-medium text-espresso-800 leading-relaxed italic">
                          "{activePatient.notes}"
                      </p>
                    </div>
                  </div>

                  {/* Medical History Timeline */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-4 flex items-center gap-2">
                      <Clock size={14}/> Recent History
                    </h3>
                    <div className="space-y-4 pl-1 border-l border-camel-100 ml-2">
                      {activePatient.history.map((hist, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-camel-300 ring-4 ring-white"></div>
                          <p className="text-sm font-bold text-espresso-900">{hist.event}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400 mt-0.5">{hist.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Fixed Action Footer */}
                <div className="p-6 bg-white border-t border-camel-100 mt-auto shrink-0 space-y-3">
                  <button onClick={handleBeginExamination} className="w-full py-3.5 rounded-full bg-camel-600 text-white font-bold text-sm hover:bg-camel-700 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"><ShieldAlert size={16} /> Begin Examination</button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleOrderMeds} className="py-3 rounded-full bg-[#FAF8F5] border border-camel-200 text-espresso-900 font-bold text-sm hover:bg-camel-50 transition-all flex justify-center items-center gap-2"><Syringe size={16} className="text-camel-600"/> Order Meds</button>
                    <button onClick={handleViewLabs} className="py-3 rounded-full bg-[#FAF8F5] border border-camel-200 text-espresso-900 font-bold text-sm hover:bg-camel-50 transition-all flex justify-center items-center gap-2"><FileDigit size={16} className="text-camel-600"/> View Labs</button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 h-full">
                <div className="w-24 h-24 bg-camel-50 rounded-full flex items-center justify-center mb-6">
                  <FileText size={40} className="text-camel-300" />
                </div>
                <h3 className="text-xl font-display font-bold text-espresso-900 mb-2">No Patient Selected</h3>
                <p className="text-sm font-medium text-espresso-500 max-w-xs">Select a patient from the active queue to view their clinical chart.</p>
              </div>
            )}
          </AnimatePresence>

        </div>

      </motion.div>
    </>
  );
}





