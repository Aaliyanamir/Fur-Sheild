import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import EcosystemSection from '../components/sections/EcosystemSection';
import FeatureBentoSection from '../components/sections/FeatureBentoSection';
import TrustSection from '../components/sections/TrustSection';
import FAQSection from '../components/sections/FAQSection';

export default function LandingPage() {
  const galleryImages = ["/images/pet-owner.jpg", "/images/vet-clinic.jpg", "/images/shelter-dogs.jpg", "/images/medical-records.jpg", "/images/pet-owner.jpg"];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="w-full">
      <div className="relative min-h-screen flex flex-col font-sans bg-espresso-900 overflow-hidden">
        
        {/* --- Local Cinematic Video Background --- */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-85">
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-espresso-900/50 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-espresso-900/95 via-espresso-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/80 via-transparent to-transparent"></div>
        </div>

        {/* --- Warm, Elegant Hero Content --- */}
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 lg:px-12 pt-36 pb-32">
          
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
            }}
            className="max-w-3xl"
          >
            {/* Gentle, friendly heading */}
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
              Exceptional care for the <br/>
              <span className="text-camel-400">pets you love.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/80 font-medium max-w-2xl leading-relaxed mb-10 drop-shadow-md">
              A comprehensive ecosystem uniting pet owners, clinical veterinarians, and rescue shelters into one simple, seamless platform.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-4">
              
              {/* Primary CTA */}
              <Link to="/signup" className="group relative px-8 py-4 bg-camel-600 hover:bg-camel-500 text-white rounded-full font-bold text-base transition-all shadow-[0_10px_30px_rgba(186,127,72,0.3)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden">
                <span className="relative z-10">Get Started</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-camel-500 to-camel-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              {/* Ultra-Premium Bespoke "Watch Demo" Action */}
              <button className="group flex items-center gap-5 hover:opacity-90 transition-opacity" onClick={() => setShowDemo(true)}>
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full border border-camel-200/30 bg-white/5 backdrop-blur-md overflow-hidden">
                  <div className="absolute inset-0 bg-camel-400/10 group-hover:bg-camel-400/30 transition-colors duration-500"></div>
                  <svg className="absolute inset-0 w-full h-full text-camel-300/80 -rotate-90 group-hover:rotate-0 transition-transform duration-700 ease-in-out" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="301" strokeDashoffset="240" className="group-hover:stroke-dashoffset-0 transition-all duration-700 ease-in-out" />
                  </svg>
                  <Play size={16} className="text-white ml-1 fill-current relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-black tracking-[0.25em] text-camel-300 uppercase">See it in action</span>
                  <span className="text-sm font-semibold text-white mt-0.5">Watch 2-Min Film</span>
                </div>
              </button>

            </motion.div>

          </motion.div>
        </div>

        {/* --- Infinite Cinematic Emotional Anchor Gallery --- */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 z-20 overflow-hidden bg-gradient-to-t from-espresso-900 via-espresso-900/60 to-transparent pointer-events-none flex items-end pb-4">
          <div className="w-max flex whitespace-nowrap animate-marquee opacity-60 mix-blend-screen hover:opacity-80 transition-opacity duration-500">
            
            <div className="flex gap-6 px-3">
              {galleryImages.map((src, i) => (
                <div key={"set1-" + i} className="w-48 md:w-64 h-20 md:h-28 rounded-2xl overflow-hidden border border-white/10 relative shadow-lg">
                  <div className="absolute inset-0 bg-camel-900/30 mix-blend-overlay z-10"></div>
                  <img src={src} alt="Pet Gallery" className="w-full h-full object-cover filter grayscale sepia-[0.3]" />
                </div>
              ))}
            </div>

            <div className="flex gap-6 px-3">
              {galleryImages.map((src, i) => (
                <div key={"set2-" + i} className="w-48 md:w-64 h-20 md:h-28 rounded-2xl overflow-hidden border border-white/10 relative shadow-lg">
                  <div className="absolute inset-0 bg-camel-900/30 mix-blend-overlay z-10"></div>
                  <img src={src} alt="Pet Gallery" className="w-full h-full object-cover filter grayscale sepia-[0.3]" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <EcosystemSection />
      <FeatureBentoSection />
      <TrustSection />
      <FAQSection />
    </div>
  );
}



