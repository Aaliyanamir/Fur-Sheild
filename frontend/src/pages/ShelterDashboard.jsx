import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { Activity, Download, Heart, Users, AlertCircle, Sparkles, TrendingUp, ChevronRight, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import shelterService from '../services/shelter.service';

export default function ShelterDashboard() {
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await shelterService.getPipeline();
        if (res.success) {
          setPipelineData(res.data);
        }
      } catch (error) {
        console.error("Error fetching pipeline:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived Metrics
  const totalAnimals = pipelineData.length;
  const vetHolds = pipelineData.filter(a => a.status === 'VET_HOLD');
  const adoptable = pipelineData.filter(a => a.status === 'ADOPTABLE');
  const adopted = pipelineData.filter(a => a.status === 'ADOPTED');
  
  const adoptionRate = totalAnimals > 0 ? Math.round((adopted.length / totalAnimals) * 100) : 0;

  // Mock Chart Data for historical view
  const flowData = [
    { month: 'Mar', intakes: 42, adoptions: 28 },
    { month: 'Apr', intakes: 55, adoptions: 40 },
    { month: 'May', intakes: 38, adoptions: 45 },
    { month: 'Jun', intakes: 65, adoptions: 35 },
    { month: 'Jul', intakes: 58, adoptions: 50 },
    { month: 'Aug', intakes: 45, adoptions: 60 }
  ];

  const speciesData = [
    { name: 'Dogs', value: pipelineData.filter(a => a.species === 'Dog').length || 45, color: '#BA7F48' }, // camel-600
    { name: 'Cats', value: pipelineData.filter(a => a.species === 'Cat').length || 35, color: '#31231E' }, // espresso-900
    { name: 'Other', value: pipelineData.filter(a => a.species !== 'Dog' && a.species !== 'Cat').length || 5, color: '#E5D6C5' } // camel-200
  ];

  // Helper for relative time
  const getRelativeTime = (dateString) => {
    const diffDays = Math.round((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffDays, 'day');
  };

  // Avatar Fallback inline
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-camel-600"></div>
      </div>
    );
  }

  const noScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    <div className={`flex-1 flex flex-col w-full font-sans ${noScrollbar} pb-8`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-xs tracking-[0.25em] uppercase mb-1">Shelter Administration</p>
          <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">
            Command Center
          </h1>
        </div>
        <button className="flex items-center gap-2 bg-white hover:bg-camel-50 text-espresso-900 border border-camel-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
        
        {/* KPI: Total Capacity (Span 3) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-3 bg-espresso-900 text-white rounded-[2rem] p-6 relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:bg-white/10 transition-colors"></div>
          <Activity size={24} className="text-camel-400 mb-4" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Current Occupancy</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black tracking-tight">{totalAnimals}</p>
            <span className="text-sm font-medium text-camel-300">Rescues</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
            <TrendingUp size={12} /> +12% this month
          </div>
        </motion.div>

        {/* KPI: Adoptions (Span 3) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-3 bg-white border border-camel-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <Heart size={24} className="text-rose-500 mb-4" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-espresso-400 mb-1">Adoption Rate</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-espresso-900 tracking-tight">{adoptionRate}%</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-espresso-600">
            <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> Goal Exceeded</span>
          </div>
        </motion.div>

        {/* Flow Chart (Span 6) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-6 bg-white border border-camel-100 rounded-[2rem] p-6 shadow-sm flex flex-col min-h-[220px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-black text-espresso-900 tracking-tight">Intake vs Adoption Flow</h3>
              <p className="text-xs font-bold text-espresso-400 uppercase tracking-widest mt-1">6 Month Historical Data</p>
            </div>
          </div>
          <div className="flex-1 w-full h-full -ml-4 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BA7F48" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#BA7F48" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D6C5" opacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C7A6B', fontWeight: 700 }} dy={10} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="intakes" name="Intakes" stroke="#BA7F48" strokeWidth={3} fillOpacity={1} fill="url(#colorIntake)" />
                <Area type="monotone" dataKey="adoptions" name="Adoptions" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdoption)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Immediate Attention (Span 7) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="md:col-span-7 bg-white border border-camel-100 rounded-[2rem] p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-espresso-900 tracking-tight">Needs Immediate Attention</h3>
                <p className="text-xs font-bold text-espresso-400 uppercase tracking-widest mt-0.5">Active Medical Holds</p>
              </div>
            </div>
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">{vetHolds.length} Critical</span>
          </div>

          <div className="flex-1 space-y-3">
            {vetHolds.length === 0 ? (
               <div className="h-full w-full flex flex-col items-center justify-center text-espresso-400 py-8">
                 <Sparkles size={32} className="text-camel-300 mb-3" />
                 <p className="text-sm font-bold">All clear! No urgent medical holds.</p>
               </div>
            ) : vetHolds.slice(0, 4).map(pet => (
              <div key={pet._id} className="flex items-center justify-between p-3 rounded-2xl border border-camel-50 hover:border-camel-200 hover:bg-[#FAF8F5] transition-all group">
                <div className="flex items-center gap-4">
                  <Avatar 
                    src={pet.avatarUrl ? (pet.avatarUrl.startsWith('http') ? pet.avatarUrl : `http://localhost:5000${pet.avatarUrl}`) : null} 
                    alt={pet.name} name={pet.name} 
                    className="w-12 h-12 rounded-xl object-cover border border-camel-100 shadow-sm shrink-0" 
                  />
                  <div>
                    <h4 className="text-sm font-black text-espresso-900">{pet.name}</h4>
                    <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest">{pet.breed || pet.species}</p>
                  </div>
                </div>
                <div className="text-right">
                   {pet.aiTriageLog && pet.aiTriageLog[0] && (
                     <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                       <Stethoscope size={12} /> {pet.aiTriageLog[0].severity}
                     </div>
                   )}
                   <p className="text-[10px] font-bold text-espresso-400">Intake {getRelativeTime(pet.intakeDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Species Distribution (Span 5) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-5 bg-[#FAF8F5] border border-camel-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center relative">
          <h3 className="text-lg font-black text-espresso-900 tracking-tight self-start w-full">Species Distribution</h3>
          <p className="text-xs font-bold text-espresso-400 uppercase tracking-widest mt-0.5 self-start w-full mb-4">Current Shelter Demographics</p>
          
          <div className="w-full h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={speciesData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-3xl font-black text-espresso-900">{totalAnimals}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-espresso-400">Total</p>
            </div>
          </div>
          
          <div className="flex gap-6 mt-2">
            {speciesData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <p className="text-xs font-bold text-espresso-800">{entry.name} <span className="text-espresso-400">({entry.value})</span></p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Center / Quick Links (Span 12) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <a href="/pipeline" className="bg-camel-600 hover:bg-camel-700 text-white rounded-[1.5rem] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between min-h-[140px]">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white mb-4">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h4 className="font-bold text-lg">Rescue Pipeline</h4>
              <p className="text-camel-100 text-xs font-medium mt-1 flex items-center gap-1 group-hover:text-white transition-colors">Manage workflow <ChevronRight size={12}/></p>
            </div>
          </a>
          
          <div className="bg-white border border-camel-100 hover:border-camel-300 rounded-[1.5rem] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">
            <div className="w-10 h-10 bg-camel-50 rounded-full flex items-center justify-center text-camel-600 mb-4">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="font-black text-espresso-900 text-lg">Intake Forms</h4>
              <p className="text-espresso-400 text-xs font-bold mt-1 uppercase tracking-widest">Digital Records</p>
            </div>
          </div>

          <div className="bg-white border border-camel-100 hover:border-camel-300 rounded-[1.5rem] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-black text-espresso-900 text-lg">Adoption Portal</h4>
              <p className="text-espresso-400 text-xs font-bold mt-1 uppercase tracking-widest">{adoptable.length} Ready</p>
            </div>
          </div>

          <div className="bg-white border border-camel-100 hover:border-camel-300 rounded-[1.5rem] p-5 shadow-sm transition-all hover:-translate-y-1 group flex flex-col justify-between cursor-pointer">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <Stethoscope size={20} />
            </div>
            <div>
              <h4 className="font-black text-espresso-900 text-lg">Vet Schedule</h4>
              <p className="text-espresso-400 text-xs font-bold mt-1 uppercase tracking-widest">Co-ordinate Care</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
