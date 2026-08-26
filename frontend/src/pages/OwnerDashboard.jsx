import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, PawPrint, HeartHandshake, Syringe, Stethoscope } from 'lucide-react';
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
        <span className="text-camel-500 text-[10px] font-bold mt-1 tracking-wide">{trend}</span>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 shadow-lg rounded-xl border border-camel-100">
          <p className="font-bold text-espresso-900 mb-2">{label}</p>
          <p className="text-sm font-medium text-camel-600">Weight: {payload[0].value} kg</p>
          <p className="text-sm font-medium text-espresso-500">Calories: {payload[1].value} kcal</p>
        </div>
      );
    }
    return null;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">My Companion</p>
          <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">{data.pet.name}'s Health</h1>
        </div>
        <button onClick={handleAddRecord} className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:-translate-y-0.5">
          <Plus size={18} /> Add Record
        </button>
      </div>

      {/* Master Grid - Clean & Warm */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Clean ID Card (Col 4) */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col">
            <div className="w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 relative group">
              <img src={data.pet.image} alt={data.pet.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-display font-black text-espresso-900 tracking-tight">{data.pet.name}</h2>
                <p className="text-camel-600 font-bold mt-1">{data.pet.breed}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-camel-50 flex items-center justify-center text-camel-600">
                <PawPrint size={24} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-camel-100/50">
              <div className="bg-bg-secondary rounded-2xl p-4">
                <p className="text-espresso-400 text-[10px] font-bold uppercase tracking-widest mb-1">Age</p>
                <p className="text-espresso-900 font-black text-lg">{data.pet.age}</p>
              </div>
              <div className="bg-bg-secondary rounded-2xl p-4">
                <p className="text-espresso-400 text-[10px] font-bold uppercase tracking-widest mb-1">Weight</p>
                <p className="text-espresso-900 font-black text-lg">{data.pet.weight}</p>
              </div>
            </div>

            <button onClick={handleViewProfile} className="w-full bg-bg-secondary text-espresso-900 py-4 rounded-full font-bold text-sm hover:bg-camel-100 transition-colors flex items-center justify-center gap-2 mt-auto">
              Full Health Profile <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Warm Data Widgets (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
                    {/* Clinical Insight (Doctor's Note Style) */}
          <div className="bg-[#FAF8F5] rounded-[2rem] p-8 md:p-10 border border-camel-100 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="w-16 h-16 shrink-0 bg-white rounded-full flex items-center justify-center border border-camel-200 shadow-sm z-10 relative">
              <Stethoscope size={28} className="text-camel-600" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-espresso-900 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                Clinical Insight
                <span className="w-1.5 h-1.5 rounded-full bg-camel-500"></span>
              </h3>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-espresso-800 italic">
                "Buddy's weight has stabilized perfectly at 28.6 kg. The reduced calorie intake is working, relieving joint stress. Keep up the great work!"
              </p>
              <p className="text-sm font-bold text-camel-600 mt-4">— Dr. Mark Thorne</p>
            </div>
            
            <div className="absolute -bottom-10 -right-10 text-camel-200 opacity-30 pointer-events-none">
              <Stethoscope size={160} strokeWidth={0.5} className="-rotate-12" />
            </div>
          </div>

          {/* Clean Area Chart */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-camel-100 shadow-sm flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-espresso-900 tracking-tight">Nutrition & Weight</h3>
                <p className="text-sm font-medium text-espresso-500 mt-1">6-month trend analysis.</p>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#BA7F48" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#BA7F48" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3E2A20" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#3E2A20" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12, fontWeight: 500 }} domain={['dataMin - 1', 'dataMax + 1']} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#BA7F48', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area yAxisId="left" type="monotone" dataKey="weight" stroke="#BA7F48" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                  <Area yAxisId="right" type="monotone" dataKey="calories" stroke="#3E2A20" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorCals)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Health Vitals Rings */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-camel-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-display font-bold text-espresso-900 tracking-tight">Daily Vitals</h3>
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
              <CircularProgress percentage={data.health.activity} colorClass="text-camel-600" icon={Footprints} label="Activity" trend="+12% this week" />
              <CircularProgress percentage={data.health.sleep} colorClass="text-indigo-500" icon={Moon} label="Sleep" trend="+5% this week" />
              <CircularProgress percentage={data.health.calories} colorClass="text-orange-500" icon={Flame} label="Calories" trend="On Track" />
              <CircularProgress percentage={data.health.hydration} colorClass="text-blue-500" icon={Droplets} label="Hydration" trend="+8% this week" />
            </div>
          </div>

          {/* Bottom Split: Timeline & Appointment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-display font-bold text-espresso-900 tracking-tight">Timeline</h3>
                <button className="text-xs font-bold text-camel-600 hover:text-camel-800">View All</button>
              </div>
              
              <div className="relative pl-6 border-l-2 border-camel-100 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[33px] bg-white p-1.5 rounded-full"><CheckCircle2 className="text-camel-600" size={20} /></div>
                  <p className="font-bold text-espresso-900">Vaccination - DHPP</p>
                  <p className="text-xs font-medium text-espresso-500 mt-1">Oct 20, 2024 • Dr. Emily Carter</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[33px] bg-white p-1.5 rounded-full"><Circle className="text-camel-300 fill-camel-100" size={20} /></div>
                  <p className="font-bold text-espresso-900">Annual Checkup</p>
                  <p className="text-xs font-medium text-camel-600 mt-1">Nov 10, 2024 • 10:30 AM</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-camel-50 pointer-events-none">
                   <Syringe size={120} strokeWidth={1} className="-rotate-12 translate-x-8 -translate-y-8" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-display font-bold text-espresso-900 tracking-tight mb-8">Next Visit</h3>
                  
                  <div className="flex gap-4 items-center bg-bg-secondary p-4 rounded-2xl border border-camel-100/50">
                    <div className="bg-white text-camel-800 rounded-xl px-4 py-2 text-center shadow-sm">
                      <span className="block text-[10px] font-bold uppercase">Nov</span>
                      <span className="block text-2xl font-black">10</span>
                    </div>
                    <div>
                      <p className="font-bold text-espresso-900 mb-1">General Checkup</p>
                      <p className="text-xs font-medium text-espresso-500 flex items-center gap-1"><Calendar size={12}/> Dr. Mark Thorne</p>
                    </div>
                  </div>
                </div>
                
                <button onClick={handleManageAppointment} className="w-full mt-8 bg-camel-600 text-white py-3.5 rounded-full font-bold text-sm hover:bg-camel-700 transition-colors relative z-10 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Manage Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </AnimatePresence>
    </>
  );
}


