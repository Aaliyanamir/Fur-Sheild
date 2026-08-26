import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MoreHorizontal, Clock, Heart, AlertCircle, LayoutGrid, List, Activity, Users, X, Sparkles, Loader2, QrCode, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ShelterHub() {
  // BACKEND PREP: Kanban State Data
  const [pipelineData] = useState([
    { id: 'RSC-001', name: 'Oliver', breed: 'Beagle Mix', species: 'Dog', status: 'Intake', intakeDate: '2 hrs ago', health: 'Evaluating', isUrgent: false, image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=300&q=80' },
    { id: 'RSC-002', name: 'Daisy', breed: 'Domestic Shorthair', species: 'Cat', status: 'Medical Hold', intakeDate: '2 days ago', health: 'Under Treatment', isUrgent: true, image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=300&q=80' },
    { id: 'RSC-003', name: 'Rocky', breed: 'German Shepherd', species: 'Dog', status: 'Medical Hold', intakeDate: '5 days ago', health: 'Recovering', isUrgent: true, image: 'https://images.unsplash.com/photo-1589976328127-cb0163952d7e?auto=format&fit=crop&w=300&q=80' },
    { id: 'RSC-004', name: 'Milo', breed: 'Pug', species: 'Dog', status: 'Available', intakeDate: '2 weeks ago', health: 'Cleared', isUrgent: false, image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80' },
    { id: 'RSC-005', name: 'Chloe', breed: 'Siamese', species: 'Cat', status: 'Available', intakeDate: '3 weeks ago', health: 'Cleared', isUrgent: false, image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=300&q=80' },
    { id: 'RSC-006', name: 'Bella', breed: 'Labrador', species: 'Dog', status: 'Adopted', intakeDate: '1 month ago', health: 'Cleared', isUrgent: false, image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=300&q=80' },
  ]);

  const columns = [
    { id: 'Intake', title: 'New Intake', color: 'bg-espresso-100 text-espresso-700' },
    { id: 'Medical Hold', title: 'Medical Hold', color: 'bg-accent-50 text-accent-700' },
    { id: 'Available', title: 'Ready for Adoption', color: 'bg-camel-50 text-camel-700' },
    { id: 'Adopted', title: 'Adopted', color: 'bg-emerald-50 text-emerald-700' }
  ];

  const springTransition = { type: 'spring', damping: 25, stiffness: 200, ease: [0.16, 1, 0.3, 1] };

  // UI States
  const [activeFilter, setActiveFilter] = useState('All Rescues');
  const [selectedPet, setSelectedPet] = useState(null);
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rawNotes, setRawNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const filterOptions = ['All Rescues', 'Dogs Only', 'Cats Only', 'Urgent Medical'];

  const filteredData = pipelineData.filter(pet => {
    if (activeFilter === 'Dogs Only') return pet.species === 'Dog';
    if (activeFilter === 'Cats Only') return pet.species === 'Cat';
    if (activeFilter === 'Urgent Medical') return pet.isUrgent || pet.status === 'Medical Hold';
    return true;
  });

  const handleAiAnalysis = (e) => {
    e.preventDefault();
    if (!rawNotes.trim()) return;
    
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

  return (
    <div className="flex-1 flex flex-col w-full font-sans">
      
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 shrink-0 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-xs tracking-[0.25em] uppercase mb-1">Rescue Operations</p>
          <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">
            Shelter Pipeline
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-bg-secondary p-1 rounded-full border border-camel-100">
            <button className="px-4 py-1.5 rounded-full bg-white shadow-sm text-espresso-900 font-bold text-sm flex items-center gap-2">
              <LayoutGrid size={16} /> Board
            </button>
            <button className="px-4 py-1.5 rounded-full text-espresso-500 hover:text-espresso-900 font-bold text-sm flex items-center gap-2 transition-colors">
              <List size={16} /> List
            </button>
          </div>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ID or breed..." 
              className="pl-10 pr-4 py-2 rounded-full border border-camel-100 bg-white text-sm font-medium focus:outline-none focus:border-camel-400 w-56 shadow-sm"
            />
          </div>
          
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 bg-camel-600 hover:bg-camel-500 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_5px_15px_rgba(186,127,72,0.3)]">
            <Plus size={16} /> Intake Rescue
          </button>
        </div>
      </div>

      {/* Premium Telemetry Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-camel-100/50 shadow-sm flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-500 flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Kennel Capacity</p>
            <p className="text-xl font-black text-espresso-900">94% <span className="text-xs font-bold text-accent-500 ml-2">Critical</span></p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-camel-100/50 shadow-sm flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-espresso-900 text-camel-400 flex items-center justify-center shrink-0">
            <Heart size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Active Med Holds</p>
            <p className="text-xl font-black text-espresso-900">12</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-camel-100/50 shadow-sm flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Foster Utilization</p>
            <p className="text-xl font-black text-espresso-900">45</p>
          </div>
        </div>
      </div>

      {/* Micro Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide shrink-0 pb-1">
        {filterOptions.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm whitespace-nowrap border",
              activeFilter === filter 
                ? "bg-espresso-900 text-white border-espresso-900" 
                : "bg-white text-espresso-600 border-camel-100 hover:border-camel-300 hover:bg-camel-50"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Horizontal Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-6 h-full min-w-max items-start">
          
          {columns.map((column) => {
            const columnPets = filteredData.filter(pet => pet.status === column.id);
            
            return (
              <div key={column.id} className="w-[320px] flex flex-col h-[calc(100vh-25rem)]">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-espresso-900">{column.title}</h3>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300", column.color)}>
                      {columnPets.length}
                    </span>
                  </div>
                  <button className="text-espresso-300 hover:text-espresso-900 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Column Cards Container */}
                <div className="flex-1 bg-[#FAF8F5] rounded-[2rem] p-3 border border-camel-100/50 flex flex-col gap-3 overflow-y-auto scrollbar-hide">
                  <AnimatePresence>
                    {columnPets.map(pet => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={springTransition}
                        key={pet.id} 
                        drag
                        dragSnapToOrigin
                        whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0px 20px 40px rgba(186,127,72,0.2)" }}
                        onClick={() => setSelectedPet(pet)}
                        className="bg-white p-4 rounded-[1.5rem] border border-camel-100 shadow-[0_4px_20px_rgba(90,56,37,0.04)] cursor-grab active:cursor-grabbing hover:border-camel-300 hover:shadow-md transition-colors group relative z-10"
                      >
                        <div className="flex gap-4 pointer-events-none">
                          <img src={pet.image} alt={pet.name} className="w-16 h-16 rounded-2xl object-cover border border-camel-50" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-espresso-900 text-lg leading-none">{pet.name}</h4>
                              <span className="text-[9px] font-black tracking-wider text-espresso-400 uppercase">{pet.id}</span>
                            </div>
                            <p className="text-xs font-medium text-camel-600 mt-1">{pet.breed}</p>
                            
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-espresso-500 uppercase">
                                <Clock size={12} /> {pet.intakeDate}
                              </div>
                              {pet.isUrgent && <AlertCircle size={14} className="text-accent-500" />}
                              {pet.status === 'Available' && <Heart size={14} className="text-camel-500" />}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Digital Passport Modal */}
      <AnimatePresence>
        {selectedPet && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/40 backdrop-blur-sm"
            onClick={() => setSelectedPet(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={springTransition}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-camel-100 shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-camel-200/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h2 className="text-2xl font-display font-black text-espresso-900 tracking-tight">Digital Passport</h2>
                  <p className="text-xs font-bold text-camel-600 uppercase tracking-widest mt-1">Official Record</p>
                </div>
                <button onClick={() => setSelectedPet(null)} className="w-10 h-10 rounded-full bg-camel-50 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-6 items-center relative z-10 bg-[#FAF8F5] p-4 rounded-[2rem] border border-camel-100">
                <img src={selectedPet.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm border-2 border-white" />
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-espresso-900 leading-none">{selectedPet.name}</h3>
                  <p className="text-sm font-medium text-espresso-500 mt-1">{selectedPet.breed}</p>
                  <p className="text-[10px] font-bold text-camel-500 uppercase tracking-widest mt-2">{selectedPet.id}</p>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-camel-100">
                  <QrCode size={48} className="text-espresso-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-white p-4 rounded-2xl border border-camel-100 shadow-sm text-center">
                  <p className="text-[10px] font-bold text-espresso-400 uppercase tracking-widest">Status</p>
                  <p className="text-sm font-black text-espresso-900 mt-1">{selectedPet.status}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-camel-100 shadow-sm text-center">
                  <p className="text-[10px] font-bold text-espresso-400 uppercase tracking-widest">Health</p>
                  <p className="text-sm font-black text-espresso-900 mt-1">{selectedPet.health}</p>
                </div>
              </div>

              <button className="w-full bg-camel-600 hover:bg-camel-500 text-white py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-[0_5px_15px_rgba(186,127,72,0.3)] relative z-10 flex items-center justify-center gap-2">
                <FileText size={18} /> Generate PDF Passport
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Triage Slide-Out Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Glassmorphic Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-40"
            />
            
            {/* Side Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={springTransition}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFBF7] shadow-2xl z-50 overflow-y-auto flex flex-col border-l border-white/20"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h2 className="text-xl font-display font-black text-espresso-900 tracking-tight">Intake Rescue</h2>
                  <p className="text-xs font-bold text-camel-600 uppercase tracking-widest mt-1">AI-Assisted Processing</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 rounded-full bg-camel-50 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 flex-1 flex flex-col gap-6 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-camel-200/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-camel-200 shadow-sm shrink-0">
                    <Sparkles size={18} className="text-camel-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-espresso-900">AI Intake Triage</h3>
                    <p className="text-xs font-medium text-espresso-500">Auto-generate medical protocols from field notes.</p>
                  </div>
                </div>

                <form onSubmit={handleAiAnalysis} className="flex flex-col gap-4 relative z-10">
                  <textarea 
                    rows="5"
                    placeholder="Enter raw field notes (e.g., 'Found stray beagle, limping back right leg, very thin...')"
                    value={rawNotes}
                    onChange={(e) => setRawNotes(e.target.value)}
                    className="w-full bg-white border border-camel-200 rounded-2xl p-4 text-sm font-medium text-espresso-900 focus:outline-none focus:border-camel-500 focus:ring-1 focus:ring-camel-500 resize-none shadow-sm"
                  ></textarea>
                  
                  <button 
                    type="submit" 
                    disabled={isAnalyzing || !rawNotes.trim()}
                    className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? <><Loader2 size={16} className="animate-spin" /> Synthesizing...</> : 'Analyze Field Notes'}
                  </button>
                </form>

                {/* AI Result Container */}
                <AnimatePresence>
                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, height: 0 }} 
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 pt-6 border-t border-camel-200/60 overflow-hidden"
                    >
                      <div className="mb-4">
                        <span className="inline-block bg-accent-100 text-accent-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-accent-200 mb-2">
                          {aiResult.severity}
                        </span>
                        <p className="text-xs font-bold text-espresso-900">{aiResult.risk}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-camel-100 shadow-sm">
                        <p className="text-[10px] font-bold text-camel-500 uppercase tracking-widest mb-3">Suggested Protocol</p>
                        <ul className="space-y-2">
                          {aiResult.protocol.map((step, i) => (
                            <li key={i} className="text-sm font-medium text-espresso-700 flex items-start gap-2 leading-tight">
                              <span className="text-camel-400">•</span> {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button className="w-full mt-6 py-3.5 rounded-2xl bg-camel-600 hover:bg-camel-500 text-white font-bold text-sm tracking-wide transition-all shadow-md">
                        Approve & Create Profile
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

