import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CustomSelect({ options, value, onChange, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Select Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full bg-bg-secondary border rounded-xl px-4 py-3.5 text-sm font-medium transition-colors cursor-pointer select-none",
          isOpen ? "border-camel-400 ring-1 ring-camel-400 text-espresso-900" : "border-camel-100 text-espresso-900 hover:border-camel-300"
        )}
      >
        <span>{value || placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className={isOpen ? "text-camel-500" : "text-camel-400"} />
        </motion.div>
      </div>

      {/* Select Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-camel-100 rounded-xl shadow-[0_10px_40px_rgba(90,56,37,0.1)] overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-2 scrollbar-hide">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium cursor-pointer hover:bg-camel-50 transition-colors"
                >
                  <span className={value === option ? "text-camel-700 font-bold" : "text-espresso-700"}>
                    {option}
                  </span>
                  {value === option && <Check size={16} className="text-camel-500" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
