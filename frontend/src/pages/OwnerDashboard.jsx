import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Activity, Moon, Droplets, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function OwnerDashboard() {
  const [activePet] = useState('Buddy');

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  // Helper for Circular Progress
  const CircularProgress = ({ percentage, colorClass, icon: Icon, label, trend }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-24 h-24 mb-3">
          {/* Background Track */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-camel-100" />
            {/* Progress Track */}
            <circle 
              cx="48" cy="48" r={radius} 
              stroke="currentColor" strokeWidth="6" fill="transparent" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${colorClass}`} 
            />
          </svg>
          <div className="flex flex-col items-center justify-center relative z-10">
            <Icon size={16} className={`mb-0.5 ${colorClass}`} />
            <span className="text-lg font-black text-espresso-900 leading-none">{percentage}%</span>
          </div>
        </div>
        <span className="text-espresso-900 font-bold text-sm">{label}</span>
        <span className="text-emerald-500 text-[10px] font-bold mt-1 tracking-wide">{trend}</span>
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">My Companion</p>
          <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">
            Buddy
          </h1>
        </div>
        <button className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md">
          <Plus size={18} /> Add Record
        </button>
      </div>

      {/* Master Bento Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        
        {/* LEFT COLUMN: Portrait Card (Col 4) */}
        <motion.div variants={itemVariant} className="lg:col-span-4 relative h-[600px] rounded-[2rem] overflow-hidden group shadow-[0_15px_40px_rgba(90,56,37,0.08)]">
          <img 
            src="/images/dash-dog-1.jpg" 
            alt="Buddy" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* Deep Espresso Gradient at Bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/60 to-transparent h-full"></div>
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full w-fit mb-auto mt-2">
              <span className="text-white text-xs font-bold tracking-wide">Golden Retriever</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-white/10">
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Age</p>
                <p className="text-white font-bold text-sm">3 Yrs 2 Mos</p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Weight</p>
                <p className="text-white font-bold text-sm">28.6 kg</p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Blood</p>
                <p className="text-white font-bold text-sm">DEA 1.1</p>
              </div>
            </div>

            <button className="w-full bg-white text-espresso-900 py-4 rounded-full font-bold text-sm hover:bg-camel-50 transition-colors flex items-center justify-center gap-2">
              View Full Profile <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Data Widgets (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Health Overview Rings */}
          <motion.div variants={itemVariant} className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)] flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-display font-bold text-espresso-900">Health Overview</h3>
                <p className="text-espresso-500 text-sm font-medium">Live health insights & key stats.</p>
              </div>
              <select className="bg-bg-secondary text-xs font-bold text-espresso-600 px-4 py-2 rounded-lg outline-none cursor-pointer">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
              <CircularProgress percentage={78} colorClass="text-emerald-500" icon={Activity} label="Activity" trend="+12% this week" />
              <CircularProgress percentage={82} colorClass="text-indigo-500" icon={Moon} label="Sleep" trend="+5% this week" />
              {/* Simulated Calories Ring */}
              <CircularProgress percentage={90} colorClass="text-accent-500" icon={Activity} label="Calories" trend="On Track" />
              <CircularProgress percentage={62} colorClass="text-blue-500" icon={Droplets} label="Hydration" trend="+8% this week" />
            </div>
          </motion.div>

          {/* Bottom Split: Timeline & Appointment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            
            {/* Health Timeline */}
            <motion.div variants={itemVariant} className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-display font-bold text-espresso-900">Health Timeline</h3>
                <button className="text-xs font-bold text-camel-600 hover:text-camel-800">View All</button>
              </div>
              
              <div className="relative pl-4 border-l-2 border-camel-100 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[25px] bg-white p-1 rounded-full"><CheckCircle2 className="text-emerald-500" size={18} /></div>
                  <p className="font-bold text-espresso-900 text-sm">Vaccination - DHPP</p>
                  <p className="text-xs font-medium text-espresso-500 mt-1">Oct 20, 2024 • Dr. Emily Carter</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] bg-white p-1 rounded-full"><Circle className="text-camel-500 fill-camel-100" size={18} /></div>
                  <p className="font-bold text-espresso-900 text-sm">Annual Checkup</p>
                  <p className="text-xs font-medium text-camel-600 mt-1">Nov 10, 2024 • 10:30 AM</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] bg-white p-1 rounded-full"><Circle className="text-espresso-200" size={18} /></div>
                  <p className="font-bold text-espresso-900 text-sm opacity-50">Deworming</p>
                  <p className="text-xs font-medium text-espresso-500 mt-1 opacity-50">Dec 05, 2024 • Reminder</p>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Appointment */}
            <motion.div variants={itemVariant} className="flex flex-col gap-6">
              <div className="bg-camel-50 rounded-[2rem] p-8 border border-camel-100/50 flex flex-col justify-between h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-display font-bold text-espresso-900">Next Appointment</h3>
                </div>
                
                <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm">
                  <div className="bg-camel-100 text-camel-800 rounded-xl px-4 py-2 text-center">
                    <span className="block text-[10px] font-bold uppercase">Nov</span>
                    <span className="block text-2xl font-black">10</span>
                  </div>
                  <div>
                    <p className="font-bold text-espresso-900 text-sm mb-1">General Checkup</p>
                    <p className="text-xs font-medium text-espresso-600 flex items-center gap-1"><Calendar size={12}/> Dr. Mark Thorne</p>
                  </div>
                </div>
                
                {/* Replaced ugly quick actions with a single elegant contextual action */}
                <button className="w-full mt-6 bg-camel-600 text-white py-3 rounded-full font-bold text-sm hover:bg-camel-500 transition-colors">
                  Manage Appointment
                </button>
              </div>
            </motion.div>

          </div>

        </div>
      </motion.div>
    </>
  );
}
