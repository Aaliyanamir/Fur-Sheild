import React, { useEffect, useState } from 'react';
import { Loader2, PackageCheck, Truck, MapPin, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import shopService from '../services/shop.service';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await shopService.getMyOrders();
        if (res.success) {
          setOrders(res.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getTrackingStages = (order) => {
    const stages = [
      { label: 'Order Placed', completed: true, date: new Date(order.createdAt).toLocaleDateString() },
      { label: 'Processing', completed: order.isPaid, date: order.isPaid ? 'Processing' : 'Pending payment' },
      { label: 'Shipped', completed: order.isDelivered && !order.isPaid ? false : order.isPaid, date: order.isPaid ? 'In transit' : 'Awaiting' },
      { label: 'Delivered', completed: order.isDelivered, date: order.isDelivered ? 'Completed' : 'Expected in 3-5 days' }
    ];
    return stages;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full py-16 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-camel-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-camel-600 mb-2">Account</p>
        <h1 className="text-3xl md:text-5xl font-display font-black text-espresso-900">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-camel-200 bg-white p-10 text-center shadow-sm">
          <PackageCheck className="mx-auto mb-4 text-camel-500" size={42} />
          <h2 className="text-2xl font-black text-espresso-900 mb-2">No orders yet</h2>
          <p className="text-espresso-500">Your placed orders will appear here once you shop with FurShield.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-[2rem] bg-white border border-camel-100 shadow-sm overflow-hidden">
              <div className="bg-[#FAF8F5] px-6 py-4 border-b border-camel-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-camel-600">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-espresso-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-espresso-700">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  {order.isPaid ? 'Paid' : 'Pending Payment'}
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-4">
                    {order.orderItems?.map((item) => (
                      <div key={`${order._id}-${item.product || item.name}`} className="flex items-center gap-4 rounded-2xl border border-camel-100 p-3">
                        <img
                          src={item.image || '/images/product-placeholder.jpg'}
                          alt={item.name}
                          className="h-16 w-16 rounded-xl object-cover bg-camel-50"
                          onError={(e) => {
                            e.target.src = '/images/product-placeholder.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-espresso-900 truncate">{item.name}</p>
                          <p className="text-sm text-espresso-500">Qty: {item.qty}</p>
                        </div>
                        <p className="font-bold text-espresso-900">${Number(item.price || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-camel-100 bg-[#FAF8F5] p-4">
                      <div className="flex items-center gap-2 mb-2 text-espresso-900 font-black">
                        <MapPin size={16} className="text-camel-600" /> Shipping
                      </div>
                      <p className="text-sm text-espresso-700">{order.shippingAddress?.address}</p>
                      <p className="text-sm text-espresso-700">
                        {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                      </p>
                      <p className="text-sm text-espresso-700">{order.shippingAddress?.country}</p>
                    </div>

                    <div className="rounded-2xl border border-camel-100 bg-[#FAF8F5] p-4">
                      <div className="flex items-center gap-2 mb-2 text-espresso-900 font-black">
                        <Truck size={16} className="text-camel-600" /> Delivery
                      </div>
                      <p className="text-sm text-espresso-700">Status: {order.isDelivered ? 'Delivered' : 'Processing'}</p>
                      <p className="text-sm text-espresso-700">Payment: {order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-camel-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-camel-500">Total</p>
                    <p className="text-2xl font-black text-espresso-900">${Number(order.totalPrice || 0).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="rounded-full bg-espresso-900 text-white px-5 py-3 text-sm font-bold hover:bg-espresso-800 transition-all flex items-center gap-2"
                  >
                    Track Order
                    <ChevronDown size={16} className={`transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Tracking Timeline */}
                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-camel-100"
                    >
                      <h4 className="text-sm font-black text-espresso-900 mb-6">Order Tracking</h4>
                      <div className="space-y-4">
                        {getTrackingStages(order).map((stage, idx) => (
                          <div key={idx} className="flex gap-4 items-start">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-white ${stage.completed ? 'bg-emerald-500' : 'bg-camel-200'}`}>
                              {stage.completed ? <CheckCircle2 size={18} /> : idx + 1}
                            </div>
                            <div className="flex-1 pt-1">
                              <p className={`font-bold ${stage.completed ? 'text-emerald-700' : 'text-camel-600'}`}>
                                {stage.label}
                              </p>
                              <p className="text-xs text-espresso-500 mt-0.5">{stage.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
