import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, ClipboardList, CheckCircle2, ArrowRight, Loader2, Lock } from 'lucide-react';
import shopService from '../services/shop.service';

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    const savedCart = sessionStorage.getItem('furshield_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate('/shop');
    }
  }, [navigate]);

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 50 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({ product: item._id, name: item.name, image: item.image, price: item.price, qty: item.qty })),
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };
      const res = await shopService.createOrder(orderData);
      if (res.success) {
        sessionStorage.removeItem('furshield_cart');
        setStep(4);
      }
    } catch (error) {
      console.error(error);
      alert('Error placing order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const stepIcons = [
    { num: 1, label: 'Shipping', icon: Truck },
    { num: 2, label: 'Payment', icon: CreditCard },
    { num: 3, label: 'Review', icon: ClipboardList },
  ];

  return (
    <div className="flex-1 w-full bg-[#FAF8F5] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Tracker */}
        {step < 4 && (
          <div className="mb-12">
            <div className="flex justify-between items-center relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:right-0 before:h-1 before:bg-camel-100 before:z-0">
              {stepIcons.map((s, idx) => {
                const isActive = step >= s.num;
                const isCurrent = step === s.num;
                return (
                  <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-colors ${isActive ? 'bg-camel-600 text-white shadow-md' : 'bg-white text-camel-300 border-2 border-camel-100'}`}>
                      <s.icon size={20} />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${isCurrent ? 'text-espresso-900' : 'text-camel-400'}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(90,56,37,0.06)] border border-camel-100 overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SHIPPING */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-12">
                <h2 className="text-3xl font-display font-black text-espresso-900 mb-8">Shipping Address</h2>
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Street Address</label>
                    <input type="text" required value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">City</label>
                      <input type="text" required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Postal Code</label>
                      <input type="text" required value={shipping.postalCode} onChange={e => setShipping({...shipping, postalCode: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-2 px-1">Country</label>
                    <input type="text" required value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 transition-all" />
                  </div>
                  <div className="pt-6">
                    <button type="submit" className="w-full bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md">Continue to Payment</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-display font-black text-espresso-900">Payment Method</h2>
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                    <Lock size={12} /> Secure
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'Credit Card' ? 'border-camel-500 bg-camel-50/50' : 'border-camel-100 hover:border-camel-300'}`}>
                    <input type="radio" name="payment" value="Credit Card" checked={paymentMethod === 'Credit Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-camel-600 focus:ring-camel-500 border-camel-300" />
                    <div className="flex-1">
                      <p className="font-black text-espresso-900">Credit / Debit Card</p>
                      <p className="text-xs font-medium text-espresso-500">Visa, Mastercard, Amex</p>
                    </div>
                    <CreditCard className="text-camel-400" />
                  </label>
                  
                  {/* Mock CC Form */}
                  {paymentMethod === 'Credit Card' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-[#FAF8F5] rounded-2xl border border-camel-100 space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-espresso-600 uppercase tracking-widest mb-1.5 px-1">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-camel-200 rounded-lg px-4 py-2.5 text-sm focus:border-camel-500 transition-all font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-espresso-600 uppercase tracking-widest mb-1.5 px-1">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full bg-white border border-camel-200 rounded-lg px-4 py-2.5 text-sm focus:border-camel-500 transition-all font-mono" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-espresso-600 uppercase tracking-widest mb-1.5 px-1">CVC</label>
                          <input type="text" placeholder="123" className="w-full bg-white border border-camel-200 rounded-lg px-4 py-2.5 text-sm focus:border-camel-500 transition-all font-mono" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-sm tracking-wide bg-camel-100 text-espresso-900 hover:bg-camel-200 transition-all">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-espresso-900 hover:bg-espresso-800 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md">Review Order</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-12">
                <h2 className="text-3xl font-display font-black text-espresso-900 mb-8">Review Order</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-sm font-black text-espresso-900 uppercase tracking-widest mb-4">Items ({cart.length})</h3>
                    <div className="space-y-4 mb-8">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-[#FAF8F5] rounded-xl p-1 border border-camel-100">
                            <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-espresso-900 text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-camel-600 font-bold mt-1">Qty: {item.qty}</p>
                          </div>
                          <div className="font-black text-espresso-900">${(item.price * item.qty).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-sm font-black text-espresso-900 uppercase tracking-widest mb-4">Shipping To</h3>
                    <div className="bg-[#FAF8F5] rounded-xl p-4 border border-camel-100 text-sm text-espresso-600">
                      <p>{shipping.address}</p>
                      <p>{shipping.city}, {shipping.postalCode}</p>
                      <p>{shipping.country}</p>
                    </div>
                  </div>

                  <div>
                    <div className="bg-[#FAF8F5] rounded-[2rem] p-8 border border-camel-100">
                      <h3 className="text-sm font-black text-espresso-900 uppercase tracking-widest mb-6">Order Summary</h3>
                      <div className="space-y-3 text-sm text-espresso-700 font-medium mb-6">
                        <div className="flex justify-between"><span>Items Subtotal</span><span>${itemsPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
                      </div>
                      <div className="pt-6 border-t border-camel-200 flex justify-between items-center mb-8">
                        <span className="text-lg font-black text-espresso-900">Total</span>
                        <span className="text-3xl font-black text-camel-600">${totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <button 
                        onClick={handlePlaceOrder} 
                        disabled={loading}
                        className="w-full bg-camel-600 hover:bg-camel-700 disabled:opacity-70 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex justify-center items-center gap-2"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-12 md:p-20 text-center">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <h2 className="text-4xl font-display font-black text-espresso-900 mb-4">Order Placed!</h2>
                <p className="text-espresso-500 max-w-md mx-auto mb-10 text-lg">Thank you for your purchase. We've sent a confirmation email to your registered address.</p>
                <button onClick={() => navigate('/shop')} className="bg-espresso-900 hover:bg-espresso-800 text-white px-8 py-4 rounded-xl font-bold shadow-md transition-colors inline-flex items-center gap-2">
                  Continue Shopping <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
