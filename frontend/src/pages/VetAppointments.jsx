import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MoreHorizontal, Plus, Filter, FileText, ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';


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

export default function VetAppointments() {
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const vetService = (await import('../services/vet.service')).default;
        const res = await vetService.getQueue();
        if (res.success) {
          const grouped = {};

          res.data.forEach((appt) => {
            const date = new Date(appt.date);
            const dateStr = date.toISOString().split('T')[0];

            if (!grouped[dateStr]) {
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);

              let label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              if (dateStr === today.toISOString().split('T')[0]) {
                label = 'Today, ' + label;
              } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
                label = 'Tomorrow, ' + label;
              } else {
                label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
              }

              grouped[dateStr] = {
                _id: dateStr,
                dateLabel: label,
                timestamp: date.getTime(),
                appointments: []
              };
            }

            const petName = appt.pet?.name || 'Unknown Pet';
            const petBreed = appt.pet?.species || 'Pet';
            const ownerName = appt.user?.name || 'Unknown Owner';
            const petImage = appt.pet?.avatarUrl || '/images/pet-1.jpg';
            const severity = appt.severity || 'ROUTINE';

            grouped[dateStr].appointments.push({
              id: appt._id,
              time: new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              duration: '30 min',
              patient: {
                name: petName,
                breed: petBreed,
                image: petImage
              },
              owner: { name: ownerName },
              reason: appt.reason || 'Consultation',
              severity,
              status: appt.status || 'PENDING'
            });
          });

          const groupedArray = Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
          setAppointmentsData(groupedArray);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);


  const handleUpdateAppointmentStatus = async (apptId, newStatus) => {
    try {
      const vetService = (await import('../services/vet.service')).default;
      const res = await vetService.updateAppointment(apptId, { status: newStatus });
      if (res.success) {
        setAppointmentsData(prev => prev.map(group => ({
          ...group,
          appointments: group.appointments.map(a => a.id === apptId ? { ...a, status: newStatus } : a)
        })));
        alert(`Appointment ${newStatus === 'CONFIRMED' ? 'accepted successfully! Notification sent to owner.' : 'updated.'}`);
      }
    } catch (err) {
      alert('Error updating appointment: ' + (err.response?.data?.message || err.message));
    }
  };

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'EMERGENCY': return <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Emergency</span>;
      case 'URGENT': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Urgent</span>;
      default: return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Routine</span>;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
        <div>
          <p className="text-camel-600 font-bold text-sm tracking-widest uppercase mb-1">Schedule Manager</p>
          <h1 className="text-3xl md:text-4xl font-display font-black text-espresso-900 tracking-tight">
            Appointments
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          <button className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-5 py-3 rounded-full font-bold text-sm tracking-wide shadow-sm transition-transform hover:-translate-y-0.5 whitespace-nowrap">
            <Plus size={16} /> Block Time
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-camel-100 text-espresso-500 hover:text-camel-600 hover:border-camel-300 shadow-sm transition-colors relative">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANE: AGENDA VIEW (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Controls */}
          <div className="flex items-center justify-between bg-white p-2 rounded-full border border-camel-100 shadow-sm">
            <div className="flex gap-1">
              <button className="px-6 py-2 rounded-full bg-camel-50 text-camel-800 font-bold text-sm shadow-sm">Agenda</button>
              <button className="px-6 py-2 rounded-full text-espresso-500 hover:bg-camel-50 font-bold text-sm transition-colors">Weekly</button>
            </div>
            <div className="flex items-center gap-4 pr-4">
              <span className="text-sm font-bold text-espresso-900 hidden md:block">August 2026</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-camel-200 flex items-center justify-center text-espresso-400 hover:bg-camel-50 hover:text-espresso-900 transition-colors"><ChevronLeft size={16}/></button>
                <button className="w-8 h-8 rounded-full border border-camel-200 flex items-center justify-center text-espresso-400 hover:bg-camel-50 hover:text-espresso-900 transition-colors"><ChevronRight size={16}/></button>
              </div>
            </div>
          </div>

          {/* Agenda List */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-camel-600"></div></div>
            ) : appointmentsData.length === 0 ? (
              <div className="text-center p-8 bg-white border border-camel-100 rounded-[1.5rem] shadow-sm text-espresso-500 text-sm font-medium">No upcoming appointments.</div>
            ) : null}
            {appointmentsData.map((day) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={day._id}>
                <h3 className="text-sm font-black uppercase tracking-widest text-espresso-400 mb-4 px-2 border-l-2 border-camel-300 ml-1">
                  {day.dateLabel}
                </h3>
                <div className="space-y-3">
                  {day.appointments.map((appt) => (
                    <div key={appt.id} className="group flex flex-col md:flex-row gap-4 bg-white border border-camel-100 p-4 md:p-5 rounded-[1.5rem] shadow-sm hover:border-camel-300 hover:shadow-md transition-all cursor-pointer">
                      
                      {/* Time Block */}
                      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-camel-100 pb-3 md:pb-0 md:pr-4">
                        <div className="flex items-center gap-2 md:gap-0 md:flex-col md:items-start">
                          <span className="text-lg font-black text-espresso-900 tracking-tight">{appt.time}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-camel-600 flex items-center gap-1 mt-0.5"><Clock size={10}/> {appt.duration}</span>
                        </div>
                        {getSeverityBadge(appt.severity)}
                      </div>

                      {/* Details Block */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar src={appt.patient.image} alt={appt.patient.name} name={appt.patient.name} className="w-14 h-14 rounded-full object-cover border-2 border-camel-50 shadow-sm" />
                              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${appt.status === 'CONFIRMED' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                            </div>
                            <div>
                              <h4 className="text-xl font-display font-black text-espresso-900">{appt.patient.name}</h4>
                              <p className="text-xs font-bold text-espresso-500 mt-0.5">{appt.patient.breed} • {appt.owner.name}</p>
                            </div>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-camel-50 text-camel-600 flex items-center justify-center hover:bg-camel-100 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={16}/>
                          </button>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-camel-100">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-camel-400 shrink-0"/>
                            <p className="text-sm font-medium text-espresso-700">{appt.reason}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {['CONFIRMED', 'Approved', 'ACCEPTED', 'Confirmed'].includes(appt.status) ? (
                              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1">
                                <CheckCircle2 size={14} /> Accepted
                              </span>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleUpdateAppointmentStatus(appt.id, 'CONFIRMED')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle2 size={14} /> Accept Booking
                                </button>
                                <button 
                                  onClick={() => handleUpdateAppointmentStatus(appt.id, 'CANCELLED')}
                                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* RIGHT PANE: CALENDAR & OVERVIEW (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-32">
          
          {/* Mini Calendar Widget */}
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-display font-bold text-espresso-900">August 2026</h3>
              <div className="flex gap-1">
                <button className="text-camel-400 hover:text-espresso-900"><ChevronLeft size={16}/></button>
                <button className="text-camel-400 hover:text-espresso-900"><ChevronRight size={16}/></button>
              </div>
            </div>
            
            {/* Calendar Grid (Visual Mock) */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-[10px] font-bold text-espresso-400 uppercase">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Padding */}
              <div></div><div></div><div></div><div></div><div></div>
              
              {/* Dates */}
              {[...Array(31)].map((_, i) => {
                const date = i + 1;
                const isToday = date === 27;
                const hasAppts = [27, 28, 30].includes(date);
                return (
                  <div key={date} className={`h-8 w-8 mx-auto flex flex-col items-center justify-center rounded-full text-xs font-medium cursor-pointer transition-colors ${isToday ? 'bg-camel-600 text-white shadow-md' : 'text-espresso-800 hover:bg-camel-50'}`}>
                    {date}
                    {hasAppts && !isToday && <div className="w-1 h-1 bg-camel-400 rounded-full mt-0.5"></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="bg-espresso-900 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
            
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Weekly Overview</h3>
            
            
            <div className="space-y-5 relative z-10">
              <div>
                <p className="text-3xl font-black tracking-tight">{appointmentsData.reduce((acc, day) => acc + day.appointments.length, 0)}</p>
                <p className="text-sm font-medium text-white/70">Total Scheduled</p>
              </div>
              <div className="w-full h-px bg-white/10"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <p className="text-sm font-medium text-white/90">Routine</p>
                </div>
                <p className="text-sm font-bold">{appointmentsData.reduce((acc, day) => acc + day.appointments.filter(a => a.severity === 'ROUTINE').length, 0)}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <p className="text-sm font-medium text-white/90">Urgent</p>
                </div>
                <p className="text-sm font-bold">{appointmentsData.reduce((acc, day) => acc + day.appointments.filter(a => a.severity === 'URGENT').length, 0)}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                  <p className="text-sm font-medium text-white/90">Emergency</p>
                </div>
                <p className="text-sm font-bold">{appointmentsData.reduce((acc, day) => acc + day.appointments.filter(a => a.severity === 'EMERGENCY').length, 0)}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}
