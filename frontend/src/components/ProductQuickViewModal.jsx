import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, X, Check, ShieldCheck, Plus, Truck } from 'lucide-react';

const ProductQuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <span className="px-3 py-1 bg-brand-dark text-white text-xs font-extrabold rounded-full uppercase">
                {product.badge || 'Featured Product'}
              </span>

              <button
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{product.category}</span>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{product.name}</h3>

                <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating} (Verified Reviews)</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {product.description}
                </p>

                <div className="text-2xl font-black text-slate-900 pt-2">
                  ${product.price.toFixed(2)}
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickViewModal;
