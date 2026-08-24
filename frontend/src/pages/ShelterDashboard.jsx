import React, { useState } from 'react';
import EditShelterPetModal from '../components/EditShelterPetModal';
import ApplicationReviewModal from '../components/ApplicationReviewModal';
import { 
  Home, 
  Heart, 
  FileText, 
  CheckCircle, 
  Plus, 
  Search, 
  Mail, 
  UserCheck, 
  Utensils, 
  Activity, 
  Scissors, 
  Send, 
  X, 
  Filter, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Building, 
  User, 
  Phone, 
  Edit3, 
  AlertCircle,
  PieChart as PieIcon,
  TrendingUp,
  Eye
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const adoptionStatusPieData = [
  { name: 'Available', value: 14, color: '#064E3B' },
  { name: 'Pending', value: 6, color: '#F59E0B' },
  { name: 'Adopted', value: 24, color: '#10B981' }
];

const monthlyAdoptionsBarData = [
  { month: 'May', Adoptions: 12 },
  { month: 'Jun', Adoptions: 18 },
  { month: 'Jul', Adoptions: 22 },
  { month: 'Aug', Adoptions: 28 }
];

const initialMockAdoptablePets = [
  {
    id: 'shelter-pet-1',
    name: 'Max',
    species: 'Dog',
    breed: 'Beagle & Hound Mix',
    age: 1,
    gender: 'Male',
    weight: '12.4 kg',
    adoptionStatus: 'Available',
    healthStatus: 'Vaccinated, Microchipped & Neutered',
    intakeDate: '2026-06-10',
    description: 'Friendly, energetic beagle mix looking for an active family with a fenced yard.',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
    careLogs: []
  },
  {
    id: 'shelter-pet-2',
    name: 'Milo',
    species: 'Cat',
    breed: 'Domestic Short Hair (Tabby)',
    age: 2,
    gender: 'Male',
    weight: '4.1 kg',
    adoptionStatus: 'Pending Adoption',
    healthStatus: 'Vaccinated & De-wormed',
    intakeDate: '2026-07-02',
    description: 'Gentle, affectionate lap cat who loves sunbathing and feather toys.',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    careLogs: []
  }
];

const initialMockAdoptionRequests = [
  {
    id: 'req-201',
    applicantName: 'Emily Clark',
    email: 'emily.clark@example.com',
    phone: '+1 (555) 987-6543',
    petId: 'shelter-pet-1',
    petName: 'Max (Beagle Mix)',
    message: 'We have a large fenced backyard and experience with hounds. Would love to schedule a visit to meet Max!',
    dateSubmitted: '2026-08-22',
    status: 'Under Review',
    housingType: 'Own Single Family Home',
    hasOtherPets: 'No'
  }
];

const ShelterDashboard = () => {
  const [pets, setPets] = useState(initialMockAdoptablePets);
  const [requests, setRequests] = useState(initialMockAdoptionRequests);
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventoryFilter, setInventoryFilter] = useState('all');

  // Modals State
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [reviewingRequest, setReviewingRequest] = useState(null);

  const filteredPets = pets.filter((pet) => {
    if (inventoryFilter === 'all') return true;
    return pet.adoptionStatus === inventoryFilter || pet.species === inventoryFilter;
  });

  const handleSavePet = (updatedPet) => {
    setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
  };

  const handleApproveRequest = (reqId) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r));
  };

  const handleFinalizeAdoption = (req) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Finalized' } : r));
    setPets(prev => prev.map(p => p.id === req.petId ? { ...p, adoptionStatus: 'Adopted' } : p));
    alert(`🎉 Adoption Finalized! ${req.petName} adopted by ${req.applicantName}.`);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. HEADER BANNER */}
      <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            <Building className="w-4 h-4 text-brand-sage" />
            <span>Animal Shelter & Adoption Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Happy Tails Rescue Shelter
          </h1>
        </div>

        <button
          onClick={() => setIsAddPetModalOpen(true)}
          className="bg-brand-sage hover:bg-emerald-200 text-brand-dark font-extrabold px-5 py-3 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          List Adoptable Pet
        </button>
      </div>

      {/* 2. RECHARTS ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <PieIcon className="w-5 h-5 text-brand-dark" />
            Shelter Inventory Status Breakdown
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={adoptionStatusPieData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {adoptionStatusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-5 h-5 text-brand-dark" />
            Monthly Adoption Success Growth
          </h3>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAdoptionsBarData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#064E3B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="Adoptions" fill="#064E3B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. TABS */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'inventory' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Adoptable Inventory ({pets.length})
        </button>

        <button
          onClick={() => setActiveTab('coordination')}
          className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'coordination' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Adopter Applications ({requests.length})
        </button>
      </div>

      {/* 4. TAB 1: INVENTORY GRID */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
              <div>
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-brand-dark text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                    {pet.adoptionStatus}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">{pet.name}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 bg-brand-light text-brand-dark rounded-md">
                      {pet.species}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{pet.breed} • {pet.age} Yr Old • {pet.healthStatus}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setEditingPet(pet)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. TAB 2: APPLICATIONS */}
      {activeTab === 'coordination' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-dark" />
            Adopter Applications
          </h2>

          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="p-4 bg-bg-soft rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{req.applicantName}</h4>
                  <p className="text-slate-600">Target Pet: <strong className="text-brand-dark">{req.petName}</strong></p>
                </div>

                <button
                  onClick={() => setReviewingRequest(req)}
                  className="bg-slate-900 text-white font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Review Application
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      <EditShelterPetModal pet={editingPet} isOpen={!!editingPet} onClose={() => setEditingPet(null)} onSave={handleSavePet} />
      <ApplicationReviewModal req={reviewingRequest} isOpen={!!reviewingRequest} onClose={() => setReviewingRequest(null)} onApprove={handleApproveRequest} onFinalize={handleFinalizeAdoption} />
    </div>
  );
};

export default ShelterDashboard;
