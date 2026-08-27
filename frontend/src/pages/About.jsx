import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="flex-1 w-full bg-[#FAF8F5] pb-20">
      <div className="bg-espresso-900 pt-32 pb-40 px-4 text-center">
        <h1 className="text-5xl font-display font-black text-white mb-6">About FurShield</h1>
        <p className="text-xl text-camel-200 max-w-2xl mx-auto">Uniting pet owners, clinical veterinarians, and rescue shelters into one seamless ecosystem.</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-20">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] shadow-xl p-12 border border-camel-100 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-espresso-900 mb-4">Our Mission</h2>
            <p className="text-espresso-600 leading-relaxed text-lg">We believe that every pet deserves world-class healthcare, every shelter deserves the tools to find forever homes, and every pet owner deserves peace of mind. FurShield was built to bridge the gap between fragmented pet services.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
