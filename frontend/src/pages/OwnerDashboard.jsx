import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReportExporter from '../components/ReportExporter';
import PetDetailsModal from '../components/PetDetailsModal';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Bell, 
  Plus, 
  Activity, 
  Award, 
  Syringe, 
  Stethoscope, 
  Sparkles, 
  UploadCloud, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  X,
  Filter,
  Image as ImageIcon,
  Edit3,
  Check,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialMockPets = [
  {
    id: 'pet-1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    weight: '31.2 kg',
    spayedNeutered: true,
    microchipNo: '985141002341908',
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80'
    ],
    timeline: [
      {
        id: 't1',
        type: 'vaccine',
        title: 'Annual Rabies & DHPP Combo Booster',
        date: '2026-07-20',
        clinic: 'Paws & Claws Veterinary Clinic',
        doctor: 'Dr. Sarah Connor (DVM)',
        notes: 'Administered 3-year rabies booster and DHPP core combo. Vital signs normal.',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        iconColor: 'bg-emerald-600'
      },
      {
        id: 't2',
        type: 'checkup',
        title: 'Bi-Annual Routine Physical Checkup',
        date: '2026-05-12',
        clinic: 'Metropolitan Animal Hospital',
        doctor: 'Dr. Robert Vance',
        notes: 'Complete physical evaluation. Dental check revealed minor tartar.',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        iconColor: 'bg-blue-600'
      }
    ],
    documents: [
      {
        id: 'd1',
        title: 'Rabies Vaccination Certificate 2026',
        category: 'Vet Certificate',
        uploadDate: '2026-07-20',
        fileSize: '1.4 MB',
        fileType: 'PDF',
        issuedBy: 'Dr. Sarah Connor (DVM)'
      }
    ],
    reminders: [
      {
        id: 'r1',
        title: 'Monthly Flea & Tick Preventive Dose',
        dueDate: '2026-09-01',
        urgent: true,
        category: 'Medication'
      }
    ]
  }
];

const OwnerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [pets, setPets] = useState(initialMockPets);
  const [selectedPetId, setSelectedPetId] = useState(initialMockPets[0].id);
  const [activeSubTab, setActiveSubTab] = useState(tabParam || 'timeline');
  const [timelineFilter, setTimelineFilter] = useState('all');

  // Modals & Drawers
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [viewingPetDetails, setViewingPetDetails] = useState(null);
  const [previewingDoc, setPreviewingDoc] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  // Sync search param tab changes
  useEffect(() => {
    if (tabParam) {
      setActiveSubTab(tabParam);
    }
  }, [tabParam]);

  // Edit Pet Form State
  const [editPetForm, setEditPetForm] = useState({
    name: selectedPet.name,
    species: selectedPet.species,
    breed: selectedPet.breed,
    age: selectedPet.age,
    weight: selectedPet.weight,
    microchipNo: selectedPet.microchipNo
  });

  const handleEditPetSubmit = (e) => {
    e.preventDefault();
    setPets(prev => prev.map(p => p.id === selectedPet.id ? { ...p, ...editPetForm } : p));
    setIsEditPetModalOpen(false);
  };

  const handleDismissReminder = (remId) => {
    setPets(prev => prev.map(p => p.id === selectedPet.id ? {
      ...p,
      reminders: p.reminders.filter(r => r.id !== remId)
    } : p));
  };

  const filteredTimeline = selectedPet.timeline.filter((item) => {
    if (timelineFilter === 'all') return true;
    return item.type === timelineFilter;
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. TOP WELCOME BANNER */}
      <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-sage" />
            <span>Pet Owner Dashboard & Health Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome Back, Alex!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Managing <span className="font-bold underline">{pets.length} companion pets</span>. Track health timelines and exported medical reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <ReportExporter pet={selectedPet} />
          <button
            onClick={() => setIsAddPetModalOpen(true)}
            className="bg-brand-sage hover:bg-emerald-200 text-brand-dark font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Register New Pet
          </button>
        </div>
      </div>

      {/* 2. PET SELECTOR TABS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-dark fill-current" />
            Active Pet Profile
          </h2>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {pets.map((pet) => {
            const isSelected = pet.id === selectedPet.id;
            return (
              <button
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border transition-all whitespace-nowrap min-w-[200px] ${
                  isSelected
                    ? 'bg-white border-brand-dark shadow-md ring-2 ring-brand-dark/10'
                    : 'bg-white/70 border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                <img
                  src={pet.avatar}
                  alt={pet.name}
                  className={`w-10 h-10 rounded-full object-cover border-2 ${
                    isSelected ? 'border-brand-dark' : 'border-slate-200'
                  }`}
                />
                <div className="text-left">
                  <h4 className={`text-sm font-bold ${isSelected ? 'text-brand-dark' : 'text-slate-900'}`}>
                    {pet.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {pet.species} • {pet.breed}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE PET CARD & ACTIONS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 border-b border-slate-100 pb-6">
            <img
              src={selectedPet.avatar}
              alt={selectedPet.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-extrabold text-slate-900">{selectedPet.name}</h2>
                <span className="px-3 py-1 bg-brand-light text-brand-dark text-xs font-bold rounded-full uppercase">
                  {selectedPet.species}
                </span>
                <button
                  onClick={() => {
                    setEditPetForm({
                      name: selectedPet.name,
                      species: selectedPet.species,
                      breed: selectedPet.breed,
                      age: selectedPet.age,
                      weight: selectedPet.weight,
                      microchipNo: selectedPet.microchipNo
                    });
                    setIsEditPetModalOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Pet Profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-600">{selectedPet.breed}</p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-500 font-medium">
                <span>Microchip: <strong className="text-slate-800">{selectedPet.microchipNo}</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Age</span>
              <span className="text-lg font-bold text-slate-900">{selectedPet.age} Yrs</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Gender</span>
              <span className="text-lg font-bold text-slate-900">{selectedPet.gender}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Weight</span>
              <span className="text-lg font-bold text-slate-900">{selectedPet.weight}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <button
                onClick={() => setViewingPetDetails(selectedPet)}
                className="w-full text-brand-dark font-extrabold text-xs hover:underline pt-1"
              >
                View Full Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SUB-TABS (TIMELINE | DOCUMENTS | REMINDERS) */}
      <div className="space-y-6">
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveSubTab('timeline');
              setSearchParams({ tab: 'timeline' });
            }}
            className={`flex-1 min-w-[140px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'timeline' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            Visual Health Timeline ({selectedPet.timeline.length})
          </button>

          <button
            onClick={() => {
              setActiveSubTab('documents');
              setSearchParams({ tab: 'certificates' });
            }}
            className={`flex-1 min-w-[140px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'certificates' || activeSubTab === 'documents' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Vet Certificates ({selectedPet.documents.length})
          </button>

          <button
            onClick={() => {
              setActiveSubTab('reminders');
              setSearchParams({ tab: 'reminders' });
            }}
            className={`flex-1 min-w-[140px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'reminders' ? 'bg-brand-dark text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            Reminders ({selectedPet.reminders.length})
          </button>
        </div>

        {/* TAB 1: HEALTH TIMELINE */}
        {(activeSubTab === 'timeline' || !activeSubTab) && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-dark" />
                  Medical History & Timeline for {selectedPet.name}
                </h3>
              </div>
              <ReportExporter pet={selectedPet} />
            </div>

            <div className="relative border-l-2 border-brand-sage ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
              {filteredTimeline.map((event) => (
                <div key={event.id} className="relative group">
                  <span className={`absolute -left-[37px] sm:-left-[45px] top-0 w-8 h-8 rounded-full ${event.iconColor} flex items-center justify-center shadow-md ring-4 ring-white`}>
                    <Syringe className="w-4 h-4 text-white" />
                  </span>

                  <div className="bg-bg-soft p-5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-bold text-slate-900">{event.title}</h4>
                      <span className="text-xs font-semibold text-slate-500">{event.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{event.notes}</p>
                    <p className="text-[11px] text-slate-400 font-bold">Attending Vet: {event.doctor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VET CERTIFICATES */}
        {(activeSubTab === 'certificates' || activeSubTab === 'documents') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-dark" />
              Digitized Vet Certificates Repository
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPet.documents.map((doc) => (
                <div key={doc.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-extrabold rounded uppercase">
                      {doc.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                    <p className="text-xs text-slate-500">Issued by: {doc.issuedBy}</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => setPreviewingDoc(doc)}
                      className="flex-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Quick View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REMINDERS */}
        {activeSubTab === 'reminders' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-dark" />
              Vaccination & Healthcare Reminders
            </h3>

            <div className="space-y-3">
              {selectedPet.reminders.map((rem) => (
                <div key={rem.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rem.title}</h4>
                    <p className="text-xs text-slate-500">Due Date: {rem.dueDate}</p>
                  </div>
                  <button
                    onClick={() => handleDismissReminder(rem.id)}
                    className="bg-white border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Mark Completed
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <PetDetailsModal pet={viewingPetDetails} isOpen={!!viewingPetDetails} onClose={() => setViewingPetDetails(null)} />
      <DocumentPreviewModal doc={previewingDoc} petName={selectedPet.name} isOpen={!!previewingDoc} onClose={() => setPreviewingDoc(null)} />

      {/* EDIT PET MODAL */}
      <AnimatePresence>
        {isEditPetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditPetModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 border border-slate-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Edit Profile for {selectedPet.name}</h3>
                <button onClick={() => setIsEditPetModalOpen(false)} className="p-1 text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditPetSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pet Name</label>
                  <input
                    type="text"
                    required
                    value={editPetForm.name}
                    onChange={(e) => setEditPetForm({ ...editPetForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Weight</label>
                    <input
                      type="text"
                      value={editPetForm.weight}
                      onChange={(e) => setEditPetForm({ ...editPetForm, weight: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Microchip #</label>
                    <input
                      type="text"
                      value={editPetForm.microchipNo}
                      onChange={(e) => setEditPetForm({ ...editPetForm, microchipNo: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsEditPetModalOpen(false)} className="px-4 py-2 font-bold text-slate-600">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-slate-900 text-white font-extrabold rounded-xl">
                    Save Updates
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerDashboard;
