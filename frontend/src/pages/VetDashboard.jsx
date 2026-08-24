import React, { useState } from 'react';
import { 
  Stethoscope, 
  CalendarCheck, 
  ClipboardList, 
  Clock, 
  User, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  RefreshCw, 
  AlertTriangle, 
  Syringe, 
  Phone, 
  Mail, 
  X, 
  Calendar, 
  Check, 
  Sparkles,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const weeklyAppointmentsTrend = [
  { day: 'Mon', Total: 12, Completed: 10 },
  { day: 'Tue', Total: 18, Completed: 15 },
  { day: 'Wed', Total: 14, Completed: 14 },
  { day: 'Thu', Total: 22, Completed: 19 },
  { day: 'Fri', Total: 20, Completed: 18 },
  { day: 'Sat', Total: 16, Completed: 14 },
  { day: 'Sun', Total: 8, Completed: 8 }
];

const initialMockAppointments = [
  {
    id: 'app-101',
    appointmentTime: '09:30 AM',
    visitDate: '2026-08-25',
    status: 'scheduled',
    reason: 'Severe paw scratching and acute skin redness',
    symptoms: 'Erythema between toes on hind paws, incessant biting and licking over past 48 hours.',
    owner: {
      name: 'Alex Johnson',
      phone: '+1 (555) 234-5678',
      email: 'alex.owner@furshield.com'
    },
    pet: {
      id: 'pet-1',
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'Male',
      weight: '31.2 kg',
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
      allergies: ['Chicken Protein', 'Pollen Allergy'],
      vaccinationStatus: 'Up-to-Date (Rabies & DHPP 2026)',
      pastRecords: [
        {
          date: '2026-07-20',
          title: 'Annual Rabies & DHPP Booster',
          doctor: 'Dr. Sarah Connor (DVM)',
          notes: 'Administered 3-year rabies booster. Vital signs normal.'
        }
      ]
    }
  },
  {
    id: 'app-102',
    appointmentTime: '11:00 AM',
    visitDate: '2026-08-25',
    status: 'confirmed',
    reason: 'Routine Bi-Annual Dental Scale & Polish Checkup',
    symptoms: 'Mild halitosis noted by owner, slight yellow tartar accumulation on upper molars.',
    owner: {
      name: 'Alex Johnson',
      phone: '+1 (555) 234-5678',
      email: 'alex.owner@furshield.com'
    },
    pet: {
      id: 'pet-2',
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      age: 2,
      gender: 'Female',
      weight: '4.3 kg',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
      allergies: ['None Reported'],
      vaccinationStatus: 'Up-to-Date (FVRCP & FeLV 2026)',
      pastRecords: [
        {
          date: '2026-06-18',
          title: 'FVRCP Vaccine Booster',
          doctor: 'Dr. Emily Watson (DVM)',
          notes: 'Core FVRCP combo booster given. FeLV/FIV virus blood test negative.'
        }
      ]
    }
  }
];

const VetDashboard = () => {
  const [appointments, setAppointments] = useState(initialMockAppointments);
  const [activeTab, setActiveTab] = useState('queue');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [viewingHistoryPet, setViewingHistoryPet] = useState(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '2026-08-26', time: '10:00 AM' });

  // Treatment Logger Form State
  const [loggerAppointmentId, setLoggerAppointmentId] = useState(initialMockAppointments[0].id);
  const [treatmentForm, setTreatmentForm] = useState({
    symptoms: initialMockAppointments[0].symptoms,
    diagnosis: 'Acute Canine Allergic Dermatitis',
    medication: 'Apoquel (Oclacitinib) 16mg',
    dosage: '1 tablet twice daily for 7 days',
    followUpActions: 'Schedule skin cytology audit in 14 days.',
    followUpDate: '2026-09-08'
  });
  const [logSuccessMessage, setLogSuccessMessage] = useState(false);

  // Filtered Appointments
  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = 
      app.pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
  };

  const handleCancel = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!reschedulingAppointment) return;

    setAppointments(prev => prev.map(a => 
      a.id === reschedulingAppointment.id 
        ? { ...a, visitDate: rescheduleData.date, appointmentTime: rescheduleData.time, status: 'scheduled' } 
        : a
    ));
    setReschedulingAppointment(null);
  };

  const handleTreatmentLogSubmit = (e) => {
    e.preventDefault();
    setLogSuccessMessage(true);
    setTimeout(() => setLogSuccessMessage(false), 4000);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. CLINICAL HEADER BANNER */}
      <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            <Stethoscope className="w-4 h-4 text-brand-sage" />
            <span>Veterinary Medical Portal • Clinic Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dr. Sarah Connor, DVM
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Paws & Claws Veterinary Hospital • Licensed Clinical Practitioner (License #VET-98412)
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl font-black text-brand-sage">110</span>
            <p className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Weekly Visits</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl font-black text-amber-300">
              {appointments.filter(a => a.status === 'scheduled').length}
            </span>
            <p className="text-[10px] uppercase font-bold text-amber-100 tracking-wider">Pending Approval</p>
          </div>
        </div>
      </div>

      {/* 2. RECHARTS ANALYTICS: WEEKLY APPOINTMENTS TREND */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-brand-dark" />
              Weekly Clinic Appointments & Completion Analytics
            </h3>
            <p className="text-xs text-slate-500">Real-time volume tracking of scheduled vs completed patient consultations.</p>
          </div>
          <span className="text-xs font-extrabold bg-brand-light text-brand-dark px-3 py-1 rounded-full border border-brand-sage">
            Current Week Data
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyAppointmentsTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#064E3B', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                itemStyle={{ color: '#D1EAE1' }}
              />
              <Bar dataKey="Total" fill="#064E3B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Completed" fill="#D1EAE1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. SECTION CONTROLS (TABS) */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 min-w-[160px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'queue' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Appointments Queue ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('logger')}
          className={`flex-1 min-w-[160px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'logger' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Treatment Logger Form
        </button>
      </div>

      {/* 4. TAB CONTENT: QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-start space-x-4">
                <img src={app.pet.avatar} alt={app.pet.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-sage flex-shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-extrabold text-slate-900">{app.pet.name}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {app.pet.species} ({app.pet.breed})
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600">
                    <strong>Owner:</strong> {app.owner.name} ({app.owner.phone})
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Reason for Visit:</strong> {app.reason}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {app.status === 'scheduled' && (
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="bg-brand-dark hover:bg-brand-darker text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Approve Visit
                  </button>
                )}
                <button
                  onClick={() => setViewingHistoryPet(app.pet)}
                  className="bg-brand-sage text-brand-dark font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  Medical History
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. TAB CONTENT: LOGGER */}
      {activeTab === 'logger' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card max-w-4xl space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-dark" />
            Clinical Treatment Logger
          </h2>

          {logSuccessMessage && (
            <div className="bg-brand-light text-brand-dark p-4 rounded-2xl border border-brand-sage flex items-center gap-3 text-xs font-extrabold">
              <CheckCircle2 className="w-5 h-5 text-brand-dark flex-shrink-0" />
              <span>Medical log saved successfully! permanent patient history updated.</span>
            </div>
          )}

          <form onSubmit={handleTreatmentLogSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clinical Diagnosis</label>
              <input
                type="text"
                required
                value={treatmentForm.diagnosis}
                onChange={(e) => setTreatmentForm({ ...treatmentForm, diagnosis: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-dark text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prescribed Medication & Dosage</label>
              <input
                type="text"
                required
                value={treatmentForm.medication}
                onChange={(e) => setTreatmentForm({ ...treatmentForm, medication: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-dark text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-dark hover:bg-brand-darker text-white font-extrabold px-8 py-3 rounded-xl text-sm transition-all shadow-md"
            >
              Save Treatment Record
            </button>
          </form>
        </div>
      )}

      {/* MEDICAL HISTORY MODAL */}
      {viewingHistoryPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingHistoryPet(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900">Medical History: {viewingHistoryPet.name}</h3>
              <button onClick={() => setViewingHistoryPet(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <p><strong>Species/Breed:</strong> {viewingHistoryPet.species} - {viewingHistoryPet.breed}</p>
              <p><strong>Weight:</strong> {viewingHistoryPet.weight}</p>
              <div className="bg-bg-soft p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">Past Encounters:</h4>
                {viewingHistoryPet.pastRecords.map((r, i) => (
                  <div key={i} className="text-slate-600">
                    • <strong>{r.title}</strong> ({r.date}): {r.notes}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetDashboard;
