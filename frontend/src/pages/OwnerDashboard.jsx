import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Syringe, Clock, FileText, ChevronRight, Activity, Bone, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function OwnerDashboard() {
  const [activePet, setActivePet] = useState('Maximus');

  const pets = {
    Maximus: {
      name: 'Maximus',
      image: '/images/dash-dog-1.jpg',
      breed: 'Golden Retriever',
      age: '3 yrs',
      weight: '32 kg',
      activity: 'High',
      diet: 'Raw Protein'
    },
    Luna: {
      name: 'Luna',
      image: '/images/dash-cat-1.jpg',
      breed: 'Maine Coon',
      age: '2 yrs',
      weight: '6.5 kg',
      activity: 'Moderate',
      diet: 'Keto Blend'
    }
  };

  const pet = pets[activePet];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
       {/* Left Column - Immersive Sticky Profile */}
       <div className="lg:col-span-5 lg:sticky lg:top-32 h-[60vh] min-h-[500px] lg:h-[80vh] lg:min-h-[700px] rounded-[2.5rem] overflow-hidden relative shadow-[0_20px_60px_rgba(90,56,37,0.15)] group bg-espresso-900">
         <AnimatePresence mode="wait">
            <motion.img 
              key={pet.name}
              src={pet.image}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
         </AnimatePresence>
         
         {/* Gradients for text legibility */}
         <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/20 to-transparent"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-espresso-900/50 to-transparent h-48"></div>
         
         {/* Top: Pet Selector Pill */}
         <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
            <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg">
               {Object.keys(pets).map(p => (
                 <button 
                   key={p}
                   onClick={() => setActivePet(p)}
                   className={cn(
                     "px-6 py-2 rounded-full text-sm font-bold transition-all",
                     activePet === p ? "bg-white text-espresso-900 shadow-sm" : "text-white hover:bg-white/10"
                   )}
                 >
                   {p}
                 </button>
               ))}
            </div>
            <button className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg">
               <Plus size={20} />
            </button>
         </div>

         {/* Bottom: Pet Info & Vitals */}
         <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div 
                 key={`info-${pet.name}`}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-5xl font-display font-black text-white mb-1 tracking-tight">{pet.name}</h2>
                <p className="text-camel-300 font-medium text-lg mb-8">{pet.breed} • {pet.age}</p>
                
                <div className="flex gap-4">
                   <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-lg">
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Weight</p>
                      <p className="text-white font-black text-2xl">{pet.weight}</p>
                   </div>
                   <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-lg">
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Diet</p>
                      <p className="text-white font-black text-2xl">{pet.diet}</p>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
         </div>
       </div>

       {/* Right Column - Data & Actions */}
       <div className="lg:col-span-7 flex flex-col gap-10 pb-12 pt-4">
          
          <div className="flex justify-between items-end mb-2">
            <div>
              <h1 className="text-3xl font-display font-bold text-espresso-900 tracking-tight">Health Overview</h1>
              <p className="text-espresso-500 font-medium mt-1">Real-time metrics and upcoming tasks.</p>
            </div>
          </div>

          {/* Core Metrics: The Dark Hub (Apple Health style) */}
          <div className="bg-espresso-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
             {/* Decorative soft glow */}
             <div className="absolute -top-32 -right-32 w-96 h-96 bg-camel-500/20 blur-[100px] rounded-full pointer-events-none"></div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                <div className="flex flex-col gap-2 border-l-4 border-camel-500/80 pl-5">
                   <div className="flex items-center gap-2 text-camel-300">
                     <Activity size={18} />
                     <span className="text-xs font-bold uppercase tracking-widest">Activity</span>
                   </div>
                   <p className="text-4xl font-display font-black text-white tracking-tight">4.2 <span className="text-xl text-white/40 font-bold">hrs</span></p>
                   <p className="text-emerald-400 text-xs font-bold bg-emerald-400/10 w-fit px-2 py-1 rounded-md mt-1">+12% vs last week</p>
                </div>

                <div className="flex flex-col gap-2 border-l-4 border-blue-500/80 pl-5">
                   <div className="flex items-center gap-2 text-blue-300">
                     <Moon size={18} />
                     <span className="text-xs font-bold uppercase tracking-widest">Sleep</span>
                   </div>
                   <p className="text-4xl font-display font-black text-white tracking-tight">14 <span className="text-xl text-white/40 font-bold">hrs</span></p>
                   <p className="text-white/60 text-xs font-bold bg-white/5 w-fit px-2 py-1 rounded-md mt-1">Optimal range</p>
                </div>

                <div className="flex flex-col gap-2 border-l-4 border-orange-500/80 pl-5">
                   <div className="flex items-center gap-2 text-orange-300">
                     <Bone size={18} />
                     <span className="text-xs font-bold uppercase tracking-widest">Calories</span>
                   </div>
                   <p className="text-4xl font-display font-black text-white tracking-tight">850 <span className="text-xl text-white/40 font-bold">kcal</span></p>
                   <p className="text-white/60 text-xs font-bold bg-white/5 w-fit px-2 py-1 rounded-md mt-1">Daily target met</p>
                </div>
             </div>
          </div>

          {/* Quick Actions Row */}
          <div>
            <h3 className="text-xs font-bold text-espresso-400 uppercase tracking-widest mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               <button className="bg-white hover:bg-camel-50 border border-espresso-900/5 hover:border-camel-300 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-start gap-5 group shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Syringe size={22} />
                  </div>
                  <span className="font-bold text-espresso-900 text-sm md:text-base tracking-wide">Order Meds</span>
               </button>
               <button className="bg-white hover:bg-camel-50 border border-espresso-900/5 hover:border-camel-300 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-start gap-5 group shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Calendar size={22} />
                  </div>
                  <span className="font-bold text-espresso-900 text-sm md:text-base tracking-wide">Book Vet</span>
               </button>
               <button className="bg-white hover:bg-camel-50 border border-espresso-900/5 hover:border-camel-300 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-start gap-5 group shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-lg md:col-span-1 col-span-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText size={22} />
                  </div>
                  <span className="font-bold text-espresso-900 text-sm md:text-base tracking-wide">Lab Reports</span>
               </button>
            </div>
          </div>

          {/* Upcoming Timeline */}
          <div>
            <h3 className="text-xs font-bold text-espresso-400 uppercase tracking-widest mb-6 mt-4">Upcoming Schedule</h3>
            <div className="relative pl-7 border-l-2 border-espresso-900/10 flex flex-col gap-10">
               
               {/* Event 1 - High Priority */}
               <div className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[37px] top-2 w-4 h-4 rounded-full bg-camel-500 border-4 border-bg-primary shadow-sm"></div>
                  
                  <div className="bg-white border border-camel-100 rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(186,127,72,0.05)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.1)] transition-shadow group">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <span className="text-[10px] font-bold tracking-widest uppercase bg-camel-100/50 text-camel-700 px-3 py-1.5 rounded-full w-fit">Tomorrow, 10:30 AM</span>
                        <button className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-espresso-400 group-hover:bg-camel-500 group-hover:text-white transition-colors shrink-0">
                          <ChevronRight size={18} />
                        </button>
                     </div>
                     <h4 className="font-display font-bold text-xl text-espresso-900 mb-1">Annual Checkup & Vax</h4>
                     <p className="text-espresso-500 text-sm font-medium flex items-center gap-2">
                        <Clock size={14} className="text-camel-400" /> Dr. Mark Thorne • Downtown Vet Clinic
                     </p>
                  </div>
               </div>

               {/* Event 2 - Standard */}
               <div className="relative group cursor-pointer">
                  <div className="absolute -left-[37px] top-2 w-4 h-4 rounded-full bg-espresso-300 border-4 border-bg-primary group-hover:bg-espresso-500 transition-colors"></div>
                  
                  <div className="bg-transparent border border-transparent p-4 hover:bg-white hover:border-espresso-900/5 rounded-[2rem] transition-all">
                     <div className="mb-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-espresso-400">Oct 24, 2026</span>
                     </div>
                     <h4 className="font-bold text-lg text-espresso-900 group-hover:text-camel-600 transition-colors">Heartworm Meds Delivery</h4>
                     <p className="text-espresso-500 text-sm font-medium mt-1">Auto-ships to your primary address.</p>
                  </div>
               </div>

            </div>
          </div>

       </div>
    </div>
  );
}

