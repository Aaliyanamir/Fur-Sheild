import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MoreHorizontal, Clock, Heart, AlertCircle, LayoutGrid, List, Activity, Users, X, Sparkles, Loader2, FileDigit, Trash2, Edit3 } from 'lucide-react';
import shelterService from '../services/shelter.service';

const Avatar = ({ src, alt, name, className }) => {
  const [error, setError] = useState(false);
  if (error || !src || src.includes('product-placeholder')) {
    return (
      <div className={`flex items-center justify-center font-bold text-espresso-500 bg-camel-100 ${className}`}>
        {name ? name.charAt(0).toUpperCase() : 'U'}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

export default function ShelterHub() {
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [activeFilter, setActiveFilter] = useState('All Rescues');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'
  
  // Drawer/Modal States
  const [isIntakeDrawerOpen, setIsIntakeDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // Forms
  const [intakeForm, setIntakeForm] = useState({ name: '', breed: '', species: 'Dog', behaviorNotes: '' });
  const [intakeImageFile, setIntakeImageFile] = useState(null);
  const [intakeImagePreview, setIntakeImagePreview] = useState(null);

  const [editForm, setEditForm] = useState({ name: '', breed: '', species: 'Dog', behaviorNotes: '', status: 'INTAKE' });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // AI Logic
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      const res = await shelterService.getPipeline();
      if (res.success) {
        setPipelineData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const columns = [
    { id: 'INTAKE', title: 'New Intake', color: 'bg-espresso-100 text-espresso-700' },
    { id: 'VET_HOLD', title: 'Medical Hold', color: 'bg-accent-50 text-accent-700' },
    { id: 'ADOPTABLE', title: 'Ready for Adoption', color: 'bg-camel-50 text-camel-700' },
    { id: 'ADOPTED', title: 'Adopted', color: 'bg-emerald-50 text-emerald-700' }
  ];

  const getStatusBadge = (statusId) => {
    const col = columns.find(c => c.id === statusId);
    if (!col) return null;
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${col.color}`}>{col.title}</span>;
  };

  const filteredData = pipelineData.filter(pet => {
    let matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeFilter === 'Dogs Only') return pet.species === 'Dog';
    if (activeFilter === 'Cats Only') return pet.species === 'Cat';
    if (activeFilter === 'Urgent Medical') return pet.status === 'VET_HOLD' || (pet.aiTriageLog && pet.aiTriageLog[0]?.severity === 'URGENT VET CONSULT');
    return true;
  });

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
    fetchPipeline();
  };

  const openEditModal = (pet) => {
    setSelectedPet(pet);
    setEditForm({ 
      name: pet.name, 
      breed: pet.breed || '', 
      species: pet.species || 'Dog', 
      behaviorNotes: pet.behaviorNotes || '',
      status: pet.status || 'INTAKE'
    });
    setEditImagePreview(pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : `http://localhost:5000${pet.avatarUrl}`) : null);
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('breed', editForm.breed);
    formData.append('species', editForm.species);
    formData.append('behaviorNotes', editForm.behaviorNotes);
    if (editImageFile) formData.append('avatar', editImageFile);

    // Update basic info
    await shelterService.updateAnimal(selectedPet._id, formData);
    
    // Update status if changed
    if (editForm.status !== selectedPet.status) {
      await shelterService.updateStatus(selectedPet._id, editForm.status);
    }
    
    setIsEditModalOpen(false);
    fetchPipeline();
  };

  const handleDelete = async () => {
    if(window.confirm("Are you sure you want to remove this rescue completely?")) {
      await shelterService.deleteAnimal(selectedPet._id);
      setIsEditModalOpen(false);
      fetchPipeline();
    }
  };

  const getRelativeTime = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diffDays = Math.round((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : rtf.format(diffDays, 'day');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-camel-600"></div>
      </div>
    );
  }

  // Scrollbar hiding utility classes
  const noScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    <div className={`flex-1 flex flex-col w-full font-sans ${noScrollbar}`}>
      
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 shrink-0 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-xs tracking-[0.25em] uppercase mb-1">Rescue Operations</p>
          <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">
            Shelter Pipeline
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-full border border-camel-100 shadow-sm">
            <button 
              onClick={() => setViewMode('board')} 
              className={`px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${viewMode === 'board' ? 'bg-camel-50 text-espresso-900 shadow-sm' : 'text-espresso-500 hover:text-espresso-900'}`}
            >
              <LayoutGrid size={16} /> Board
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-camel-50 text-espresso-900 shadow-sm' : 'text-espresso-500 hover:text-espresso-900'}`}
            >
              <List size={16} /> List
            </button>
          </div>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Name/Breed..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border border-camel-100 bg-white text-sm font-medium focus:outline-none focus:border-camel-400 w-56 shadow-sm"
            />
          </div>
          
          <button onClick={() => setIsIntakeDrawerOpen(true)} className="flex items-center gap-2 bg-camel-600 hover:bg-camel-500 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_5px_15px_rgba(186,127,72,0.3)]">
            <Plus size={16} /> Intake Rescue
          </button>
        </div>
      </div>

      {/* Global Stats Array */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 shrink-0">
        <div className="bg-white rounded-2xl p-5 border border-camel-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Total Capacity</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-espresso-900 leading-none">{pipelineData.length}</p>
              <span className="text-xs font-bold text-espresso-500">Animals</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-camel-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-espresso-800 text-camel-300 flex items-center justify-center shrink-0">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Active Med Holds</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-espresso-900 leading-none">{pipelineData.filter(a => a.status === 'VET_HOLD').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-camel-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Available to Adopt</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-espresso-900 leading-none">{pipelineData.filter(a => a.status === 'ADOPTABLE').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0 ${noScrollbar}`}>
        {['All Rescues', 'Dogs Only', 'Cats Only', 'Urgent Medical'].map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeFilter === filter 
                ? 'bg-espresso-900 text-white border-espresso-900 shadow-md' 
                : 'bg-white text-espresso-600 border-camel-100 hover:border-camel-300 hover:bg-camel-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* BOARD VIEW */}
      {viewMode === 'board' && (
        <div className={`flex-1 overflow-x-auto min-h-0 pb-4 ${noScrollbar}`}>
          <div className="flex gap-6 min-w-max h-full items-start px-1">
            
            {columns.map(col => {
              const colPets = filteredData.filter(p => p.status === col.id);
              return (
                <div key={col.id} className="w-[320px] flex flex-col shrink-0 h-full max-h-[70vh]">
                  {/* Column Header */}
                  <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-espresso-900 tracking-tight">{col.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.color}`}>{colPets.length}</span>
                    </div>
                  </div>
                  
                  {/* Cards Container */}
                  <div className={`flex-1 overflow-y-auto space-y-4 pr-2 pb-10 ${noScrollbar}`}>
                    <AnimatePresence>
                      {colPets.map((pet) => (
                        <motion.div 
                          layoutId={pet._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={pet._id} 
                          onClick={() => openEditModal(pet)}
                          className="bg-white p-5 rounded-[1.5rem] border border-camel-100 shadow-sm hover:shadow-md hover:border-camel-400 transition-all cursor-pointer relative group"
                        >
                          <div className="flex gap-4">
                            <Avatar 
                               src={pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : `http://localhost:5000${pet.avatarUrl}`) : '/images/product-placeholder.jpg'} 
                               alt={pet.name} 
                               name={pet.name}
                               className="w-16 h-16 rounded-2xl object-cover bg-camel-50 shrink-0 border border-camel-100" 
                            />
                            <div className="flex-1 min-w-0 pt-1">
                              <div className="flex justify-between items-start mb-0.5">
                                <h4 className="text-lg font-display font-black text-espresso-900 truncate">{pet.name}</h4>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-espresso-400 bg-[#FAF8F5] px-2 py-1 rounded-md">{pet._id.slice(-5).toUpperCase()}</span>
                              </div>
                              <p className="text-xs font-bold text-camel-600 truncate">{pet.breed || pet.species}</p>
                              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-widest text-espresso-400">
                                <Clock size={10} /> {getRelativeTime(pet.intakeDate)}
                              </div>
                            </div>
                          </div>

                          {/* Status/Health Indicators */}
                          {pet.aiTriageLog && pet.aiTriageLog.length > 0 && (
                             <div className="mt-4 pt-3 border-t border-camel-50 flex items-center justify-between">
                               <div className="flex items-center gap-1.5">
                                 <AlertCircle size={14} className="text-rose-500" />
                                 <span className="text-xs font-bold text-espresso-700">Needs Vet Review</span>
                               </div>
                             </div>
                          )}

                          {/* Hover Edit Hint */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-camel-500 bg-white/80 rounded-full p-1 backdrop-blur-sm">
                            <Edit3 size={14} />
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
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-[2rem] border border-camel-100 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className={`overflow-auto flex-1 ${noScrollbar}`}>
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAF8F5] sticky top-0 z-10 border-b border-camel-100">
                <tr>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-espresso-400">Animal</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-espresso-400">ID</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-espresso-400">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-espresso-400">Intake Date</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-espresso-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-camel-50">
                {filteredData.length === 0 ? (
                  <tr>
                     <td colSpan="5" className="py-12 text-center text-sm font-medium text-espresso-500">No rescues found matching your criteria.</td>
                  </tr>
                ) : filteredData.map(pet => (
                  <tr key={pet._id} onClick={() => openEditModal(pet)} className="hover:bg-camel-50/50 transition-colors cursor-pointer group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <Avatar 
                           src={pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : `http://localhost:5000${pet.avatarUrl}`) : '/images/product-placeholder.jpg'} 
                           alt={pet.name} 
                           name={pet.name}
                           className="w-10 h-10 rounded-full object-cover bg-camel-100 border border-camel-200 shrink-0" 
                        />
                        <div>
                          <p className="text-sm font-black text-espresso-900">{pet.name}</p>
                          <p className="text-xs font-bold text-camel-600">{pet.breed || pet.species}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-espresso-500 bg-[#FAF8F5] px-2 py-1 rounded-md">{pet._id.slice(-5).toUpperCase()}</span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(pet.status)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-espresso-600 flex items-center gap-1"><Clock size={12}/> {getRelativeTime(pet.intakeDate)}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-camel-500 hover:text-espresso-900 font-bold text-xs flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 size={14}/> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Intake Drawer / Modal */}
      <AnimatePresence>
        {isIntakeDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsIntakeDrawerOpen(false)} className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0.5 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#FAF8F5] shadow-2xl z-[210] flex flex-col border-l border-camel-200 ${noScrollbar}`}>
              
              <div className="flex justify-between items-center p-6 border-b border-camel-100 bg-white shrink-0">
                <div>
                  <h2 className="text-2xl font-display font-black text-espresso-900">Intake New Rescue</h2>
                  <p className="text-xs font-bold text-camel-600 mt-1 uppercase tracking-widest">AI Triage Enabled</p>
                </div>
                <button onClick={() => setIsIntakeDrawerOpen(false)} className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-camel-200 flex items-center justify-center text-espresso-500 hover:text-espresso-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className={`flex-1 overflow-y-auto p-8 ${noScrollbar}`}>
                
                {/* Photo Upload Area */}
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

                   {/* AI Triage Section */}
                   <div className="bg-white rounded-2xl border-2 border-camel-100 p-6 relative overflow-hidden mt-8 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest">Intake Notes & AI Triage</label>
                        <Sparkles size={16} className="text-camel-500" />
                      </div>
                      
                      <textarea rows={4} value={intakeForm.behaviorNotes} onChange={e => setIntakeForm({...intakeForm, behaviorNotes: e.target.value})} placeholder="Describe condition, behavior, injuries..." className={`w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all mb-4 ${noScrollbar}`}></textarea>
                      
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

      {/* Edit Rescue Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedPet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsEditModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                    <h2 className="text-xl font-display font-black text-espresso-900">Manage Rescue</h2>
                    <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 <div className={`p-6 flex-1 overflow-y-auto max-h-[80vh] ${noScrollbar}`}>
                    <form onSubmit={handleEditSubmit} className="space-y-5">
                       
                       <div className="flex flex-col items-center mb-6">
                         <div className="relative w-24 h-24 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                           {editImagePreview ? <img src={editImagePreview} className="w-full h-full object-cover" alt="Preview"/> : <div className="w-full h-full flex items-center justify-center text-camel-300 font-medium text-xs">Upload</div>}
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files[0];
                             if(file) {
                               setEditImageFile(file);
                               setEditImagePreview(URL.createObjectURL(file));
                             }
                           }} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                         <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Change Photo</p>
                       </div>

                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Pipeline Status</label>
                         <select value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})} className="w-full bg-camel-50 border border-camel-200 rounded-xl px-4 py-3 text-sm font-bold text-espresso-900 focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none shadow-sm">
                           <option value="INTAKE">New Intake</option>
                           <option value="VET_HOLD">Medical Hold</option>
                           <option value="ADOPTABLE">Ready for Adoption</option>
                           <option value="ADOPTED">Adopted</option>
                         </select>
                       </div>

                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Animal Name</label>
                         <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Species</label>
                           <select value={editForm.species} onChange={(e) => setEditForm({...editForm, species: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none">
                             <option value="Dog">Dog</option>
                             <option value="Cat">Cat</option>
                             <option value="Other">Other</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Breed</label>
                           <input type="text" value={editForm.breed} onChange={(e) => setEditForm({...editForm, breed: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" />
                         </div>
                       </div>
                       
                       <div className="pt-6 space-y-3">
                         <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md">Save Changes</button>
                         <button type="button" onClick={handleDelete} className="w-full bg-white border-2 border-rose-100 hover:border-rose-500 hover:bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2">
                           <Trash2 size={16}/> Remove Rescue
                         </button>
                       </div>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
