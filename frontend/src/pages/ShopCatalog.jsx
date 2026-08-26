import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, X, Plus, Minus, ShieldCheck, 
  Star, Clock, ChevronRight, CheckCircle, Package, 
  ArrowRight, Heart, HeartHandshake, ChevronDown, Percent, Info, RotateCcw
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- MOCK DATA ---
const pastPurchases = [
  { id: 101, name: 'Hypoallergenic Salmon Diet', date: '2 weeks ago', image: '/images/shop-diet.jpg', status: 'Delivered' },
  { id: 102, name: 'Flea & Tick Prevention', date: '1 month ago', image: '/images/shop-flea.jpg', status: 'Active Subscription' },
];

const products = [
  { 
    id: 1, 
    name: 'Advanced Joint Support', 
    brand: 'FurShield Lab',
    category: 'Supplements', 
    price: 45.00, 
    rxRequired: false, 
    rating: 4.8,
    reviews: 124,
    stock: 15,
    image: '/images/shop-supplements.jpg',
    description: 'Clinically proven joint support chew for senior dogs to improve mobility.',
    ingredients: 'Glucosamine, Chondroitin, MSM, Omega-3'
  },
  { 
    id: 2, 
    name: 'Flea & Tick Prevention (3-Month)', 
    brand: 'PetGuard',
    category: 'Prescriptions', 
    price: 85.00, 
    rxRequired: true, 
    rating: 4.9,
    reviews: 342,
    stock: 2,
    image: '/images/shop-flea.jpg',
    description: 'Fast-acting, long-lasting topical treatment for complete parasite protection.',
    ingredients: 'Fipronil, (S)-methoprene'
  },
  { 
    id: 3, 
    name: 'Hypoallergenic Salmon Diet', 
    brand: 'NatureVet',
    category: 'Nutrition', 
    price: 65.50, 
    rxRequired: false, 
    rating: 4.7,
    reviews: 89,
    stock: 40,
    image: '/images/shop-diet.jpg',
    description: 'Premium limited ingredient diet for dogs with food sensitivities.',
    ingredients: 'Salmon, Sweet Potato, Canola Oil'
  },
  { 
    id: 4, 
    name: 'Anxiety Calming Chews', 
    brand: 'FurShield Lab',
    category: 'Supplements', 
    price: 32.00, 
    rxRequired: false, 
    rating: 4.5,
    reviews: 210,
    stock: 8,
    image: '/images/shop-chews.jpg',
    description: 'Natural calming support for thunderstorms, fireworks, and separation anxiety.',
    ingredients: 'L-Theanine, Chamomile, Melatonin'
  },
  { 
    id: 5, 
    name: 'Heartworm Medication', 
    brand: 'HeartSafe',
    category: 'Prescriptions', 
    price: 110.00, 
    rxRequired: true, 
    rating: 5.0,
    reviews: 56,
    stock: 25,
    image: '/images/shop-heartworm.jpg',
    description: 'Monthly chewable tablet to prevent heartworm disease and treat intestinal parasites.',
    ingredients: 'Ivermectin, Pyrantel'
  },
  { 
    id: 6, 
    name: 'Puppy Growth Formula', 
    brand: 'NatureVet',
    category: 'Nutrition', 
    price: 55.00, 
    rxRequired: false, 
    rating: 4.6,
    reviews: 140,
    stock: 0,
    image: '/images/shop-puppy.jpg',
    description: 'High-protein kibble specially formulated for growing puppies.',
    ingredients: 'Chicken, Rice, DHA from Fish Oil'
  },
];

export default function ShopCatalog() {
  // State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Filters State
  const [activeCategory, setActiveCategory] = useState('All');
  const [rxFilter, setRxFilter] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // For quick view
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Derived
  const filteredProducts = products.filter(p => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (rxFilter && !p.rxRequired) return false;
    return true;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const FREE_SHIPPING_THRESHOLD = 150;
  const shippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Actions
  const addToCart = (product, quantity = 1, isSub = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.isSub === isSub);
      if (existing) {
        return prev.map(item => item.id === product.id && item.isSub === isSub
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { ...product, quantity, isSub }];
    });
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const updateCartQty = (id, isSub, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.isSub === isSub) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Animations
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const springTransition = { type: 'spring', damping: 25, stiffness: 200, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="w-full font-sans flex flex-col pt-4 overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO BANNER */}
      <div className="relative w-full h-[400px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl group flex-shrink-0">
        <img src="/images/shop-hero.jpg" alt="Pharmacy Hero" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-900/90 via-espresso-900/60 to-transparent backdrop-blur-[2px]"></div>
        
        <div className="absolute inset-0 p-12 md:p-16 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xs uppercase tracking-[0.25em] mb-4 border border-accent-500/30 backdrop-blur-md">Spring Allergy Season</span>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.1] tracking-tight mb-6">
              Complete <br/>Clinical Care.
            </h1>
            <p className="text-lg text-white/80 font-medium mb-8 max-w-lg leading-relaxed">
              Premium veterinary-grade prescriptions, supplements, and specialized diets delivered directly to your door.
            </p>
            <button className="bg-camel-500 hover:bg-camel-400 text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(186,127,72,0.4)] flex items-center gap-3 group/btn">
              Shop Essentials <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* 2. "BUY IT AGAIN" / ORDER HISTORY CAROUSEL */}
      <div className="mb-12 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-black text-espresso-900">Buy It Again</h2>
          <button className="text-sm font-bold text-camel-600 hover:text-camel-700 flex items-center gap-1">
            View All History <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {pastPurchases.map(purchase => (
            <div key={purchase.id} className="min-w-[300px] bg-white rounded-[2rem] p-4 border border-camel-100 shadow-sm flex gap-4 items-center group cursor-pointer hover:border-camel-300 transition-colors">
              <img src={purchase.image} alt={purchase.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-espresso-900 text-sm leading-tight">{purchase.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-espresso-400 uppercase">{purchase.date}</span>
                  <span className="w-1 h-1 rounded-full bg-camel-200"></span>
                  <span className={cn("text-[10px] font-bold uppercase", purchase.status === 'Active Subscription' ? 'text-accent-600' : 'text-emerald-600')}>
                    {purchase.status}
                  </span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-espresso-600 group-hover:bg-camel-600 group-hover:text-white transition-colors">
                <RotateCcw size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. DEEP E-COMMERCE LAYOUT (Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start pb-20">
        
        {/* Left Sidebar (Filters) */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-8 sticky top-32">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-400" size={16} />
            <input 
              type="text" 
              placeholder="Search pharmacy..." 
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-camel-100 bg-white text-sm font-medium focus:outline-none focus:border-camel-400 shadow-sm"
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-espresso-400 mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              {['All', 'Prescriptions', 'Supplements', 'Nutrition'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all",
                    activeCategory === cat ? "bg-espresso-900 text-white shadow-md" : "text-espresso-600 hover:bg-camel-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-espresso-400 mb-4">Quick Filters</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", rxFilter ? "bg-accent-500 border-accent-500 text-white" : "border-camel-200 bg-white group-hover:border-camel-400")}>
                {rxFilter && <CheckCircle size={14} />}
              </div>
              <span className="text-sm font-bold text-espresso-800">Rx Required Only</span>
              <input type="checkbox" className="hidden" checked={rxFilter} onChange={(e) => setRxFilter(e.target.checked)} />
            </label>
          </div>
        </div>

        {/* Right Product Grid */}
        <motion.div variants={container} initial="hidden" animate="show" className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <motion.div layout variants={itemAnim} key={product.id} className="bg-white rounded-[2rem] p-5 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)] group hover:shadow-xl hover:border-camel-300 transition-all duration-500 flex flex-col justify-between">
                <div>
                  {/* Image Box */}
                  <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-bg-secondary mb-5 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    
                    {/* Top Left Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.rxRequired && (
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
                          <ShieldCheck size={12} className="text-accent-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-espresso-900">Rx</span>
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="bg-red-500/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                        className="w-full bg-white/95 backdrop-blur-md hover:bg-espresso-900 hover:text-white text-espresso-900 py-3 rounded-2xl font-bold text-sm shadow-lg transition-colors"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="px-1">
                    <p className="text-[10px] font-black text-espresso-400 uppercase tracking-widest mb-1">{product.brand}</p>
                    <h3 className="font-display font-bold text-lg text-espresso-900 leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-camel-600 transition-colors" onClick={() => setQuickViewProduct(product)}>{product.name}</h3>
                    
                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-amber-400">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" className="opacity-40" />
                      </div>
                      <span className="text-xs font-bold text-espresso-400">({product.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="px-1 pt-4 border-t border-camel-100 flex items-center justify-between mt-4">
                  <span className="font-black text-espresso-900 text-xl">${product.price.toFixed(2)}</span>
                  <button 
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product)}
                    className="w-12 h-12 rounded-full bg-camel-50 flex items-center justify-center text-camel-600 hover:bg-camel-600 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-camel-50 disabled:hover:text-camel-600"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 4. MASSIVE QUICK-VIEW MODAL */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-espresso-900/60 backdrop-blur-md"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={springTransition}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            >
              {/* Close Button */}
              <button onClick={() => setQuickViewProduct(null)} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-camel-100 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors">
                <X size={20} />
              </button>

              {/* Left Image Gallery */}
              <div className="w-full md:w-1/2 bg-bg-secondary relative h-[300px] md:h-auto">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                {quickViewProduct.rxRequired && (
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <ShieldCheck size={16} className="text-accent-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-espresso-900">Prescription Required</span>
                  </div>
                )}
              </div>

              {/* Right Content */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto scrollbar-hide flex flex-col">
                <p className="text-[10px] font-black text-camel-600 uppercase tracking-widest mb-2">{quickViewProduct.brand}</p>
                <h2 className="text-3xl font-display font-black text-espresso-900 leading-tight mb-4">{quickViewProduct.name}</h2>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-3xl font-black text-espresso-900">${quickViewProduct.price.toFixed(2)}</span>
                  <div className="h-6 w-px bg-camel-200"></div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-bold text-espresso-900 ml-1">{quickViewProduct.rating}</span>
                    <span className="text-xs text-espresso-400 underline cursor-pointer ml-1">({quickViewProduct.reviews} reviews)</span>
                  </div>
                </div>

                <p className="text-espresso-600 font-medium text-sm leading-relaxed mb-8">
                  {quickViewProduct.description}
                </p>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-camel-100 mb-6">
                  <button onClick={() => setActiveTab('details')} className={cn("pb-3 text-sm font-bold transition-colors relative", activeTab === 'details' ? "text-espresso-900" : "text-espresso-400")}>
                    Details
                    {activeTab === 'details' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-espresso-900" />}
                  </button>
                  <button onClick={() => setActiveTab('ingredients')} className={cn("pb-3 text-sm font-bold transition-colors relative", activeTab === 'ingredients' ? "text-espresso-900" : "text-espresso-400")}>
                    Ingredients
                    {activeTab === 'ingredients' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-espresso-900" />}
                  </button>
                </div>
                
                <div className="min-h-[80px] mb-8">
                  {activeTab === 'details' && (
                    <div className="text-sm text-espresso-600 font-medium">
                      <p className="flex items-center gap-2 mb-2"><CheckCircle size={14} className="text-camel-500" /> Vet recommended formula.</p>
                      <p className="flex items-center gap-2"><CheckCircle size={14} className="text-camel-500" /> 100% satisfaction guarantee.</p>
                    </div>
                  )}
                  {activeTab === 'ingredients' && (
                    <p className="text-sm text-espresso-600 font-medium">{quickViewProduct.ingredients}</p>
                  )}
                </div>

                {/* Subscribe & Save Box */}
                <div className={cn("p-5 rounded-2xl border-2 transition-colors cursor-pointer mb-6 relative overflow-hidden", isSubscribed ? "border-accent-500 bg-accent-50/50" : "border-camel-100 bg-white hover:border-camel-300")} onClick={() => setIsSubscribed(!isSubscribed)}>
                  {isSubscribed && <div className="absolute top-0 right-0 w-16 h-16 bg-accent-100 rounded-bl-full flex items-start justify-end p-3"><CheckCircle size={16} className="text-accent-500" /></div>}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", isSubscribed ? "border-accent-500" : "border-camel-300")}>
                      {isSubscribed && <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />}
                    </div>
                    <span className="font-bold text-espresso-900">Subscribe & Save 10%</span>
                  </div>
                  <p className="text-xs font-medium text-espresso-500 ml-8 mb-2">Auto-deliver every 4 weeks. Cancel anytime.</p>
                  <p className="font-black text-accent-600 ml-8">${(quickViewProduct.price * 0.9).toFixed(2)} <span className="font-medium text-xs text-espresso-400 line-through ml-1">${quickViewProduct.price.toFixed(2)}</span></p>
                </div>

                <div className="mt-auto pt-6 flex gap-4">
                  <button 
                    disabled={quickViewProduct.stock === 0}
                    onClick={() => addToCart(quickViewProduct, 1, isSubscribed)}
                    className="flex-1 bg-espresso-900 hover:bg-espresso-800 disabled:opacity-50 text-white py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} /> {quickViewProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button className="w-14 h-14 rounded-full border-2 border-camel-100 flex items-center justify-center text-espresso-400 hover:border-camel-300 hover:text-accent-500 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. INTELLIGENT CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-[100]"
            />
            
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col border-l border-camel-100"
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

              {/* Free Shipping Progress */}
              <div className="p-6 bg-bg-secondary shrink-0 border-b border-camel-100">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-espresso-600 uppercase tracking-widest">
                    {shippingProgress >= 100 ? "You have free shipping!" : `Add $${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(2)} for Free Shipping`}
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
                    {cart.map((item, idx) => {
                      const itemPrice = item.isSub ? item.price * 0.9 : item.price;
                      return (
                        <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, height: 0 }} key={`${item.id}-${item.isSub}`} className="flex gap-4 items-start bg-white p-4 rounded-3xl border border-camel-100 shadow-sm relative group">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-camel-50" />
                          <div className="flex-1 pr-6">
                            <h4 className="font-bold text-espresso-900 text-sm leading-tight mb-1">{item.name}</h4>
                            {item.isSub && <p className="text-[10px] font-bold text-accent-600 uppercase tracking-widest mb-2 flex items-center gap-1"><RotateCcw size={10} /> Subscription</p>}
                            <span className="font-black text-espresso-900">${itemPrice.toFixed(2)}</span>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-3 w-max bg-bg-secondary p-1 rounded-full border border-camel-100">
                              <button onClick={() => updateCartQty(item.id, item.isSub, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white shadow-sm text-espresso-600 transition-colors"><Minus size={12} /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateCartQty(item.id, item.isSub, 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white shadow-sm text-espresso-600 transition-colors"><Plus size={12} /></button>
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button onClick={() => updateCartQty(item.id, item.isSub, -item.quantity)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-camel-50 flex items-center justify-center text-espresso-400 hover:text-accent-500 hover:bg-accent-50 transition-colors">
                            <X size={14} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}

                {/* AI Cross-Sell Mock */}
                {cart.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-camel-200 border-dashed">
                    <p className="text-xs font-bold text-espresso-400 uppercase tracking-widest mb-4">Pairs well with</p>
                    <div className="bg-white p-4 rounded-3xl border border-camel-100 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500 shrink-0"><Star size={20} fill="currentColor" /></div>
                       <div>
                         <p className="font-bold text-sm text-espresso-900 leading-tight">Probiotic Dental Chews</p>
                         <p className="text-xs font-medium text-espresso-500">$24.00</p>
                       </div>
                       <button className="ml-auto w-8 h-8 rounded-full bg-espresso-900 text-white flex items-center justify-center hover:bg-espresso-800 shrink-0"><Plus size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-camel-100 bg-white shrink-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-espresso-500 text-sm">Subtotal</span>
                  <span className="font-bold text-espresso-900">${cartTotal.toFixed(2)}</span>
                </div>
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

      {/* FIXED FLOATING CART BUTTON FOR EASY ACCESS */}
      {!isCartOpen && (
        <motion.button 
          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-espresso-900 text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
        >
          <ShoppingBag size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </motion.button>
      )}

    </div>
  );
}
