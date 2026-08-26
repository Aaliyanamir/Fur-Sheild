import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Quote } from 'lucide-react';

export default function TrustSection() {
  // BACKEND PREP: API-ready data structure for testimonials
  const apiMockData = {
    testimonials: [
      {
        id: 101,
        quote: "FurShield completely transformed how we manage our shelter. The intake pipeline is flawless.",
        author: "Sarah Jenkins",
        role: "Director, City Paws Rescue"
      },
      {
        id: 102,
        quote: "Having instant access to a pet's complete digital history before they even walk in is game-changing.",
        author: "Dr. Mark Thorne",
        role: "Lead Veterinarian"
      },
      {
        id: 103,
        quote: "The unified dashboard saves me hours every week. Tracking my dogs' vaccines has never been easier.",
        author: "Emily Chen",
        role: "Pet Parent"
      },
      {
        id: 104,
        quote: "Integrated pharmacy orders mean we never run out of crucial supplies. A remarkably engineered platform.",
        author: "David Ross",
        role: "Clinic Manager"
      }
    ]
  };

  // Duplicate for seamless infinite loop
  const marqueeItems = [...apiMockData.testimonials, ...apiMockData.testimonials];

  return (
    <section className="relative w-full bg-camel-50 py-20 overflow-hidden border-y border-camel-200/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-camel-500" size={20} />
            <span className="text-xs font-bold tracking-[0.2em] text-camel-600 uppercase">Trusted Ecosystem</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-espresso-900 tracking-tight">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-camel-500 to-camel-700 italic">excellence.</span>
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-8 items-center pb-2"
        >
          <div className="flex flex-col">
            <span className="text-2xl font-black text-espresso-900">10k+</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-camel-600">Active Pets</span>
          </div>
          <div className="w-[1px] h-8 bg-camel-200"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-espresso-900">99.9%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-camel-600">Uptime SLA</span>
          </div>
        </motion.div>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="relative w-full flex overflow-hidden group">
        {/* Gradient fades for smooth edges */}
        <div className="absolute top-0 left-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-camel-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-camel-50 to-transparent z-10 pointer-events-none"></div>

        <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max px-3">
          {marqueeItems.map((testimonial, idx) => (
            <div 
              key={`${testimonial.id}-${idx}`}
              className="w-[320px] md:w-[400px] shrink-0 bg-white rounded-3xl p-8 border border-camel-100 shadow-[0_10px_30px_rgba(186,127,72,0.05)] flex flex-col justify-between"
            >
              <div>
                <Quote className="text-camel-200 mb-6" size={32} />
                <p className="text-espresso-800 font-medium leading-relaxed mb-8 text-sm md:text-base">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-camel-100 flex items-center justify-center text-camel-700 font-bold font-display">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="text-espresso-900 font-bold text-sm">{testimonial.author}</p>
                  <p className="text-espresso-500 text-xs font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
