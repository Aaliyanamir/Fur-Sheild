import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, CheckCircle2, X, Loader2, Plus, MapPin, DollarSign, Phone, User, ShieldCheck, CreditCard, Wallet, Camera, Upload } from 'lucide-react';
import adoptService from '../services/adopt.service';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../lib/imageUtils';

export default function AdoptionCatalog() {
  const { user } = useContext(AuthContext);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSpecies, setActiveSpecies] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Adoption Application Modal State
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [adoptFormData, setAdoptFormData] = useState({ 
    applicantName: user ? user.name : '', 
    email: user ? user.email : '', 
    phone: user ? user.phone || '' : '', 
    livingSituation: 'House with Yard', 
    experience: 'Have had pets before', 
    paymentMethod: 'Cash on Pickup',
    message: 'I would love to give this pet a safe and caring home!' 
  });
  const [isSubmittingAdopt, setIsSubmittingAdopt] = useState(false);
  const [adoptSuccess, setAdoptSuccess] = useState(false);

  // List Pet Modal State
  const [isListPetModalOpen, setIsListPetModalOpen] = useState(false);
  const [listPetData, setListPetData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    adoptionFee: '0',
    pickupAddress: '',
    phone: user ? user.phone || '' : '',
    behaviorNotes: ''
  });
  const [listPetPhoto, setListPetPhoto] = useState(null);
  const [listPetPhotoPreview, setListPetPhotoPreview] = useState(null);
  const [isSubmittingListPet, setIsSubmittingListPet] = useState(false);
  const [listPetError, setListPetError] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const res = await adoptService.getAdoptableAnimals().catch(() => ({ success: false }));
      if (res && res.success && res.data && res.data.length > 0) {
        setAnimals(res.data);
      } else {
        setAnimals([
          { _id: 'demo1', name: 'Max', species: 'Dog', breed: 'Beagle', age: '2 Years', status: 'ADOPTABLE', adoptionFee: 0, pickupAddress: 'Gulberg III, Lahore', avatarUrl: '/images/pet-1.jpg', behaviorNotes: 'Friendly, playful, loves children and long walks.' },
          { _id: 'demo2', name: 'Cleo', species: 'Cat', breed: 'Persian', age: '1 Year', status: 'ADOPTABLE', adoptionFee: 15, pickupAddress: 'DHA Phase 5, Karachi', avatarUrl: '/images/pet-2.jpg', behaviorNotes: 'Calm and affectionate lap cat.' },
          { _id: 'demo3', name: 'Sunny', species: 'Bird', breed: 'Sun Conure', age: '3 Years', status: 'ADOPTABLE', adoptionFee: 0, pickupAddress: 'F-7/2, Islamabad', avatarUrl: '/images/signup-bird.jpg', behaviorNotes: 'Social, cheerful, and hand-trained.' },
          { _id: 'demo4', name: 'Nova', species: 'Dog', breed: 'German Shepherd Mix', age: '8 Months', status: 'ADOPTABLE', adoptionFee: 20, pickupAddress: 'Johar Town, Lahore', avatarUrl: '/images/dash-dog-1.jpg', behaviorNotes: 'Young and energetic, needs gentle socialization.' },
          { _id: 'demo5', name: 'Bella', species: 'Cat', breed: 'Tabby', age: '2 Years', status: 'ADOPTABLE', adoptionFee: 0, pickupAddress: 'Clifton Block 4, Karachi', avatarUrl: '/images/pet-3.jpg', behaviorNotes: 'Playful and curious, loves interactive toys.' },
          { _id: 'demo6', name: 'Whiskers', species: 'Cat', breed: 'Siamese Mix', age: '4 Months', status: 'ADOPTED', adoptionFee: 0, pickupAddress: 'F-6, Islamabad', avatarUrl: '/images/pet-2.jpg', behaviorNotes: 'Tiny kitten, very affectionate.', adopterInfo: { applicantName: 'Amina Sheikh', email: 'amina@gmail.com', phone: '+92 300 9876543', paymentStatus: 'Paid' } }
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptClick = (animal) => {
    if (animal.status === 'ADOPTED') return;
    setSelectedAnimal(animal);
    setAdoptSuccess(false);
    setAdoptFormData({ 
      applicantName: user ? user.name : '', 
      email: user ? user.email : '', 
      phone: user ? user.phone || '' : '', 
      livingSituation: 'House with Yard', 
      experience: 'Have had pets before', 
      paymentMethod: 'Cash on Pickup',
      message: `I would love to adopt ${animal.name} and provide a safe, loving home!` 
    });
    setIsAdoptModalOpen(true);
  };

  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingAdopt(true);
    try {
      const res = await adoptService.submitAdoptionRequest({ 
        ...adoptFormData, 
        animalId: selectedAnimal._id,
        paymentAmount: selectedAnimal.adoptionFee || 0
      });
      if (res.success) {
        setAdoptSuccess(true);
        // Refresh catalog to reflect adopted status immediately
        await fetchAnimals();
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting adoption application: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmittingAdopt(false);
    }
  };

  const handleListPetSubmit = async (e) => {
    e.preventDefault();
    setListPetError('');
    if (!user) {
      alert('Please log in to list your pet for adoption.');
      return;
    }
    setIsSubmittingListPet(true);
    try {
      const formData = new FormData();
      formData.append('name', listPetData.name);
      formData.append('species', listPetData.species);
      formData.append('breed', listPetData.breed);
      formData.append('age', listPetData.age);
      formData.append('gender', listPetData.gender);
      formData.append('adoptionFee', listPetData.adoptionFee);
      formData.append('pickupAddress', listPetData.pickupAddress);
      formData.append('phone', listPetData.phone);
      formData.append('behaviorNotes', listPetData.behaviorNotes);
      if (listPetPhoto) {
        formData.append('avatar', listPetPhoto);
      }

      const res = await adoptService.listPetForAdoption(formData);
      if (res.success) {
        setIsListPetModalOpen(false);
        setListPetData({
          name: '', species: 'Dog', breed: '', age: '', gender: 'Male',
          adoptionFee: '0', pickupAddress: '', phone: user ? user.phone || '' : '', behaviorNotes: ''
        });
        setListPetPhoto(null);
        setListPetPhotoPreview(null);
        await fetchAnimals();
        alert('Your pet has been successfully listed for adoption!');
      }
    } catch (error) {
      setListPetError(error.response?.data?.message || error.message || 'Failed to list pet');
    } finally {
      setIsSubmittingListPet(false);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setListPetPhoto(file);
      setListPetPhotoPreview(URL.createObjectURL(file));
    }
  };

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (animal.breed && animal.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (animal.pickupAddress && animal.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeSpecies === 'Dogs') if (animal.species !== 'Dog') return false;
    if (activeSpecies === 'Cats') if (animal.species !== 'Cat') return false;
    if (activeSpecies === 'Birds') if (animal.species !== 'Bird') return false;

    if (activeStatusFilter === 'Available') if (animal.status !== 'ADOPTABLE') return false;
    if (activeStatusFilter === 'Adopted') if (animal.status !== 'ADOPTED') return false;

    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camel-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full py-12 px-4 font-sans">
      
      {/* Header with CTA to Upload Pet */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-gradient-to-r from-espresso-900 via-espresso-800 to-camel-900 p-8 sm:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-camel-500/30 text-camel-200 border border-camel-400/30 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-3">
            Rescue & Rehome Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight mb-3">
            Meet Your New Best Friend
          </h1>
          <p className="text-camel-100 text-sm sm:text-base font-medium opacity-90">
            Browse lovable pets seeking forever homes or list your pet for safe, verified adoption with direct contact and pickup details.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button 
            onClick={() => setIsListPetModalOpen(true)}
            className="w-full sm:w-auto bg-camel-500 hover:bg-camel-400 text-espresso-950 font-black px-7 py-4 rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider"
          >
            <Plus size={20} strokeWidth={3} /> Post Pet For Adoption
          </button>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-camel-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        
        {/* Species & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Dogs', 'Cats', 'Birds'].map(sp => (
            <button
              key={sp}
              onClick={() => setActiveSpecies(sp)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeSpecies === sp 
                  ? 'bg-espresso-900 text-white shadow-md' 
                  : 'bg-white text-espresso-600 border border-camel-100 hover:bg-camel-50'
              }`}
            >
              {sp}
            </button>
          ))}
          <div className="h-6 w-px bg-camel-200 mx-1 hidden sm:block" />
          {['All', 'Available', 'Adopted'].map(st => (
            <button
              key={st}
              onClick={() => setActiveStatusFilter(st)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeStatusFilter === st 
                  ? 'bg-camel-600 text-white shadow-md' 
                  : 'bg-white text-espresso-600 border border-camel-100 hover:bg-camel-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-camel-400" size={16} />
          <input 
            type="text" 
            placeholder="Search name, breed, location..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-camel-200 rounded-full text-sm font-medium focus:border-camel-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredAnimals.length === 0 ? (
           <div className="col-span-full py-16 text-center text-espresso-400 font-bold bg-white rounded-[2rem] border border-camel-100 shadow-sm">
             No pets match your search criteria. Try adjusting filters or post a pet for adoption!
           </div>
        ) : filteredAnimals.map(animal => {
          const imageSrc = getImageUrl(animal.avatarUrl, '/images/pet-1.jpg');
          const isAdopted = animal.status === 'ADOPTED';
          const adopterName = animal.adopterInfo?.applicantName || animal.adoptedBy?.name || 'Happy Owner';

          return (
            <div 
              key={animal._id} 
              className={`bg-white rounded-[2rem] border border-camel-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col relative ${
                isAdopted ? 'opacity-90 bg-camel-50/30 border-camel-200' : 'hover:border-camel-300'
              }`}
            >
              {/* Photo Container */}
              <div className="aspect-[4/5] relative bg-camel-50 overflow-hidden">
                <img 
                  src={imageSrc} 
                  alt={animal.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isAdopted ? 'grayscale-[20%]' : 'group-hover:scale-105 mix-blend-multiply'
                  }`}
                  onError={(e) => { e.target.src = '/images/pet-1.jpg'; }}
                />

                {/* Status Badges */}
                {isAdopted ? (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 z-10">
                    <CheckCircle2 size={14} /> ADOPTED
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-espresso-900 shadow-sm">
                    {animal.age || 'Young'}
                  </div>
                )}

                {/* Adoption Fee Badge */}
                <div className="absolute bottom-4 left-4 bg-espresso-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1">
                  <DollarSign size={12} className="text-camel-400" />
                  {animal.adoptionFee > 0 ? `$${animal.adoptionFee}` : 'Free Adoption'}
                </div>
              </div>
              
              {/* Pet Info */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-2xl font-black text-espresso-900">{animal.name}</h3>
                </div>
                <p className="text-xs font-bold text-camel-600 uppercase tracking-widest mb-3">
                  {animal.breed || animal.species} &bull; {animal.gender || 'Male'}
                </p>
                
                {/* Pickup Address & Contact */}
                {animal.pickupAddress && (
                  <div className="flex items-center gap-1.5 text-xs text-espresso-600 font-bold mb-3 bg-camel-50 px-3 py-2 rounded-xl">
                    <MapPin size={14} className="text-camel-600 shrink-0" />
                    <span className="truncate">{animal.pickupAddress}</span>
                  </div>
                )}

                <p className="text-sm text-espresso-500 line-clamp-2 mb-4 italic border-l-2 border-camel-200 pl-3">
                  "{animal.behaviorNotes || 'A wonderful companion looking for a loving home.'}"
                </p>
                
                {/* Adopter info banner if adopted */}
                {isAdopted && (
                  <div className="mb-4 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                    <User size={16} className="text-emerald-600 shrink-0" />
                    <span>Adopted by <strong>{adopterName}</strong></span>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-camel-50">
                  {isAdopted ? (
                    <button disabled className="w-full bg-camel-100 text-camel-500 py-3.5 rounded-xl font-bold text-sm tracking-wide flex justify-center items-center gap-2 cursor-not-allowed">
                      <CheckCircle2 size={16} /> Home Found (Adopted)
                    </button>
                  ) : (
                    <button onClick={() => handleAdoptClick(animal)} className="w-full bg-camel-600 hover:bg-camel-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex justify-center items-center gap-2 group-hover:-translate-y-1">
                      <Heart size={16} /> Adopt Me
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* List Pet Modal */}
      <AnimatePresence>
        {isListPetModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsListPetModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#FAF8F5] rounded-[2rem] w-full max-w-xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden max-h-[90vh]">
                 
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                      <h2 className="text-xl font-display font-black text-espresso-900 leading-tight">Upload Pet For Adoption</h2>
                      <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest mt-0.5">List your pet for safe & direct user adoption</p>
                    </div>
                    <button onClick={() => setIsListPetModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 
                 <div className="p-8 overflow-y-auto">
                    {listPetError && (
                      <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                        {listPetError}
                      </div>
                    )}
                    <form onSubmit={handleListPetSubmit} className="space-y-4">
                       
                       {/* Photo Upload */}
                       <div className="flex flex-col items-center justify-center mb-4">
                         <div className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-camel-300 flex items-center justify-center bg-white overflow-hidden group cursor-pointer shadow-sm">
                           {listPetPhotoPreview ? (
                             <img src={listPetPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             <div className="flex flex-col items-center text-camel-400">
                               <Camera size={28} />
                               <span className="text-[10px] font-bold mt-1 uppercase">Pet Photo</span>
                             </div>
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="text-white" size={24} />
                           </div>
                           <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Pet Name *</label>
                           <input type="text" required value={listPetData.name} onChange={e => setListPetData({...listPetData, name: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all font-medium" placeholder="E.g. Milo" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Species *</label>
                           <select value={listPetData.species} onChange={e => setListPetData({...listPetData, species: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all font-medium">
                             <option value="Dog">Dog</option>
                             <option value="Cat">Cat</option>
                             <option value="Bird">Bird</option>
                             <option value="Other">Other</option>
                           </select>
                         </div>
                       </div>

                       <div className="grid grid-cols-3 gap-3">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Breed</label>
                           <input type="text" value={listPetData.breed} onChange={e => setListPetData({...listPetData, breed: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-3.5 py-3 text-sm font-medium" placeholder="Pug / Mixed" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Age</label>
                           <input type="text" value={listPetData.age} onChange={e => setListPetData({...listPetData, age: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-3.5 py-3 text-sm font-medium" placeholder="2 Years" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Gender</label>
                           <select value={listPetData.gender} onChange={e => setListPetData({...listPetData, gender: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-3.5 py-3 text-sm font-medium">
                             <option value="Male">Male</option>
                             <option value="Female">Female</option>
                           </select>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Adoption Fee ($)</label>
                           <input type="number" min="0" value={listPetData.adoptionFee} onChange={e => setListPetData({...listPetData, adoptionFee: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm font-medium" placeholder="0 for Free" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Contact Phone</label>
                           <input type="tel" required value={listPetData.phone} onChange={e => setListPetData({...listPetData, phone: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm font-medium" placeholder="+92 300 1234567" />
                         </div>
                       </div>

                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Pickup City & Address *</label>
                         <input type="text" required value={listPetData.pickupAddress} onChange={e => setListPetData({...listPetData, pickupAddress: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm font-medium" placeholder="House #, Street, City (e.g. Lahore / Karachi)" />
                       </div>

                       <div>
                         <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Description / Notes</label>
                         <textarea rows="3" value={listPetData.behaviorNotes} onChange={e => setListPetData({...listPetData, behaviorNotes: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm font-medium resize-none" placeholder="Friendly with kids, vaccinated, gentle personality..." />
                       </div>

                       <button type="submit" disabled={isSubmittingListPet} className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-2 flex justify-center items-center gap-2">
                         {isSubmittingListPet ? <Loader2 size={16} className="animate-spin" /> : 'Upload & Publish Adoption Listing'}
                       </button>
                    </form>
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Adoption Request & Payment Modal */}
      <AnimatePresence>
        {isAdoptModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsAdoptModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#FAF8F5] rounded-[2rem] w-full max-w-xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden max-h-[90vh]">
                 
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                      <h2 className="text-xl font-display font-black text-espresso-900 leading-tight">Adoption Application & Payment</h2>
                      <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest mt-0.5">Adopting {selectedAnimal?.name}</p>
                    </div>
                    <button onClick={() => setIsAdoptModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 
                 <div className="p-8 overflow-y-auto">
                    {adoptSuccess ? (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-3xl font-display font-black text-espresso-900 mb-2">Adoption Completed!</h3>
                        <p className="text-espresso-600 mb-6 max-w-md mx-auto text-sm font-medium">
                          Congratulations! You have successfully adopted <strong>{selectedAnimal?.name}</strong>.
                        </p>
                        
                        {/* Pickup Receipt Details */}
                        <div className="bg-white border border-camel-200 p-5 rounded-2xl text-left space-y-3 mb-8 shadow-sm">
                          <h4 className="text-xs font-black text-espresso-900 uppercase tracking-widest border-b border-camel-100 pb-2 flex items-center justify-between">
                            <span>Pickup & Receipt Info</span>
                            <span className="text-emerald-600 font-bold">STATUS: PAID</span>
                          </h4>
                          <div className="text-xs space-y-1.5 text-espresso-700">
                            <p><strong>Pickup Address:</strong> {selectedAnimal?.pickupAddress || 'Contact owner'}</p>
                            <p><strong>Owner Phone:</strong> {selectedAnimal?.ownerContact?.phone || 'Contact Support'}</p>
                            <p><strong>Payment Method:</strong> {adoptFormData.paymentMethod}</p>
                            <p><strong>Total Amount:</strong> {selectedAnimal?.adoptionFee > 0 ? `$${selectedAnimal.adoptionFee}` : 'Free'}</p>
                          </div>
                        </div>

                        <button onClick={() => setIsAdoptModalOpen(false)} className="bg-camel-600 hover:bg-camel-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors">Done</button>
                      </div>
                    ) : (
                      <form onSubmit={handleAdoptSubmit} className="space-y-4">
                         
                         {/* Owner Pickup Info Banner */}
                         <div className="bg-white border border-camel-200 p-4 rounded-2xl space-y-2">
                           <div className="flex items-center justify-between text-xs font-black text-espresso-900 uppercase tracking-wider">
                             <span className="flex items-center gap-1.5"><MapPin size={15} className="text-camel-600"/> Pickup Location</span>
                             <span className="text-camel-700 font-extrabold">{selectedAnimal?.adoptionFee > 0 ? `$${selectedAnimal.adoptionFee}` : 'Free Adoption'}</span>
                           </div>
                           <p className="text-xs text-espresso-600 font-bold bg-camel-50 p-2.5 rounded-xl">
                             {selectedAnimal?.pickupAddress || 'Pickup address will be provided upon confirmation'}
                           </p>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Your Full Name</label>
                             <input type="text" required value={adoptFormData.applicantName} onChange={e => setAdoptFormData({...adoptFormData, applicantName: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all font-medium" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Your Phone</label>
                             <input type="tel" required value={adoptFormData.phone} onChange={e => setAdoptFormData({...adoptFormData, phone: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all font-medium" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Your Email</label>
                           <input type="email" required value={adoptFormData.email} onChange={e => setAdoptFormData({...adoptFormData, email: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all font-medium" />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Living Situation</label>
                             <select value={adoptFormData.livingSituation} onChange={e => setAdoptFormData({...adoptFormData, livingSituation: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all font-medium">
                               <option>House with Yard</option>
                               <option>Apartment</option>
                               <option>Townhouse</option>
                               <option>Farm/Acreage</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Payment Method</label>
                             <select value={adoptFormData.paymentMethod} onChange={e => setAdoptFormData({...adoptFormData, paymentMethod: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all font-medium">
                               <option>Cash on Pickup</option>
                               <option>Credit / Debit Card</option>
                               <option>JazzCash / EasyPaisa</option>
                             </select>
                           </div>
                         </div>

                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Message to Owner / Shelter</label>
                           <textarea required rows="3" value={adoptFormData.message} onChange={e => setAdoptFormData({...adoptFormData, message: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all font-medium resize-none" placeholder="Tell us why you'd be a great match..." />
                         </div>

                         <button type="submit" disabled={isSubmittingAdopt} className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-4 flex justify-center items-center gap-2">
                           {isSubmittingAdopt ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Complete Adoption Payment'}
                         </button>
                      </form>
                    )}
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
