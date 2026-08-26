import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FAQSection() {
  // BACKEND PREP: API-ready data structure for FAQs
  const apiMockData = {
    faqs: [
      {
        id: 1,
        question: "How does FurShield integrate with existing vet software?",
        answer: "FurShield provides seamless API integrations and secure data migration tools. Our onboarding team ensures your clinic's existing records are seamlessly imported without any operational downtime."
      },
      {
        id: 2,
        question: "Is pet owner medical data secure and private?",
        answer: "Absolutely. We employ end-to-end encryption and comply with global health data privacy standards. Only authorized clinical staff and the verified pet owner can access medical histories."
      },
      {
        id: 3,
        question: "Can rescue shelters use the platform for free?",
        answer: "We offer heavily subsidized, and in many cases completely free, enterprise tiers for registered 501(c)(3) non-profit animal rescues and shelters as part of our community mission."
      },
      {
        id: 4,
        question: "How do the integrated pharmacy orders work?",
        answer: "Prescriptions uploaded by your verified veterinarian are instantly sent to our network of partner pharmacies. Owners can order medications directly from their dashboard with next-day delivery."
      },
      {
        id: 5,
        question: "Do I need a separate app for multiple pets?",
        answer: "No, your FurShield Owner Dashboard supports unified multi-pet management. You can seamlessly switch between profiles for different pets under a single account."
      }
    ]
  };

  const [openId, setOpenId] = useState(1);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative w-full bg-bg-secondary py-24 lg:py-32 overflow-hidden border-t border-espresso-900/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Left Side: Sticky Editorial Image & Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-espresso-900 tracking-tight leading-[1.1] mb-6">
                Clear answers for a <br/>
                <span className="text-camel-600 italic">complex world.</span>
              </h2>
              <p className="text-lg text-espresso-600 font-medium mb-10 max-w-md">
                Everything you need to know about integrating FurShield into your daily pet care routine.
              </p>
              
              {/* Premium Image Mask using Local Asset */}
              <div className="relative w-full aspect-[4/5] max-w-sm rounded-3xl overflow-hidden shadow-lg hidden md:block">
                <div className="absolute inset-0 bg-espresso-900/20 mix-blend-multiply z-10"></div>
                <img 
                  src="/images/faq-pets.jpg" 
                  alt="Veterinary Care" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Decorative Element */}
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl z-20">
                  <p className="text-white text-sm font-bold tracking-wide uppercase">24/7 Priority Support</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Accordion List */}
          <div className="lg:col-span-7 w-full flex flex-col gap-4 pt-4 lg:pt-0">
            {apiMockData.faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              
              return (
                <motion.div 
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={cn(
                    "bg-white rounded-3xl border transition-all duration-300 overflow-hidden",
                    isOpen ? "border-camel-300 shadow-[0_10px_30px_rgba(186,127,72,0.1)]" : "border-espresso-900/10 hover:border-camel-200"
                  )}
                >
                  <button 
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                  >
                    <span className={cn(
                      "text-lg md:text-xl font-display font-bold transition-colors duration-300 pr-8",
                      isOpen ? "text-camel-700" : "text-espresso-900"
                    )}>
                      {faq.question}
                    </span>
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                      isOpen ? "bg-camel-100 text-camel-600" : "bg-bg-secondary text-espresso-400"
                    )}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 md:px-8 pb-8 text-espresso-600 font-medium leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

