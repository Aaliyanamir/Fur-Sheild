import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, ShieldCheck, Truck, ArrowRight, Plus, Minus, X, Package, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import CustomSelect from '../components/molecules/CustomSelect';

export default function ShopCatalog() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedVerificationPet, setSelectedVerificationPet] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Phase 8: Auto-Ship & Promo State
  const [isAutoShip, setIsAutoShip] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Advanced Cart Logic
  const addToCart = (product, quantity = 1, autoShip = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.isAutoShip === autoShip);
      if (existing) {
        return prev.map(item => item.id === product.id && item.isAutoShip === autoShip
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { ...product, quantity, isAutoShip: autoShip }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id, autoShip, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.isAutoShip === autoShip) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Cart Math
  const cartSubtotal = cart.reduce((total, item) => {
    const itemPrice = item.isAutoShip ? item.price * 0.9 : item.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  
  const discountAmount = isPromoApplied ? cartSubtotal * 0.15 : 0; // Mock 15% promo
  const cartTotal = cartSubtotal - discountAmount;
  
  const FREE_SHIPPING_THRESHOLD = 49.00;
  const shippingProgress = Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const product1 = { id: 1, name: 'Advanced Joint Support', price: 45.00, image: '/images/product-supplement.jpg', rxRequired: false, category: 'Supplements' };
  const product2 = { id: 2, name: 'Heartworm Medication (3-Month)', price: 110.00, image: '/images/product-meds.jpg', rxRequired: true, category: 'Prescriptions' };
  const product3 = { id: 3, name: 'Hypoallergenic Salmon Diet', price: 65.50, image: '', rxRequired: false, category: 'Nutrition' };

  return (
    <div className="w-full font-sans flex flex-col pt-4 overflow-x-hidden">
        
      {/* Top Utility Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
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
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-espresso-900 hover:bg-espresso-800 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md"
          >
             <ShoppingBag size={16} /> Cart ({cart.reduce((acc, curr) => acc + curr.quantity, 0)})
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

        {/* Floating Spatial Badges */}
        <motion.div variants={itemAnim} className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-3xl shadow-xl flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="text-emerald-600" size={20} />
           </div>
           <div>
              <p className="text-xs font-black uppercase tracking-wider text-espresso-900">Vet Formulated</p>
              <p className="text-[10px] font-bold text-espresso-500">100% Certified</p>
           </div>
        </motion.div>
        
        <motion.div variants={itemAnim} className="absolute top-8 right-1/4 hidden md:flex bg-white/80 backdrop-blur-xl border border-white/50 p-3 rounded-2xl shadow-lg items-center gap-3">
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
                 <motion.div 
                   onClick={() => { setSelectedProduct(product1); setIsAutoShip(false); }}
                   className="bg-white rounded-[2rem] p-4 border border-transparent hover:border-camel-200 shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.1)] transition-all duration-300 group cursor-pointer flex flex-col"
                 >
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
                       <button onClick={(e) => { e.stopPropagation(); addToCart(product1, 1, false); }} className="w-10 h-10 rounded-full border border-camel-200 flex items-center justify-center text-camel-600 group-hover:bg-camel-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                         <Plus size={18} />
                       </button>
                     </div>
                   </div>
                 </motion.div>

                 {/* Product Card 2 (Rx Required) */}
                 <motion.div 
                   onClick={() => { setSelectedProduct(product2); setIsAutoShip(false); }}
                   className="bg-white rounded-[2rem] p-4 border border-transparent hover:border-camel-200 shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.1)] transition-all duration-300 group cursor-pointer flex flex-col"
                 >
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
                       <button onClick={(e) => { e.stopPropagation(); addToCart(product2, 1, false); }} className="w-10 h-10 rounded-full border border-camel-200 flex items-center justify-center text-camel-600 group-hover:bg-camel-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                         <Plus size={18} />
                       </button>
                     </div>
                   </div>
                 </motion.div>
                 
                 {/* Product Card 3 */}
                 <motion.div 
                   onClick={() => { setSelectedProduct(product3); setIsAutoShip(false); }}
                   className="bg-white rounded-[2rem] p-4 border border-transparent hover:border-camel-200 shadow-[0_4px_20px_rgba(90,56,37,0.03)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.1)] transition-all duration-300 group cursor-pointer flex flex-col"
                 >
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
                       <button onClick={(e) => { e.stopPropagation(); addToCart(product3, 1, false); }} className="w-10 h-10 rounded-full border border-camel-200 flex items-center justify-center text-camel-600 group-hover:bg-camel-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                         <Plus size={18} />
                       </button>
                     </div>
                   </div>
                 </motion.div>

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

      {/* PHASE 4 & 5: Quick-View Modal & Rx Verification */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-espresso-900/70 backdrop-blur-md"
            ></motion.div>

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(90,56,37,0.2)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-camel-600 hover:bg-white z-10 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Left: Product Image */}
              <div className="w-full md:w-2/5 bg-camel-50 relative flex items-center justify-center min-h-[300px] md:min-h-full">
                {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover mix-blend-multiply absolute inset-0" />
                ) : (
                    <span className="text-xs font-bold text-camel-400 uppercase tracking-widest">[ Img Pending ]</span>
                )}
                {selectedProduct.rxRequired && (
                   <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-camel-100">
                     <ShieldCheck size={16} className="text-accent-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-espresso-900">Rx Required</span>
                   </div>
                )}
              </div>

              {/* Right: Details & Rx Flow */}
              <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto pb-40">
                <p className="text-xs font-bold text-espresso-400 uppercase tracking-widest mb-2">{selectedProduct.category}</p>
                <h2 className="text-3xl font-display font-black text-espresso-900 leading-tight mb-4">{selectedProduct.name}</h2>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-camel-100/50">
                  <span className="font-black text-camel-600 text-3xl">${selectedProduct.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1 bg-camel-50 px-3 py-1.5 rounded-full border border-camel-100">
                     <span className="flex text-accent-500 text-sm">★★★★★</span>
                     <span className="text-xs font-bold text-espresso-600 ml-1">4.9</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-espresso-600 leading-relaxed mb-6">
                  Premium, veterinary-formulated {selectedProduct.category.toLowerCase()} designed for optimal absorption and efficacy. Clinically tested to ensure the highest safety standards for your companion.
                </p>

                {/* Auto-Ship Toggle */}
                <div 
                  onClick={() => setIsAutoShip(!isAutoShip)}
                  className={cn("p-4 rounded-2xl border-2 transition-all cursor-pointer mb-8 relative overflow-hidden", isAutoShip ? "border-accent-500 bg-accent-50/30" : "border-camel-100 bg-white hover:border-camel-300")}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors", isAutoShip ? "border-accent-500" : "border-camel-300")}>
                      {isAutoShip && <motion.div layoutId="autoship-dot" className="w-2.5 h-2.5 rounded-full bg-accent-500" />}
                    </div>
                    <div>
                      <p className="font-bold text-espresso-900 text-sm">Subscribe & Save 10%</p>
                      <p className="text-xs font-medium text-espresso-500">Auto-deliver every 4 weeks. Cancel anytime.</p>
                    </div>
                  </div>
                </div>

                {/* PHASE 5: Rx Verification Block (Conditional) */}
                {selectedProduct.rxRequired ? (
                  <div className="bg-accent-50 border border-accent-200 rounded-2xl p-5 mb-8 relative">
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-accent-200/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    </div>
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 border border-accent-200">
                        <ShieldCheck className="text-accent-600" size={20} />
                      </div>
                      <div className="flex-1 w-full">
                        <h4 className="font-bold text-accent-900 text-sm mb-1">Prescription Verification Required</h4>
                        <p className="text-xs font-medium text-accent-700/80 mb-4">
                          This item requires an active prescription from your VetHub records.
                        </p>
                        <div className="mb-4 w-full">
                          <CustomSelect 
                            options={['Buddy (Golden Retriever)', 'Luna (Maine Coon)']}
                            value={selectedVerificationPet}
                            onChange={setSelectedVerificationPet}
                            placeholder="Select Pet..."
                            className="!bg-white" 
                          />
                        </div>
                        <button 
                          onClick={() => { 
                            addToCart(selectedProduct, 1, isAutoShip); 
                            setSelectedProduct(null); 
                            setSelectedVerificationPet(''); 
                          }}
                          disabled={!selectedVerificationPet}
                          className="w-full bg-camel-600 hover:bg-camel-500 disabled:opacity-50 disabled:hover:bg-camel-600 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md shadow-camel-900/10"
                        >
                          Verify & Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 mb-8">
                    <div className="flex items-center bg-bg-secondary border border-camel-200 rounded-2xl p-1">
                      <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-espresso-500 hover:text-espresso-900 shadow-sm"><Minus size={16}/></button>
                      <span className="w-12 text-center font-bold text-espresso-900">1</span>
                      <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-espresso-500 hover:text-espresso-900 shadow-sm"><Plus size={16}/></button>
                    </div>
                    <button 
                      onClick={() => { addToCart(selectedProduct, 1, isAutoShip); setSelectedProduct(null); }}
                      className="flex-1 bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md shadow-espresso-900/20"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
                
                <div className="text-xs font-bold text-espresso-400 flex items-center justify-center gap-2">
                  <ShieldCheck size={14} /> 100% Secure Checkout via FurShield
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PHASE 8: INTELLIGENT CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-[150]"
            />
            
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[160] shadow-2xl flex flex-col border-l border-camel-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-camel-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={24} className="text-espresso-900" />
                  <h2 className="text-2xl font-display font-black text-espresso-900">Your Cart</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-camel-50 flex items-center justify-center text-espresso-400 hover:bg-camel-100 hover:text-espresso-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Dynamic Free Shipping Progress */}
              <div className="p-6 bg-bg-secondary shrink-0 border-b border-camel-100">
                <div className="flex justify-between items-end mb-2">
                  <span className={cn("text-xs font-bold uppercase tracking-widest", shippingProgress >= 100 ? "text-emerald-600" : "text-espresso-600")}>
                    {shippingProgress >= 100 ? "You've unlocked Free Shipping!" : `Add $${(FREE_SHIPPING_THRESHOLD - cartSubtotal).toFixed(2)} for Free Shipping`}
                  </span>
                  <Package size={16} className={shippingProgress >= 100 ? "text-emerald-500" : "text-camel-400"} />
                </div>
                <div className="w-full h-2 bg-camel-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${shippingProgress}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
                    className={cn("h-full rounded-full transition-colors", shippingProgress >= 100 ? "bg-emerald-500" : "bg-camel-500")}
                  />
                </div>
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide bg-[#FDFBF7]">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-espresso-400">
                    <ShoppingBag size={64} className="mb-6 opacity-10" />
                    <p className="font-display font-bold text-2xl text-espresso-900 mb-2">Cart is empty</p>
                    <p className="text-sm font-medium text-center">Looks like you haven't added any premium care products yet.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map((item) => {
                      const itemPrice = item.isAutoShip ? item.price * 0.9 : item.price;
                      return (
                        <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, height: 0 }} key={`${item.id}-${item.isAutoShip}`} className="flex gap-4 items-start bg-white p-4 rounded-3xl border border-camel-100 shadow-sm relative group">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-camel-50" />
                          <div className="flex-1 pr-6">
                            <h4 className="font-bold text-espresso-900 text-sm leading-tight mb-1">{item.name}</h4>
                            {item.isAutoShip && <p className="text-[10px] font-bold text-accent-600 uppercase tracking-widest mb-2 flex items-center gap-1"><RotateCcw size={10} /> Auto-Ship (-10%)</p>}
                            <span className="font-black text-espresso-900">${itemPrice.toFixed(2)}</span>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-3 w-max bg-bg-secondary p-1 rounded-full border border-camel-100">
                              <button onClick={() => updateCartQty(item.id, item.isAutoShip, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white shadow-sm text-espresso-600 transition-colors"><Minus size={12} /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateCartQty(item.id, item.isAutoShip, 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white shadow-sm text-espresso-600 transition-colors"><Plus size={12} /></button>
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button onClick={() => updateCartQty(item.id, item.isAutoShip, -item.quantity)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-camel-50 flex items-center justify-center text-espresso-400 hover:text-accent-500 hover:bg-accent-50 transition-colors">
                            <X size={14} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
              
              {/* Promo Code Engine */}
              <div className="p-6 bg-bg-secondary border-t border-camel-100">
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Promo Code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white border border-camel-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-camel-400"
                    />
                    <button 
                      onClick={() => promoCode && setIsPromoApplied(true)}
                      className="bg-espresso-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-espresso-800 transition-colors"
                    >
                      Apply
                    </button>
                 </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-camel-100 bg-white shrink-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-espresso-500 text-sm">Subtotal</span>
                  <span className="font-bold text-espresso-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-emerald-500 text-sm">Promo (15%)</span>
                    <span className="font-bold text-emerald-500">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-camel-100">
                  <span className="font-bold text-espresso-500 text-sm">Shipping</span>
                  <span className="font-bold text-emerald-500 text-sm">{shippingProgress >= 100 ? 'Free' : 'Calculated at checkout'}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-50 text-white py-4.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-xl flex justify-center items-center gap-2 h-14"
                >
                  Checkout <span className="font-black">${cartTotal.toFixed(2)}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
