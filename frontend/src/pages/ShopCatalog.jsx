import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Star, X, Plus, Minus, ArrowRight, Loader2, ShieldCheck, Truck } from 'lucide-react';
import shopService from '../services/shop.service';

export default function ShopCatalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['All', 'Food', 'Health', 'Toys', 'Accessories'];

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await shopService.getProducts(activeCategory, searchQuery);
      if (res.success) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="flex-1 w-full bg-[#FAF8F5] min-h-screen">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        <div className="bg-espresso-900 rounded-[2.5rem] p-12 text-center text-camel-50 relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h1 className="text-5xl font-display font-black tracking-tight mb-4">Premium Nutrition & Accessories</h1>
            <p className="text-camel-200 max-w-xl mx-auto mb-8 font-medium">Curated products for your furry friends. Quality assured by FurShield.</p>
            <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..." 
                className="w-full bg-white/10 border border-white/20 text-white placeholder-camel-200/50 rounded-full py-4 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-camel-400 backdrop-blur-sm"
              />
              <button type="submit" className="absolute right-4 text-camel-200 hover:text-white transition-colors">
                <Search size={20} />
              </button>
            </form>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-camel-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-espresso-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm sticky top-24">
            <h3 className="text-sm font-black text-espresso-900 uppercase tracking-widest mb-6">Categories</h3>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-camel-100 text-espresso-900' : 'text-camel-600 hover:bg-camel-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <hr className="my-6 border-camel-100" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-espresso-600">
                <ShieldCheck size={16} className="text-camel-500" />
                Vet Approved Quality
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-espresso-600">
                <Truck size={16} className="text-camel-500" />
                Free Shipping over $50
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-espresso-900">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h2>
            <button onClick={() => shopService.seedProducts().then(() => fetchProducts())} className="text-xs font-bold text-camel-500 hover:text-camel-700 underline">Seed Mock Data</button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-camel-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-camel-100 p-12 text-center shadow-sm">
              <ShoppingBag className="w-16 h-16 text-camel-200 mx-auto mb-4" />
              <p className="text-lg font-bold text-espresso-900">No products found.</p>
              <p className="text-camel-600">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-[2rem] border border-camel-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-camel-300 transition-all group flex flex-col">
                  <div className="aspect-square bg-camel-50 relative p-6 flex items-center justify-center overflow-hidden">
                    <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                    {product.isPrescriptionRequired && (
                      <div className="absolute top-3 left-3 bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
                        Rx Required
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h3 className="font-black text-espresso-900 leading-tight truncate">{product.name}</h3>
                    </div>
                    <p className="text-xs font-bold text-camel-600 uppercase tracking-widest mb-3">{product.category}</p>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-espresso-600">{product.rating} ({product.reviewsCount})</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-black text-espresso-900">${product.price.toFixed(2)}</span>
                      <button onClick={() => addToCart(product)} className="w-10 h-10 rounded-full bg-camel-100 hover:bg-camel-600 text-camel-700 hover:text-white flex items-center justify-center transition-colors shadow-sm group-hover:-translate-y-1">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button (Mobile/Tablet) */}
      {cartCount > 0 && !isCartOpen && (
        <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 z-40 bg-espresso-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:bg-espresso-800 transition-transform hover:scale-105">
          <ShoppingBag size={20} />
          <span className="font-bold">{cartCount}</span>
        </button>
      )}

      {/* Cart Slide-out */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-[200]" onClick={() => setIsCartOpen(false)} />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[210] flex flex-col"
            >
              <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                <h2 className="text-xl font-black text-espresso-900 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-camel-600" />
                  Your Cart ({cartCount})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF8F5]">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-camel-600">
                    Your cart is empty.
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item._id} className="bg-white p-4 rounded-[1.5rem] border border-camel-100 flex items-center gap-4 shadow-sm">
                      <div className="w-16 h-16 bg-camel-50 rounded-xl p-1 shrink-0">
                        <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-espresso-900 truncate text-sm">{item.name}</h4>
                        <p className="text-xs font-bold text-camel-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-[#FAF8F5] rounded-full p-1 border border-camel-100">
                        <button onClick={() => updateCartQty(item._id, -1)} className="w-6 h-6 rounded-full bg-white text-espresso-900 flex items-center justify-center shadow-sm hover:bg-camel-100"><Minus size={12}/></button>
                        <span className="text-xs font-black text-espresso-900 w-3 text-center">{item.qty}</span>
                        <button onClick={() => updateCartQty(item._id, 1)} className="w-6 h-6 rounded-full bg-white text-espresso-900 flex items-center justify-center shadow-sm hover:bg-camel-100"><Plus size={12}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-camel-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-espresso-500 uppercase tracking-widest text-xs">Subtotal</span>
                    <span className="text-2xl font-black text-espresso-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      sessionStorage.setItem('furshield_cart', JSON.stringify(cart));
                      navigate('/checkout');
                    }} 
                    className="w-full bg-camel-600 hover:bg-camel-700 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex justify-center items-center gap-2 group"
                  >
                    Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
