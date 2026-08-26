import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag, X, Plus, Minus, ShieldCheck } from 'lucide-react';

export default function ShopCatalog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // BACKEND PREP: Mock Product Data
  const products = [
    { id: 1, name: 'Advanced Joint Support', category: 'Supplements', price: 45.00, rxRequired: false, image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Flea & Tick Prevention (3-Month)', category: 'Prescriptions', price: 85.00, rxRequired: true, image: 'https://images.unsplash.com/photo-1628544498308-3cb96716a5ec?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Hypoallergenic Salmon Diet', category: 'Nutrition', price: 65.50, rxRequired: false, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Anxiety Calming Chews', category: 'Supplements', price: 32.00, rxRequired: false, image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'Heartworm Medication', category: 'Prescriptions', price: 110.00, rxRequired: true, image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'Puppy Growth Formula', category: 'Nutrition', price: 55.00, rxRequired: false, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80' },
  ];

  const categories = ['All', 'Prescriptions', 'Supplements', 'Nutrition'];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product) => {
    // Basic mock cart logic for UI demonstration
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full font-sans pt-4">
      
      {/* Header & Cart Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-camel-600 font-bold text-xs tracking-[0.25em] uppercase mb-1">Ecosystem Store</p>
          <h1 className="text-4xl font-display font-black text-espresso-900 tracking-tight">
            Integrated Pharmacy
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-400" size={16} />
            <input 
              type="text" 
              placeholder="Search medications..." 
              className="pl-10 pr-4 py-2.5 rounded-full border border-camel-100 bg-white text-sm font-medium focus:outline-none focus:border-camel-400 w-64 shadow-sm"
            />
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-camel-600 hover:bg-camel-500 text-white shadow-[0_5px_15px_rgba(186,127,72,0.3)] transition-all"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-espresso-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FDFBF7]">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-espresso-900 text-white shadow-md' 
                : 'bg-white text-espresso-600 border border-camel-100 hover:border-camel-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <motion.div variants={item} key={product.id} className="bg-white rounded-[2rem] p-4 border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.03)] group hover:shadow-xl transition-all duration-300">
            {/* Image Box */}
            <div className="relative w-full h-56 rounded-3xl overflow-hidden bg-camel-50 mb-4">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {product.rxRequired && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={14} className="text-accent-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-espresso-900">Rx Required</span>
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display font-bold text-lg text-espresso-900 leading-tight pr-4">{product.name}</h3>
                <span className="font-black text-camel-700 text-lg">${product.price.toFixed(2)}</span>
              </div>
              <p className="text-xs font-bold text-espresso-400 uppercase tracking-widest mb-6">{product.category}</p>
              
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-bg-secondary hover:bg-camel-600 hover:text-white text-espresso-900 py-3 rounded-xl font-bold text-sm transition-colors border border-camel-100 hover:border-transparent"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Slide-out Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-[100]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col border-l border-camel-100"
            >
              <div className="p-6 border-b border-camel-100 flex items-center justify-between bg-bg-secondary/30">
                <h2 className="text-2xl font-display font-bold text-espresso-900">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-white border border-camel-100 flex items-center justify-center text-espresso-400 hover:text-camel-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-espresso-400">
                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                    <p className="font-bold text-lg">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-camel-50 p-3 rounded-2xl border border-camel-100">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-espresso-900 text-sm leading-tight mb-1">{item.name}</h4>
                        <span className="font-black text-camel-600 text-sm">${item.price.toFixed(2)}</span>
                      </div>
                      <button className="w-8 h-8 flex items-center justify-center text-espresso-400 hover:text-accent-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-6 border-t border-camel-100 bg-bg-secondary/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-espresso-500">Total</span>
                  <span className="text-2xl font-black text-espresso-900">
                    ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
                  </span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-50 text-white py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
