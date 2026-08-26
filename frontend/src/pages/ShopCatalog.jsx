import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
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

      {/* STRUCTURAL SKELETON FOR PHASES 2-8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
        
        {/* Phase 2: Advanced Sidebar Placeholder (Cols 3) */}
        <div className="hidden lg:block lg:col-span-3">
           <div className="w-full h-[600px] border-2 border-dashed border-camel-200 rounded-[2rem] flex items-center justify-center bg-camel-50/30">
             <span className="text-xs font-bold text-camel-400 uppercase tracking-widest text-center px-4">[ Phase 2: Filters & Sidebar ]</span>
           </div>
        </div>

        {/* Phase 3, 6, 7: Core Content Area (Cols 9) */}
        <div className="lg:col-span-9 flex flex-col gap-10">
           
           {/* Phase 7 Placeholder: Order History & Tracking */}
           <div className="w-full h-[150px] border-2 border-dashed border-emerald-200 rounded-[2rem] flex items-center justify-center bg-emerald-50/30">
             <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest text-center px-4">[ Phase 7 & 8: Active Delivery & History ]</span>
           </div>

           {/* Phase 3 Placeholder: Product Grid */}
           <div className="w-full h-[800px] border-2 border-dashed border-camel-200 rounded-[2rem] flex items-center justify-center bg-camel-50/30">
             <span className="text-xs font-bold text-camel-400 uppercase tracking-widest text-center px-4">[ Phase 3: Premium Product Grid ]</span>
           </div>
        </div>

      </div>

    </div>
  );
}
