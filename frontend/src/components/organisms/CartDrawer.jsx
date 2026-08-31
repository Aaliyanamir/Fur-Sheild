import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../lib/imageUtils';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, isCartOpen, setIsCartOpen, updateQty, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-[200]"
            onClick={() => setIsCartOpen(false)}
          />
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
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF8F5]">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-camel-600">
                  <ShoppingBag className="mx-auto mb-3 text-camel-200" size={40} />
                  <p className="font-bold">Your cart is empty.</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/shop');
                    }}
                    className="mt-4 text-sm font-bold text-camel-700 underline"
                  >
                    Browse the shop
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="bg-white p-4 rounded-[1.5rem] border border-camel-100 flex items-center gap-4 shadow-sm">
                    <div className="w-16 h-16 bg-camel-50 rounded-xl p-1 shrink-0">
                      <img
                        src={getImageUrl(item.image || item.imageUrl, '/images/food.jpg')}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-espresso-900 truncate text-sm">{item.name}</h4>
                      <p className="text-xs font-bold text-camel-600">${Number(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-[#FAF8F5] rounded-full p-1 border border-camel-100">
                        <button onClick={() => updateQty(item._id, -1)} className="w-6 h-6 rounded-full bg-white text-espresso-900 flex items-center justify-center shadow-sm hover:bg-camel-100">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-black text-espresso-900 w-3 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, 1)} className="w-6 h-6 rounded-full bg-white text-espresso-900 flex items-center justify-center shadow-sm hover:bg-camel-100">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item._id)} className="text-rose-400 hover:text-rose-600 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-camel-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-espresso-500 uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-2xl font-black text-espresso-900">${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-espresso-500 mb-5">
                  {cartTotal >= 50 ? 'Free shipping unlocked.' : `Add $${(50 - cartTotal).toFixed(2)} more for free shipping.`}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
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
  );
}
