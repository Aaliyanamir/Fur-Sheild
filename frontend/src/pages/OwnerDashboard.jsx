import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, Loader2, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchDashboardData } from '../services/api';
import AddRecordModal from '../components/organisms/AddRecordModal';
import CustomSelect from '../components/molecules/CustomSelect';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('This Week');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchDashboardData('buddy-123');
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  // Action Handlers
  const handleAddRecord = () => setIsModalOpen(true);
  const handleManageAppointment = () => alert("Navigating to Appointment Scheduler...");
  const handleViewProfile = () => alert("Loading full pet profile...");

  // Circular Progress Helper
  const CircularProgress = ({ percentage, colorClass, icon: Icon, label, trend }) => {
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
        <span className="text-espresso-900 font-bold text-sm">{label}</span>
        <span className="text-emerald-500 text-[10px] font-bold mt-1 tracking-wide">{trend}</span>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 shadow-[0_10px_30px_rgba(90,56,37,0.1)] rounded-2xl border-none">
          <p className="font-bold text-espresso-900 mb-2">{label}</p>
          <p className="text-sm font-medium text-camel-600">Weight: {payload[0].value} kg</p>
          <p className="text-sm font-medium text-espresso-500">Calories: {payload[1].value} kcal</p>
        </div>
      );
    }
    return null;
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-camel-600" size={48} />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">My Companion</p>
          <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">{data.pet.name}</h1>
        </div>
        <button onClick={handleAddRecord} className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md">
          <Plus size={18} /> Add Record
        </button>
      </div>

      {/* Master Bento Grid */}
      <motion.div initial="hidden" animate="show" variants={container} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Portrait Card (Col 4) */}
        <motion.div variants={itemVariant} className="lg:col-span-4 lg:sticky lg:top-32 relative h-[600px] rounded-[2rem] overflow-hidden group shadow-[0_15px_40px_rgba(90,56,37,0.08)]">
          <img src={data.pet.image} alt={data.pet.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/60 to-transparent h-full"></div>
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full w-fit mb-auto mt-2">
              <span className="text-white text-xs font-bold tracking-wide">{data.pet.breed}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-white/10">
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Age</p>
                <p className="text-white font-bold text-sm">{data.pet.age}</p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Weight</p>
                <p className="text-white font-bold text-sm">{data.pet.weight}</p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Blood</p>
                <p className="text-white font-bold text-sm">{data.pet.blood}</p>
              </div>
            </div>

            <button onClick={handleViewProfile} className="w-full bg-white text-espresso-900 py-4 rounded-full font-bold text-sm hover:bg-camel-50 transition-colors flex items-center justify-center gap-2">
              View Full Profile <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

                {/* RIGHT COLUMN: Data Widgets (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Spatial Generative AI Insight (No Generic Icons) */}
          <motion.div 
            variants={itemVariant} 
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-2xl border border-white shadow-[0_20px_40px_rgba(90,56,37,0.05)] p-8 md:p-10"
          >
            {/* Subtle animated background gradient */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-camel-200/30 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              {/* Custom CSS AI Orb (Replacing cheap icons) */}
              <div className="flex-shrink-0 relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-camel-400 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-2 bg-gradient-to-tr from-camel-600 to-camel-300 rounded-full shadow-[0_0_15px_rgba(186,127,72,0.5)]"></div>
                <div className="absolute inset-3 bg-white rounded-full opacity-30 blur-[1px]"></div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black tracking-[0.25em] text-camel-600 uppercase">
                    Generative Health Synthesis
                  </span>
                  <div className="h-[1px] w-12 bg-camel-200"></div>
                </div>
                <p className="text-xl md:text-2xl font-display font-medium text-espresso-900 leading-relaxed tracking-tight">
                  Buddy's weight has stabilized at <span className="font-bold border-b-2 border-camel-300">28.6 kg</span>, aligning perfectly with his reduced 850 kcal intake. This steady trajectory significantly reduces joint stress. <span className="text-camel-700 italic">Maintain current diet plan.</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Precision Trend Chart (Borderless & Seamless) */}
          <motion.div 
            variants={itemVariant} 
            className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white shadow-[0_10px_30px_rgba(90,56,37,0.03)]"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-display font-bold text-espresso-900 tracking-tight">Nutrition & Weight Trajectory</h3>
              <p className="text-sm font-medium text-espresso-500 mt-1">6-month macro correlation analysis.</p>
            </div>
            
            {/* Chart Container */}
            <div className="w-full h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#BA7F48" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#BA7F48" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3E2A20" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3E2A20" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={false} 
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={false} 
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#BA7F48', strokeWidth: 1, strokeDasharray: '5 5' }} />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#BA7F48" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#3E2A20" 
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#colorCals)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Health Overview Rings */}
          <motion.div variants={itemVariant} className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-display font-bold text-espresso-900">Health Overview</h3>
                <p className="text-espresso-500 text-sm font-medium">Live health insights & key stats.</p>
              </div>
              <div className="w-36">
                <CustomSelect 
                  options={['This Week', 'This Month', 'This Year']}
                  value={timeframe}
                  onChange={setTimeframe}
                  className="!py-2 !text-xs" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
              <CircularProgress percentage={data.health.activity} colorClass="text-emerald-500" icon={Footprints} label="Activity" trend="+12% this week" />
              <CircularProgress percentage={data.health.sleep} colorClass="text-indigo-500" icon={Moon} label="Sleep" trend="+5% this week" />
              <CircularProgress percentage={data.health.calories} colorClass="text-accent-500" icon={Flame} label="Calories" trend="On Track" />
              <CircularProgress percentage={data.health.hydration} colorClass="text-blue-500" icon={Droplets} label="Hydration" trend="+8% this week" />
            </div>
          </motion.div>

          {/* Bottom Split: Timeline & Appointment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </motion.div>

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
                
                <button onClick={handleManageAppointment} className="w-full mt-6 bg-camel-600 text-white py-3 rounded-full font-bold text-sm hover:bg-camel-500 transition-colors">
                  Manage Appointment
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </AnimatePresence>
    </>
  );
}

