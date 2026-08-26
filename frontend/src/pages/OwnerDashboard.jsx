import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, PawPrint, HeartHandshake, Syringe, Stethoscope, AlertCircle, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dashboardService from '../services/dashboard.service';

export default function OwnerDashboard() {
  const [pets, setPets] = useState([]);
  const [activePetIndex, setActivePetIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add Pet Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', species: 'Dog', breed: '', weight: '' });
  const [modalError, setModalError] = useState('');

  // Timeframe for charts (mock logic for now, but UI ready)
  const [timeframe, setTimeframe] = useState('This Week');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getOwnerDashboardData();
      if (response.success) {
        setPets(response.data);
      } else {
        setError(response.message || "Failed to load pets.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddPetSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);
    try {
      // 1. Create Pet
      const petResponse = await dashboardService.addNewPet({
        name: newPet.name,
        species: newPet.species,
        breed: newPet.breed
      });

      if (petResponse.success) {
        const createdPet = petResponse.data;
        // 2. If weight was provided, add it to vitals
        if (newPet.weight) {
           await dashboardService.updatePetVitals(createdPet._id, { weight: parseFloat(newPet.weight) });
        }
        
        // Refresh dashboard data to get complete updated records
        await fetchDashboardData();
        
        // Close and reset
        setIsModalOpen(false);
        setNewPet({ name: '', species: 'Dog', breed: '', weight: '' });
        // Set active to the newly created pet (which will be at index 0 because of reverse sorting in backend)
        setActivePetIndex(0);
      } else {
        setModalError(petResponse.message || "Failed to add pet");
      }
    } catch (err) {
      setModalError("Error adding pet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Circular Progress Helper
  const CircularProgress = ({ percentage, colorClass, icon: Icon, label }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-24 h-24 mb-3">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-camel-100" />
            <circle 
              cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" 
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${colorClass}`} 
            />
          </svg>
          <div className="flex flex-col items-center justify-center relative z-10">
            <Icon size={16} className={`mb-0.5 ${colorClass}`} />
            <span className="text-lg font-black text-espresso-900 leading-none">{percentage}%</span>
          </div>
        </div>
        <span className="text-xs font-bold text-espresso-600 uppercase tracking-widest">{label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
         <div className="w-12 h-12 border-4 border-camel-200 border-t-camel-600 rounded-full animate-spin mb-4"></div>
         <p className="text-espresso-500 font-bold tracking-widest uppercase text-sm">Loading Ecosystem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
         <div className="bg-red-50 text-red-600 px-6 py-4 rounded-3xl flex items-center gap-3">
            <AlertCircle size={24} />
            <span className="font-bold">{error}</span>
         </div>
         <button onClick={fetchDashboardData} className="mt-4 text-camel-600 font-bold hover:underline">Try Again</button>
      </div>
    );
  }

  const activePet = pets[activePetIndex];

  return (
    <div className="w-full relative">
      {/* Header & Multi-Pet Tabs */}
      <div className="flex flex-col mb-8 gap-4 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">Owner Dashboard</p>
             <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">
               {pets.length > 0 ? `${activePet?.name}'s Health` : 'Welcome to FurShield'}
             </h1>
           </div>
           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:-translate-y-0.5 w-max">
             <Plus size={18} /> Add Pet
           </button>
        </div>

        {pets.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 border-b border-camel-100">
            {pets.map((pet, idx) => (
              <button 
                key={pet._id}
                onClick={() => setActivePetIndex(idx)}
                className={`relative px-4 py-2 flex items-center gap-2 rounded-full transition-colors ${activePetIndex === idx ? 'text-espresso-900 font-bold bg-camel-100/50' : 'text-espresso-500 font-medium hover:bg-camel-50'}`}
              >
                {activePetIndex === idx && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-camel-100 rounded-full -z-10" />
                )}
                <div className="w-6 h-6 rounded-full bg-camel-200 overflow-hidden">
                   <img src={pet.avatarUrl || '/images/product-placeholder.jpg'} alt={pet.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <span className="text-sm">{pet.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {pets.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 border border-camel-100 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="w-24 h-24 rounded-full bg-camel-50 flex items-center justify-center text-camel-400 mb-6">
              <PawPrint size={40} />
           </div>
           <h2 className="text-2xl font-display font-black text-espresso-900 mb-2">No Pets Found</h2>
           <p className="text-espresso-500 font-medium max-w-md mb-8">Your dashboard is empty. Add your first pet to start tracking their health, managing appointments, and accessing the clinical ecosystem.</p>
           <button onClick={() => setIsModalOpen(true)} className="bg-camel-600 hover:bg-camel-500 text-white px-8 py-3.5 rounded-full font-bold shadow-md shadow-camel-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
             <Plus size={18} /> Register First Pet
           </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={activePet._id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative"
          >
            {/* LEFT COLUMN: Pet Identity & Profile Bento */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col">
                <div className="w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 relative group bg-camel-50 flex items-center justify-center">
                  <img src={activePet.avatarUrl || '/images/product-placeholder.jpg'} alt={activePet.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" />
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-display font-black text-espresso-900 tracking-tight">{activePet.name}</h2>
                    <p className="text-camel-600 font-bold mt-1">{activePet.breed} • {activePet.species}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-camel-50 flex items-center justify-center text-camel-600">
                    <PawPrint size={24} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-camel-100/50">
                  <div className="bg-bg-secondary rounded-2xl p-4">
                    <p className="text-espresso-400 text-[10px] font-bold uppercase tracking-widest mb-1">Latest Weight</p>
                    <p className="text-espresso-900 font-black text-lg">
                       {activePet.weightHistory && activePet.weightHistory.length > 0 
                          ? `${activePet.weightHistory[activePet.weightHistory.length-1].weight} kg` 
                          : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-bg-secondary rounded-2xl p-4">
                    <p className="text-espresso-400 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="text-emerald-600 font-black text-lg">Healthy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Health Data & Analytics */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
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
                       Not enough data to plot trajectory.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Add Pet Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                 
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-bg-secondary">
                    <h2 className="text-xl font-display font-black text-espresso-900">Add New Pet</h2>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>

                 <div className="p-8 flex-1 overflow-y-auto">
                    {modalError && (
                      <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
                        <AlertCircle size={16} /> {modalError}
                      </div>
                    )}
                    
                    <form onSubmit={handleAddPetSubmit} className="space-y-5">
                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Pet Name</label>
                         <input type="text" value={newPet.name} onChange={(e) => setNewPet({...newPet, name: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="E.g. Buddy" required />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Species</label>
                           <select value={newPet.species} onChange={(e) => setNewPet({...newPet, species: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all appearance-none">
                             <option value="Dog">Dog</option>
                             <option value="Cat">Cat</option>
                             <option value="Bird">Bird</option>
                             <option value="Other">Other</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Breed</label>
                           <input type="text" value={newPet.breed} onChange={(e) => setNewPet({...newPet, breed: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="Golden Retriever" required />
                         </div>
                       </div>

                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Current Weight (kg)</label>
                         <input type="number" step="0.1" value={newPet.weight} onChange={(e) => setNewPet({...newPet, weight: e.target.value})} className="w-full bg-white border border-camel-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-camel-500 focus:ring-4 focus:ring-camel-50 transition-all" placeholder="E.g. 28.5" />
                       </div>
                       
                       <button type="submit" disabled={isSubmitting} className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-4">
                         {isSubmitting ? 'Registering...' : 'Complete Registration'} <ArrowRight size={16} />
                       </button>
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
