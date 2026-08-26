import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ShieldCheck, Truck, ArrowRight, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ShopCatalog() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="w-full font-sans flex flex-col pt-4">
        
      {/* Top Utility Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">
          Pharmacy & Store
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-400" size={16} />
            <input 
              type="text" 
              placeholder="Search medications..." 
              className="pl-10 pr-4 py-2.5 rounded-full border border-camel-200 bg-white text-sm font-medium focus:outline-none focus:border-camel-500 w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md">
             <ShoppingBag size={16} /> Cart (0)
          </button>
        </div>
      </div>

      {/* PHASE 1: Editorial Hero Banner */}
      <motion.div 
        variants={container} initial="hidden" animate="show"
        className="relative w-full h-[400px] rounded-[2.5rem] bg-camel-100 overflow-hidden mb-12 flex items-center shadow-[0_15px_40px_rgba(90,56,37,0.06)] shrink-0"
      >
        {/* Background Image & Gradient */}
        <img 
          src="/images/shop-hero-dog.jpg" 
          alt="Happy Dog" 
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent w-full md:w-3/4"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 px-8 md:px-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 mb-4 shadow-sm">
             <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
             <span className="text-[10px] font-black tracking-widest uppercase text-espresso-900">Spring Allergy Season</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-espresso-900 leading-[1.1] mb-4">
            Complete <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-camel-600 to-espresso-900">Clinical Care.</span>
          </h2>
          <p className="text-sm font-medium text-espresso-600 mb-8 max-w-md">
            Premium veterinary-grade prescriptions, supplements, and specialized diets delivered directly to your door.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-camel-600 hover:bg-camel-500 text-white px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-camel-600/30">
              Shop Essentials <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Floating Spatial Badges (Replacing generic icons) */}
        <motion.div variants={item} className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-3xl shadow-xl flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="text-emerald-600" size={20} />
           </div>
           <div>
              <p className="text-xs font-black uppercase tracking-wider text-espresso-900">Vet Formulated</p>
              <p className="text-[10px] font-bold text-espresso-500">100% Certified</p>
           </div>
        </motion.div>
        
        <motion.div variants={item} className="absolute top-8 right-1/4 hidden md:flex bg-white/80 backdrop-blur-xl border border-white/50 p-3 rounded-2xl shadow-lg items-center gap-3">
           <Truck className="text-camel-600" size={18} />
           <p className="text-xs font-bold text-espresso-900">Same-Day Delivery</p>
        </motion.div>
      </motion.div>

      {/* CORE SHOP ARCHITECTURE (PHASES 2-8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
        
        {/* PHASE 2: Advanced Sidebar (Cols 3) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-8">
          
          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-espresso-900 mb-4 px-2">Categories</h3>
            <ul className="space-y-1">
              {['All Categories', 'Prescriptions', 'Supplements', 'Nutrition', 'Flea & Tick', 'Vitamins', 'Health & Wellness'].map((cat, idx) => (
                <li key={idx}>
                  <button className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${idx === 0 ? 'bg-espresso-900 text-white shadow-md' : 'text-espresso-600 hover:bg-camel-50 hover:text-camel-700'}`}>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Filters */}
          <div>
            <h3 className="font-display font-bold text-espresso-900 mb-4 px-2">Quick Filters</h3>
            <div className="space-y-3 px-2 text-sm font-medium text-espresso-700">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-md border-2 border-camel-200 flex items-center justify-center group-hover:border-camel-400 transition-colors"></div>
                Rx Required Only
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-md border-2 border-camel-400 bg-camel-50 flex items-center justify-center transition-colors">
                   <div className="w-2.5 h-2.5 rounded-sm bg-camel-500"></div>
                </div>
                On Sale
              </label>
            </div>
          </div>

          {/* Need Help CTA Widget */}
          <div className="mt-4 bg-gradient-to-br from-camel-50 to-[#FDFBF7] border border-camel-100 rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(186,127,72,0.05)] relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-camel-200/40 rounded-full blur-2xl"></div>
             <h4 className="font-display font-bold text-lg text-espresso-900 mb-1 relative z-10">Need Help Choosing?</h4>
             <p className="text-xs font-medium text-espresso-500 mb-6 relative z-10">Our vet experts are here for you.</p>
             <button className="bg-white text-espresso-900 border border-camel-100 hover:border-camel-300 w-full py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm relative z-10">
               Chat with Vet
             </button>
          </div>
        </aside>

        {/* PHASE 3: Main Product Grid Area (Cols 9) */}
        <div className="lg:col-span-9 flex flex-col gap-10">
           
           {/* PHASE 6 & 7: Cinematic Active Delivery Tracker */}
             <motion.div 
               initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
               className="bg-espresso-900 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_40px_rgba(90,56,37,0.15)] text-white flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden"
             >
               {/* Ambient Background Glow */}
               <div className="absolute top-0 right-0 w-72 h-72 bg-camel-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none animate-pulse"></div>

               {/* Glassmorphic Icon */}
               <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                     <Truck className="text-camel-400" size={28} />
                  </div>
               </div>

               {/* Tracker Content */}
               <div className="flex-1 w-full relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
                     <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <p className="text-camel-400 text-[10px] font-black uppercase tracking-widest">Active Delivery • Order #FS-8921</p>
                        </div>
                        <h4 className="font-display font-bold text-2xl md:text-3xl leading-tight">Arriving Today by 8:00 PM</h4>
                        <p className="text-white/60 text-xs font-medium mt-1">Flea & Tick Prevention (3-Month) + 1 more item</p>
                     </div>
                     <button className="w-full md:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-2">
                        Track Package <ArrowRight size={14} />
                     </button>
                  </div>

                  {/* Custom Progress Bar */}
                  <div className="mt-6 relative">
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-3/4 rounded-full relative">
                           <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                     </div>
                     <div className="flex justify-between mt-3 text-[9px] font-bold uppercase tracking-wider text-white/50">
                        <span className="text-emerald-400">Processed</span>
                        <span className="text-emerald-400 hidden sm:inline">Shipped</span>
                        <span className="text-white">Out for Delivery</span>
                        <span>Delivered</span>
                     </div>
                  </div>
               </div>
             </motion.div>

             {/* Buy It Again Bento Row */}
           <div>
              <div className="flex justify-between items-end mb-4 px-2">
                <h3 className="font-display font-bold text-xl text-espresso-900">Buy It Again</h3>
                <button className="text-xs font-bold text-camel-600 hover:text-camel-800 flex items-center gap-1 transition-colors">
                  View All History <ArrowRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { name: 'Hypoallergenic Salmon', date: 'Delivered 2 days ago', img: '/images/product-meds.jpg' },
                   { name: 'Joint Support Chews', date: 'Delivered 2 weeks ago', img: '/images/product-supplement.jpg' }
                 ].map((item, idx) => (
                   <div key={idx} className="bg-white p-3 rounded-2xl border border-camel-100 shadow-sm flex items-center gap-3 hover:border-camel-300 hover:shadow-md transition-all cursor-pointer group">
                     <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-camel-50" />
                     <div className="flex-1 overflow-hidden">
                       <h4 className="font-bold text-espresso-900 text-xs truncate">{item.name}</h4>
                       <p className="text-[9px] font-medium text-espresso-400 mt-0.5">{item.date}</p>
                     </div>
                     <button className="w-6 h-6 rounded-full bg-camel-50 flex items-center justify-center text-camel-600 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Plus size={12} />
                     </button>
                   </div>
                 ))}
              </div>
           </div>

           {/* Main Product Grid */}
           <div>
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-display font-bold text-xl text-espresso-900">Top Picks for Your Pets</h3>
                <div className="bg-white border border-camel-100 px-4 py-2 rounded-full text-xs font-bold text-espresso-600 flex items-center gap-2 cursor-pointer shadow-sm">
                  Sort by: Popular <ArrowRight size={12} className="rotate-90" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Product Card 1 */}
                 <div className="bg-white rounded-[2rem] p-4 border border-transparent hover:border-camel-200 shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.1)] transition-all duration-300 group cursor-pointer flex flex-col">
                   <div className="relative w-full h-48 rounded-3xl overflow-hidden bg-camel-50 mb-4">
                     <img src="/images/product-supplement.jpg" alt="Joint Support" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                     <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Best Seller</div>
                   </div>
                   <div className="flex-1 flex flex-col px-2 pb-2">
                     <p className="text-[9px] font-bold text-espresso-400 uppercase tracking-widest mb-1">FurShield Lab</p>
                     <h4 className="font-display font-bold text-espresso-900 leading-tight mb-2">Advanced Joint Support</h4>
                     <div className="flex items-center gap-1 mb-4">
                        <span className="flex text-accent-500 text-xs">★★★★★</span>
                        <span className="text-[10px] font-bold text-espresso-400">(124)</span>
                     </div>
                     <div className="mt-auto flex justify-between items-end">
                       <span className="font-black text-espresso-900 text-lg">$45.00</span>
                       <button className="w-10 h-10 rounded-full border border-camel-200 flex items-center justify-center text-camel-600 group-hover:bg-camel-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                         <Plus size={18} />
                       </button>
                     </div>
                   </div>
                 </div>

                 {/* Product Card 2 (Rx Required) */}
                 <div className="bg-white rounded-[2rem] p-4 border border-transparent hover:border-camel-200 shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.1)] transition-all duration-300 group cursor-pointer flex flex-col">
                   <div className="relative w-full h-48 rounded-3xl overflow-hidden bg-camel-50 mb-4">
                     <img src="/images/product-meds.jpg" alt="Heartworm" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                     <div className="absolute top-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Rx Required</div>
                   </div>
                   <div className="flex-1 flex flex-col px-2 pb-2">
                     <p className="text-[9px] font-bold text-espresso-400 uppercase tracking-widest mb-1">HeartSafe</p>
                     <h4 className="font-display font-bold text-espresso-900 leading-tight mb-2">Heartworm Medication (3-Month)</h4>
                     <div className="flex items-center gap-1 mb-4">
                        <span className="flex text-accent-500 text-xs">★★★★☆</span>
                        <span className="text-[10px] font-bold text-espresso-400">(56)</span>
                     </div>
                     <div className="mt-auto flex justify-between items-end">
                       <span className="font-black text-espresso-900 text-lg">$110.00</span>
                       <button className="w-10 h-10 rounded-full border border-camel-200 flex items-center justify-center text-camel-600 group-hover:bg-camel-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                         <Plus size={18} />
                       </button>
                     </div>
                   </div>
                 </div>
                 
                 {/* Product Card 3 */}
                 <div className="bg-white rounded-[2rem] p-4 border border-transparent hover:border-camel-200 shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.1)] transition-all duration-300 group cursor-pointer flex flex-col">
                   <div className="relative w-full h-48 rounded-3xl overflow-hidden bg-camel-50 mb-4 flex items-center justify-center">
                     <span className="text-xs font-bold text-camel-400 uppercase tracking-widest">[ Img Pending ]</span>
                     <div className="absolute top-3 left-3 bg-camel-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Nutrition</div>
                   </div>
                   <div className="flex-1 flex flex-col px-2 pb-2">
                     <p className="text-[9px] font-bold text-espresso-400 uppercase tracking-widest mb-1">NatureVet</p>
                     <h4 className="font-display font-bold text-espresso-900 leading-tight mb-2">Hypoallergenic Salmon Diet</h4>
                     <div className="flex items-center gap-1 mb-4">
                        <span className="flex text-accent-500 text-xs">★★★★★</span>
                        <span className="text-[10px] font-bold text-espresso-400">(89)</span>
                     </div>
                     <div className="mt-auto flex justify-between items-end">
                       <span className="font-black text-espresso-900 text-lg">$65.50</span>
                       <button className="w-10 h-10 rounded-full border border-camel-200 flex items-center justify-center text-camel-600 group-hover:bg-camel-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                         <Plus size={18} />
                       </button>
                     </div>
                   </div>
                 </div>

              </div>
           </div>
           
           {/* Free Shipping Banner */}
           <div className="w-full bg-white border border-camel-100 rounded-3xl p-6 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-camel-50 flex items-center justify-center">
                 <Truck className="text-camel-600" size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-espresso-900 text-sm">Free Shipping on Orders $49+</h4>
                 <p className="text-xs font-medium text-espresso-500 mt-0.5">Fast, reliable delivery straight to your door.</p>
               </div>
             </div>
             <button className="text-xs font-bold text-camel-600 hover:text-camel-800 flex items-center gap-1 transition-colors">
               Learn More <ArrowRight size={12} />
             </button>
           </div>

        </div>

      </div>

    </div>
  );
}


