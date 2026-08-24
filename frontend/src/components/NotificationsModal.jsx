import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Clock, AlertTriangle, X, Check, ShieldCheck, Heart } from 'lucide-react';

const mockNotifications = [
  {
    id: 'n1',
    title: 'Vaccination Due Alert',
    message: 'Buddy (Golden Retriever) is due for Flea & Tick monthly preventive in 7 days.',
    type: 'alert',
    time: '10 mins ago',
    unread: true
  },
  {
    id: 'n2',
    title: 'Appointment Confirmed',
    message: 'Dr. Sarah Connor approved your appointment for Aug 25 at 10:00 AM.',
    type: 'success',
    time: '2 hours ago',
    unread: true
  },
  {
    id: 'n3',
    title: 'Adoption Application Update',
    message: 'Happy Tails Shelter moved your adoption request for Max to Approved status.',
    type: 'info',
    time: '1 day ago',
    unread: false
  }
];

const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-900 text-white p-2.5 rounded-2xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Notifications & Alerts</h3>
                  <p className="text-xs text-slate-500">{notifications.filter(n => n.unread).length} unread alerts</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 p-6 overflow-y-auto space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-16 space-y-2 text-slate-400">
                  <Bell className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">No new notifications.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between space-x-3 ${
                      n.unread ? 'bg-slate-50 border-slate-300 font-medium' : 'bg-white border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                        {n.type === 'info' && <ShieldCheck className="w-4 h-4 text-slate-700 flex-shrink-0" />}
                        <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 font-mono block pt-1">{n.time}</span>
                    </div>

                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-slate-300 hover:text-red-600 p-1"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={markAllRead}
                  className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark All as Read
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsModal;
