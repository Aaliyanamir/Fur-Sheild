import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Stethoscope, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FeatureBentoSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-white py-24 lg:py-32 overflow-hidden border-t border-espresso-900/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="mb-16 md:mb-20 text-center max-w-3xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-camel-400"></span>
            <span className="text-xs font-bold tracking-[0.2em] text-camel-600 uppercase">Platform Capabilities</span>
            <span className="w-8 h-[1px] bg-camel-400"></span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-bold text-espresso-900 tracking-tight leading-[1.1] mb-6">
            Intelligent tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-camel-500 to-camel-700 italic">seamless care.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-espresso-500 font-medium">
            Everything you need to manage health records, consultations, and supplies in one beautifully designed workspace.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]"
        >
          
          {/* Card 1: Smart Records (Spans 2 columns on Desktop) */}
          <motion.div variants={fadeUp} className="relative md:col-span-2 bg-bg-secondary rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-espresso-900/90 to-transparent z-10"></div>
            <img 
              src="/images/medical-records.jpg" 
              alt="Medical Records" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
                <FileText className="text-white" size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Unified Medical Records</h3>
              <p className="text-white/80 font-medium max-w-md mb-6">Access full vaccination history, prescriptions, and lab results instantly. Secure and accessible anywhere.</p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-camel-300 font-bold text-sm uppercase tracking-wide hover:text-white transition-colors w-fit">
                Open Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Vet Consultations */}
          <motion.div variants={fadeUp} className="relative bg-camel-50 rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between group border border-camel-100">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-camel-600 flex items-center justify-center mb-6 shadow-md group-hover:-translate-y-1 transition-transform">
                <Stethoscope className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-espresso-900 mb-3">Instant Vet Connect</h3>
              <p className="text-espresso-600 font-medium text-sm leading-relaxed">Book clinical appointments or start digital consultations with certified professionals in seconds.</p>
            </div>
            <Link to="/vet" className="inline-flex items-center gap-2 text-camel-600 font-bold text-sm uppercase tracking-wide hover:text-camel-800 transition-colors w-fit mt-8">
              Explore Vet Hub <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Card 3: Shelter Network */}
          <motion.div variants={fadeUp} className="relative bg-espresso-900 rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white/20 transition-colors">
                <Heart className="text-camel-400" size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">Shelter Network</h3>
              <p className="text-white/70 font-medium text-sm leading-relaxed">Connect with local shelters, manage adoption pipelines, and support community welfare.</p>
            </div>
            <Link to="/shelter" className="inline-flex items-center gap-2 text-camel-400 font-bold text-sm uppercase tracking-wide hover:text-camel-300 transition-colors w-fit mt-8">
              View Shelters <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Card 4: Pharmacy/Shop (Spans 2 columns on Desktop) */}
          <motion.div variants={fadeUp} className="relative md:col-span-2 bg-bg-secondary rounded-3xl overflow-hidden group border border-espresso-900/10">
             <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-transparent to-bg-secondary z-10 hidden md:block"></div>
             <div className="absolute inset-0 bg-bg-secondary/80 md:hidden z-10"></div>
             <img 
              src="/images/pet-owner.jpg" 
              alt="Pet Supplies" 
              className="absolute inset-0 md:inset-y-0 md:left-1/2 md:w-1/2 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-10 max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <ShoppingBag className="text-camel-600" size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-espresso-900 mb-3">Integrated Pharmacy</h3>
              <p className="text-espresso-600 font-medium mb-6">Order prescriptions, premium nutrition, and care supplies directly through your unified dashboard.</p>
              <Link to="/shop" className="inline-flex items-center gap-2 text-camel-600 font-bold text-sm uppercase tracking-wide hover:text-camel-800 transition-colors w-fit">
                Visit Shop <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

