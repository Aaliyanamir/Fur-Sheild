import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductQuickViewModal from '../components/ProductQuickViewModal';
import OrderHistoryModal from '../components/OrderHistoryModal';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Truck, 
  Tag, 
  ArrowRight,
  Heart,
  Sparkles,
  Eye,
  Package
} from 'lucide-react';

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Premium Organic Adult Dog Kibble (10kg)',
    category: 'Food & Nutrition',
    price: 49.99,
    rating: 4.8,
    reviewsCount: 142,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    description: '100% natural, grain-free adult dog formula enriched with Omega-3, probiotics, and real chicken protein.'
  },
  {
    id: 'prod-2',
    name: 'Feline Dental & Hairball Control Treats (250g)',
    category: 'Food & Nutrition',
    price: 14.50,
    rating: 4.7,
    reviewsCount: 98,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    description: 'Crunchy cat bite treats designed to reduce tartar accumulation and support digestive hairball passage.'
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Reflective Dog Harness & Leash Set',
    category: 'Accessories & Gear',
    price: 28.99,
    rating: 4.9,
    reviewsCount: 215,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    description: 'No-pull padded harness featuring 3M reflective safety strips and heavy-duty zinc alloy leash hardware.'
  },
  {
    id: 'prod-4',
    name: 'Gentle Medicated Flea & Tick Shampoo (500ml)',
    category: 'Grooming & Hygiene',
    price: 18.99,
    rating: 4.6,
    reviewsCount: 76,
    badge: 'Vet Recommended',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
    description: 'Sulfate-free soothing aloe vera shampoo that eliminates fleas, ticks, and coat odor.'
  }
];

const Shop = () => {
  const [products] = useState(mockProducts);
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      name: 'Premium Organic Adult Dog Kibble (10kg)',
      price: 49.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
      category: 'Food & Nutrition'
    }
  ]);
  const [orderHistory, setOrderHistory] = useState([
    {
      orderNumber: 'FS-984120',
      total: '49.99',
      itemCount: 1,
      date: '2026-08-20'
    }
  ]);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          category: product.category
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const newOrder = {
      orderNumber: `FS-${Math.floor(100000 + Math.random() * 900000)}`,
      total: subtotal.toFixed(2),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      date: new Date().toLocaleDateString()
    };

    setOrderHistory([newOrder, ...orderHistory]);
    setCartItems([]);
    setIsCartOpen(false);
    alert(`🎉 Order #${newOrder.orderNumber} placed successfully! Saved to your Order History.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-16 font-sans">
      {/* HERO MARKETPLACE BANNER */}
      <div className="bg-brand-dark rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <ShoppingBag className="w-4 h-4 text-brand-sage" />
            <span>FurShield Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold">Curated Vet-Approved Pet Supplies</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsOrderHistoryOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-4 py-3 rounded-2xl border border-white/20 transition-all flex items-center gap-2 text-xs"
          >
            <Package className="w-4 h-4" />
            Order History ({orderHistory.length})
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-brand-sage hover:bg-emerald-200 text-brand-dark font-extrabold px-6 py-3 rounded-2xl shadow-md transition-all flex items-center gap-3 text-xs"
          >
            <ShoppingCart className="w-5 h-5 text-brand-dark" />
            <span>Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS CATALOG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-48 relative overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-brand-dark text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  {product.badge}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">{product.category}</span>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{product.name}</h3>
                <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
              <span className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-brand-dark hover:bg-brand-darker text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODALS */}
      <ProductQuickViewModal product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} />
      <OrderHistoryModal orders={orderHistory} isOpen={isOrderHistoryOpen} onClose={() => setIsOrderHistoryOpen(false)} />

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-6">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-brand-dark" />
                  Shopping Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-bg-soft rounded-2xl border border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs font-extrabold text-brand-dark">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-1 bg-white rounded border">
                        <Minus className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-1 bg-white rounded border">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>Subtotal:</span>
                <span className="text-brand-dark">${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-brand-dark hover:bg-brand-darker text-white font-extrabold py-3.5 rounded-xl text-xs shadow-md"
              >
                Place Order (Mock Checkout)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
