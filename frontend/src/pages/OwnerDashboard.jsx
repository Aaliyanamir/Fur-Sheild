import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, Pill, Plus, ArrowUpRight, PawPrint } from 'lucide-react';

export default function OwnerDashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-espresso-900 tracking-tight">
            Welcome back, <span className="text-camel-600">Sarah</span>
          </h1>
          <p className="text-espresso-500 font-medium mt-1">Here is the latest on your pets' health and activities.</p>
        </div>
        <button className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md">
          <Plus size={18} /> Add New Pet
        </button>
      </div>

      {/* Core Bento-Box Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px]"
      >
        
        {/* Widget 1: Primary Pet Profile (Spans 2 cols, 2 rows) */}
        <motion.div variants={item} className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-6 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.04)] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-2xl bg-camel-100 overflow-hidden border-2 border-white shadow-sm">
                <img src="/images/pet-owner.jpg" alt="Pet" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-espresso-900">Maximus</h2>
                <p className="text-sm font-medium text-camel-600">Golden Retriever • 3 yrs</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-espresso-400 hover:text-camel-600 transition-colors">
              <ArrowUpRight size={20} />
            </button>
          </div>
          
          <div className="relative z-10 grid grid-cols-3 gap-4 mt-8">
            <div className="bg-bg-secondary rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Weight</span>
              <span className="text-lg font-black text-espresso-900">32 <span className="text-sm text-camel-600 font-bold">kg</span></span>
            </div>
            <div className="bg-bg-secondary rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Activity</span>
              <span className="text-lg font-black text-espresso-900">High</span>
            </div>
            <div className="bg-bg-secondary rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-espresso-400 mb-1">Diet</span>
              <span className="text-lg font-black text-espresso-900">Raw</span>
            </div>
          </div>
          
          {/* Decorative background element */}
          <PawPrint className="absolute -bottom-8 -right-8 text-camel-50/50 w-64 h-64 -rotate-12 z-0 pointer-events-none" />
        </motion.div>

        {/* Widget 2: Upcoming Appointment (Spans 1 col, 1 row) */}
        <motion.div variants={item} className="bg-camel-600 rounded-3xl p-6 shadow-md flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-camel-500 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Calendar size={20} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full">Tomorrow</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-lg leading-tight mb-1">Annual Checkup</h3>
              <p className="text-camel-100 text-sm font-medium">Dr. Mark Thorne • 10:30 AM</p>
            </div>
        </motion.div>

        {/* Widget 3: Quick Action - Pharmacy (Spans 1 col, 1 row) */}
        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.04)] flex flex-col justify-between hover:border-camel-300 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Pill size={20} className="text-emerald-600" />
              </div>
              <ArrowUpRight size={20} className="text-espresso-300 group-hover:text-camel-500 transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-espresso-900 text-lg mb-1">Refill Meds</h3>
              <p className="text-espresso-500 text-sm font-medium">Heartworm prevention due in 5 days.</p>
            </div>
        </motion.div>

        {/* Widget 4: Health Metrics Chart Placeholder (Spans 2 cols, 1 row) */}
        <motion.div variants={item} className="md:col-span-2 bg-white rounded-3xl p-6 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.04)] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-camel-500" />
                <h3 className="font-bold text-espresso-900">Activity & Vitals</h3>
              </div>
              <select className="bg-bg-secondary text-xs font-bold text-espresso-600 px-3 py-1.5 rounded-lg outline-none border-none cursor-pointer">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            {/* Simple Placeholder for a chart area */}
            <div className="flex-1 w-full bg-gradient-to-t from-camel-50 to-transparent rounded-xl border border-dashed border-camel-200 flex items-center justify-center">
              <span className="text-sm font-bold text-camel-400 uppercase tracking-widest">[ Chart UI Component Here ]</span>
            </div>
        </motion.div>

      </motion.div>
    </>
  );
}
