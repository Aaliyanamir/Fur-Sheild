import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => dismiss(id), 3400);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-24 right-4 z-[400] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24 }}
              className={`pointer-events-auto flex items-center gap-3 min-w-[260px] max-w-sm px-4 py-3 rounded-2xl border shadow-lg ${
                t.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : t.type === 'info'
                    ? 'bg-sky-50 border-sky-200 text-sky-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {t.type === 'error' ? <AlertCircle size={18} /> : t.type === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}
              <span className="text-sm font-bold flex-1">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
