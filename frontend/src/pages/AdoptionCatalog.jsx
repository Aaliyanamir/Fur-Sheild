import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, MapPin, CheckCircle2, ChevronRight, X, Loader2 } from 'lucide-react';
import adoptService from '../services/adopt.service';

export default function AdoptionCatalog() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  
  const [formData, setFormData] = useState({ applicantName: '', email: '', phone: '', livingSituation: 'House with Yard', experience: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await adoptService.getAdoptableAnimals();
        if (res.success) {
          // Show only adoptable
          setAnimals(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  const handleAdoptClick = (animal) => {
    setSelectedAnimal(animal);
    setSuccess(false);
    setFormData({ applicantName: '', email: '', phone: '', livingSituation: 'House with Yard', experience: '', message: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await adoptService.submitAdoptionRequest({ ...formData, animalId: selectedAnimal._id });
      if (res.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camel-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full py-12 px-4 font-sans">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-black text-espresso-900 tracking-tight mb-4">Meet Your New Best Friend</h1>
        <p className="text-espresso-500 font-medium max-w-xl mx-auto">Browse our adorable rescues looking for their forever homes. Every adoption saves a life and completes a family.</p>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {animals.length === 0 ? (
           <div className="col-span-full py-16 text-center text-espresso-400 font-bold bg-white rounded-[2rem] border border-camel-100 shadow-sm">
             No animals are currently marked as adoptable. Please check back soon!
           </div>
        ) : animals.map(animal => (
          <div key={animal._id} className="bg-white rounded-[2rem] border border-camel-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-camel-300 transition-all group flex flex-col">
            <div className="aspect-[4/5] relative bg-camel-50 overflow-hidden">
              <img src={animal.avatarUrl ? (animal.avatarUrl.startsWith('http') ? animal.avatarUrl : `http://localhost:5000\${animal.avatarUrl}`) : '/images/product-placeholder.jpg'} alt={animal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-espresso-900 shadow-sm">
                {animal.age || 'Adult'}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-2xl font-black text-espresso-900">{animal.name}</h3>
              </div>
              <p className="text-xs font-bold text-camel-600 uppercase tracking-widest mb-4">{animal.breed || animal.species}</p>
              
              <p className="text-sm text-espresso-500 line-clamp-2 mb-6 italic border-l-2 border-camel-200 pl-3">
                "{animal.behaviorNotes || 'A wonderful companion looking for love.'}"
              </p>
              
              <div className="mt-auto pt-4 border-t border-camel-50">
                <button onClick={() => handleAdoptClick(animal)} className="w-full bg-camel-600 hover:bg-camel-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex justify-center items-center gap-2 group-hover:-translate-y-1">
                  <Heart size={16} /> Adopt Me
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adoption Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setIsModalOpen(false)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#FAF8F5] rounded-[2rem] w-full max-w-xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden max-h-[90vh]">
                 
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                      <h2 className="text-xl font-display font-black text-espresso-900 leading-tight">Adoption Application</h2>
                      <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest mt-0.5">Interested in {selectedAnimal?.name}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 
                 <div className="p-8 overflow-y-auto">
                    {success ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-3xl font-display font-black text-espresso-900 mb-4">Application Sent!</h3>
                        <p className="text-espresso-500 mb-8 max-w-sm mx-auto">Thank you for your interest in {selectedAnimal?.name}. Our shelter team will review your application and contact you shortly.</p>
                        <button onClick={() => setIsModalOpen(false)} className="bg-camel-600 hover:bg-camel-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors">Close</button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Full Name</label>
                             <input type="text" required value={formData.applicantName} onChange={e => setFormData({...formData, applicantName: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Phone</label>
                             <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Email</label>
                           <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Living Situation</label>
                             <select value={formData.livingSituation} onChange={e => setFormData({...formData, livingSituation: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all appearance-none">
                               <option>House with Yard</option>
                               <option>Apartment</option>
                               <option>Townhouse</option>
                               <option>Farm/Acreage</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Pet Experience</label>
                             <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all appearance-none">
                               <option>First-time owner</option>
                               <option>Have had pets before</option>
                               <option>Currently have pets</option>
                               <option>Experienced rescue/trainer</option>
                             </select>
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Message to Shelter</label>
                           <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all resize-none" placeholder="Tell us why you'd be a great match..." />
                         </div>
                         <button type="submit" disabled={isSubmitting} className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-4 flex justify-center items-center gap-2">
                           {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Application'}
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
