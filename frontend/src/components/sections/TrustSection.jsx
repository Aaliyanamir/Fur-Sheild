import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Quote, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function TrustSection() {
  const apiMockData = {
    testimonials: [
      {
        id: 101,
        quote: "FurShield completely transformed how we manage our shelter. The intake pipeline and medical tracking are entirely flawless.",
        author: "Sarah Jenkins",
        role: "Director, City Paws Rescue"
      },
      {
        id: 102,
        quote: "Having instant access to a pet's complete digital history before they even walk into the clinic is game-changing.",
        author: "Dr. Mark Thorne",
        role: "Lead Veterinarian"
      },
      {
        id: 103,
        quote: "The unified dashboard saves me hours every week. Tracking my dogs' vaccines and ordering meds has never been easier.",
        author: "Emily Chen",
        role: "Pet Parent"
      },
      {
        id: 104,
        quote: "Integrated pharmacy orders mean we never run out of crucial supplies. It is a remarkably engineered platform.",
        author: "David Ross",
        role: "Clinic Manager"
      }
    ]
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance logic (5 seconds per slide)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % apiMockData.testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, apiMockData.testimonials.length]);

  const activeTestimonial = apiMockData.testimonials[activeIndex];

  return (
    <section className="relative w-full bg-white py-24 lg:py-32 overflow-hidden border-y border-espresso-900/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-camel-500" size={20} />
              <span className="text-xs font-bold tracking-[0.2em] text-camel-600 uppercase">Trusted by Leaders</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-espresso-900 tracking-tight">
              Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-camel-500 to-camel-700 italic">excellence.</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex gap-8 items-center"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-black text-espresso-900">10k+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-camel-600">Active Pets</span>
            </div>
            <div className="w-[1px] h-10 bg-espresso-900/10"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-espresso-900">99.9%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-camel-600">Uptime SLA</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Story/Showcase Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Active Dark Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 relative bg-espresso-900 rounded-[2.5rem] p-8 md:p-16 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[400px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-camel-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <Quote className="absolute -top-6 -right-6 text-camel-900/30 rotate-12" size={160} />
            
            <div className="relative z-10 flex-1 flex flex-col justify-center mb-12">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={activeTestimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-2xl md:text-3xl lg:text-4xl font-display font-medium text-white leading-tight"
                >
                  "{activeTestimonial.quote}"
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Author Controls */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/10 pt-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`author-${activeTestimonial.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-camel-600 flex items-center justify-center text-white font-bold font-display text-lg shadow-inner border border-camel-400">
                    {activeTestimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg tracking-wide">{activeTestimonial.author}</p>
                    <p className="text-camel-300 text-sm font-medium">{activeTestimonial.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Manual Nav */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveIndex((prev) => (prev === 0 ? apiMockData.testimonials.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <button 
                  onClick={() => setActiveIndex((prev) => (prev + 1) % apiMockData.testimonials.length)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Roster / Progress Trackers */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-3"
          >
            {apiMockData.testimonials.map((test, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={test.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative text-left p-6 rounded-3xl border transition-all duration-300 overflow-hidden group",
                    isActive 
                      ? "bg-bg-secondary border-camel-200 shadow-sm" 
                      : "bg-white border-espresso-900/5 hover:border-camel-200 hover:bg-camel-50/50"
                  )}
                >
                  {/* Active Progress Background Fill */}
                  {isActive && !isPaused && (
                    <motion.div 
                      className="absolute top-0 left-0 bottom-0 bg-camel-100/50 z-0"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col">
                    <span className={cn(
                      "font-bold text-base transition-colors duration-300",
                      isActive ? "text-espresso-900" : "text-espresso-900/60 group-hover:text-espresso-900"
                    )}>
                      {test.author}
                    </span>
                    <span className={cn(
                      "text-xs font-medium mt-1 transition-colors duration-300",
                      isActive ? "text-camel-700" : "text-espresso-500/60 group-hover:text-espresso-500"
                    )}>
                      {test.role}
                    </span>
                  </div>
                </button>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
