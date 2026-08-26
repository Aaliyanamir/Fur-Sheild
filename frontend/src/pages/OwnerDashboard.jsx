import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, ArrowUpRight, Activity, Syringe, Clock, FileText } from 'lucide-react';

export default function OwnerDashboard() {
  const [activePet, setActivePet] = useState('Maximus');

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <>
      {/* Dashboard Header & Multi-Pet Tab Structure */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-espresso-900 tracking-tight mb-2">
            Welcome back, <span className="text-camel-600">Sarah</span>
          </h1>
          <p className="text-espresso-500 font-medium text-sm md:text-base">
            Overview of your pets' health, upcoming appointments, and daily tasks.
          </p>
        </div>
        
        {/* Multi-Pet Tabs */}
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-full shadow-sm border border-camel-100/50">
          <button 
            onClick={() => setActivePet('Maximus')}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activePet === 'Maximus' ? 'bg-camel-600 text-white shadow-md' : 'text-espresso-500 hover:bg-camel-50'}`}
          >
            Maximus
          </button>
          <button 
            onClick={() => setActivePet('Luna')}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activePet === 'Luna' ? 'bg-camel-600 text-white shadow-md' : 'text-espresso-500 hover:bg-camel-50'}`}
          >
            Luna
          </button>
          <button className="w-9 h-9 rounded-full bg-camel-50 flex items-center justify-center text-camel-600 hover:bg-camel-100 transition-colors">
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Premium Bento-Box Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]"
      >
        
        {/* Main Cinematic Pet Card (Spans 8 cols, 2 rows) */}
        <motion.div variants={itemVariant} className="md:col-span-8 md:row-span-2 relative rounded-[2rem] overflow-hidden group shadow-[0_15px_40px_rgba(90,56,37,0.08)]">
          <img 
            src={activePet === 'Maximus' ? "/images/dash-dog-1.jpg" : "/images/dash-cat-1.jpg"} 
            alt={activePet} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* Elegant Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-espresso-900/60 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-10">
            <div className="flex justify-between items-start">
              <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full">
                <span className="text-white text-xs font-bold tracking-widest uppercase">ID: 884-291</span>
              </div>
              <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-camel-500 transition-colors border border-white/20">
                <ArrowUpRight size={22} />
              </button>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{activePet}</h2>
              <p className="text-camel-100 font-medium text-lg">
                {activePet === 'Maximus' ? 'Golden Retriever • 3 yrs • Male' : 'Maine Coon • 2 yrs • Female'}
              </p>
              
              {/* Vitals Mini-Grid inside the main card */}
              <div className="flex gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Weight</p>
                  <p className="text-white font-bold text-xl">{activePet === 'Maximus' ? '32' : '6.5'} <span className="text-sm font-medium text-camel-300">kg</span></p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Diet Plan</p>
                  <p className="text-white font-bold text-xl">{activePet === 'Maximus' ? 'Raw Protein' : 'Keto Blend'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Appointment (Spans 4 cols, 1 row) */}
        <motion.div variants={itemVariant} className="md:col-span-4 bg-white rounded-[2rem] p-8 flex flex-col justify-between border border-camel-100/50 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-camel-50 flex items-center justify-center border border-camel-100">
                <Calendar className="text-camel-600" size={22} />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">Tomorrow</span>
            </div>
            <div>
              <p className="text-espresso-400 text-xs font-bold uppercase tracking-wider mb-2">Upcoming Clinic Visit</p>
              <h3 className="font-display font-bold text-espresso-900 text-xl leading-tight mb-1">Annual Checkup & Vax</h3>
              <p className="text-camel-600 text-sm font-medium flex items-center gap-2">
                <Clock size={14} /> 10:30 AM • Dr. Mark Thorne
              </p>
            </div>
        </motion.div>

        {/* Activity/Vitals Sparkline (Spans 4 cols, 1 row) */}
        <motion.div variants={itemVariant} className="md:col-span-4 bg-espresso-900 rounded-[2rem] p-8 flex flex-col justify-between border border-espresso-800 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-camel-400" />
                <h3 className="font-bold text-white text-sm uppercase tracking-wide">Weekly Activity</h3>
              </div>
              <span className="text-white/50 text-xs font-medium">Last 7 Days</span>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-display font-black text-white">4.2</span>
                <span className="text-camel-400 font-bold mb-1">hrs/day</span>
              </div>
              <p className="text-emerald-400 text-xs font-bold flex items-center gap-1">+12% from last week</p>
            </div>

            {/* Custom SVG Sparkline Graph */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-50">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full text-camel-500">
                <path d="M0,40 L0,30 L20,35 L40,15 L60,25 L80,5 L100,20 L100,40 Z" fill="currentColor" />
              </svg>
            </div>
        </motion.div>

        {/* Quick Actions / Documents (Spans 4 cols, 1 row) */}
        <motion.div variants={itemVariant} className="md:col-span-4 bg-white rounded-[2rem] p-8 border border-camel-100/50 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-espresso-900 text-sm uppercase tracking-wide mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 h-full">
            <button className="flex flex-col items-center justify-center gap-3 bg-bg-secondary rounded-2xl p-4 hover:bg-camel-50 hover:text-camel-700 transition-colors text-espresso-500 group">
              <Syringe size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Refill Meds</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 bg-bg-secondary rounded-2xl p-4 hover:bg-camel-50 hover:text-camel-700 transition-colors text-espresso-500 group">
              <FileText size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Lab Results</span>
            </button>
          </div>
        </motion.div>

      </motion.div>
    </>
  );
}
