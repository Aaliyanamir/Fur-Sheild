import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function VetHub() {
  const [loading, setLoading] = useState(true);

  // BACKEND PREP: Mock API data for the clinical queue
  const mockQueue = [
    { id: 'PT-101', petName: 'Buddy', owner: 'Sarah Jenkins', time: '10:30 AM', status: 'Waiting', type: 'Annual Checkup', severity: 'Low' },
    { id: 'PT-102', petName: 'Luna', owner: 'Mike Ross', time: '11:15 AM', status: 'In Progress', type: 'Vaccination', severity: 'Low' },
    { id: 'PT-103', petName: 'Max', owner: 'Emma Stone', time: '12:00 PM', status: 'Scheduled', type: 'Skin Allergy', severity: 'Medium' },
    { id: 'PT-104', petName: 'Bella', owner: 'John Doe', time: '02:30 PM', status: 'Scheduled', type: 'Post-Op Review', severity: 'High' },
  ];

  useEffect(() => {
    // Simulate network fetch
    setTimeout(() => setLoading(false), 600);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-accent-50 text-accent-600 border-accent-200';
      case 'Medium': return 'bg-camel-50 text-camel-700 border-camel-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <>
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">Clinical Workspace</p>
          <h1 className="text-3xl font-display font-black text-espresso-900 tracking-tight">
            Dr. Mark Thorne
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
            <input 
              type="text" 
              placeholder="Search patient ID or name..." 
              className="pl-10 pr-4 py-2.5 rounded-full border border-camel-100 bg-white text-sm font-medium focus:outline-none focus:border-camel-400 focus:ring-1 focus:ring-camel-400 w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-camel-100 text-espresso-500 hover:text-camel-600 hover:border-camel-300 shadow-sm transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Clinical Grid Layout */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Patient Queue (Col 8) */}
        <motion.div variants={item} className="lg:col-span-8 bg-white rounded-[2rem] border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)] overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 md:p-8 border-b border-camel-100/50 flex justify-between items-center bg-bg-secondary/30">
            <h2 className="text-xl font-display font-bold text-espresso-900">Today's Queue</h2>
            <span className="bg-camel-100 text-camel-800 text-xs font-bold px-3 py-1 rounded-full">4 Patients</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-espresso-400 border-b border-camel-50">
                  <th className="font-bold pb-4 pl-6 pt-4">Time</th>
                  <th className="font-bold pb-4 pt-4">Patient</th>
                  <th className="font-bold pb-4 pt-4">Reason</th>
                  <th className="font-bold pb-4 pt-4">Status</th>
                  <th className="font-bold pb-4 pr-6 pt-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-espresso-800">
                {mockQueue.map((patient, idx) => (
                  <tr key={patient.id} className="hover:bg-camel-50/50 transition-colors border-b border-camel-50/50 group cursor-pointer">
                    <td className="py-4 pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-espresso-600">
                        <Clock size={14} className="text-camel-400" />
                        {patient.time}
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-espresso-900">{patient.petName}</p>
                      <p className="text-xs text-espresso-400">{patient.id} • {patient.owner}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(patient.severity)}`}>
                        {patient.type}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {patient.status === 'Waiting' && <AlertCircle size={14} className="text-accent-500" />}
                        {patient.status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
                        {patient.status === 'Scheduled' && <div className="w-2 h-2 rounded-full bg-espresso-200"></div>}
                        <span className={patient.status === 'Waiting' ? 'text-accent-600 font-bold' : ''}>{patient.status}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button className="text-camel-600 font-bold hover:text-camel-800 text-xs uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                        Open Chart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Sidebar / Quick Insights (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-32">
          
          {/* Active Consult Widget */}
          <motion.div variants={item} className="bg-espresso-900 rounded-[2rem] p-8 border border-espresso-800 shadow-md text-white">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <h3 className="font-bold text-sm uppercase tracking-wide text-white/80">Active Consultation</h3>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center font-display font-black text-xl border border-white/20">
                L
              </div>
              <div>
                <h4 className="text-2xl font-bold font-display">Luna</h4>
                <p className="text-camel-300 text-sm font-medium">Feline • 2 yrs • Mike Ross</p>
              </div>
            </div>
            <button className="w-full bg-camel-600 hover:bg-camel-500 text-white py-3 rounded-full font-bold text-sm transition-colors shadow-lg shadow-camel-900/50 flex items-center justify-center gap-2">
              <FileText size={16} /> Resume Clinical Notes
            </button>
          </motion.div>

          {/* Daily Summary */}
          <motion.div variants={item} className="bg-white rounded-[2rem] p-8 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)] h-full">
            <h3 className="text-lg font-display font-bold text-espresso-900 mb-6">Shift Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-2xl">
                <span className="text-sm font-bold text-espresso-600">Total Appointments</span>
                <span className="text-lg font-black text-espresso-900">12</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl">
                <span className="text-sm font-bold text-emerald-700">Completed</span>
                <span className="text-lg font-black text-emerald-700">4</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-accent-50 rounded-2xl">
                <span className="text-sm font-bold text-accent-700">Pending Approvals</span>
                <span className="text-lg font-black text-accent-700">3</span>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </>
  );
}
