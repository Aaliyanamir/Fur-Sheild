import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Flame, Moon, Droplets, CheckCircle2, Circle, ArrowRight, Footprints, Loader2 } from 'lucide-react';
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
      <motion.div initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Portrait Card */}
        <motion.div className="lg:col-span-4 relative h-[600px] rounded-[2rem] overflow-hidden group shadow-[0_15px_40px_rgba(90,56,37,0.08)]">
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

        {/* Data Widgets */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <motion.div className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)] flex flex-col justify-between h-full">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <motion.div className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)]">
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

            <motion.div className="flex flex-col gap-6">
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

      {/* Modals rendered outside the normal flow */}
      <AnimatePresence>
        <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </AnimatePresence>
    </>
  );
}
