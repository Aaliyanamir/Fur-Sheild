import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, ArrowRight, Play, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import EcosystemSection from '../components/sections/EcosystemSection';
import FeatureBentoSection from '../components/sections/FeatureBentoSection';
import TrustSection from '../components/sections/TrustSection';

export default function LandingPage() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Veterinarian', path: '/vet', icon: Stethoscope },
    { name: 'Shelter', path: '/shelter', icon: HeartHandshake },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
  ];

  const galleryImages = ["/images/pet-owner.jpg", "/images/vet-clinic.jpg", "/images/shelter-dogs.jpg", "/images/medical-records.jpg", "/images/pet-owner.jpg"];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main>
    <div className="relative min-h-screen flex flex-col font-sans bg-espresso-900 overflow-hidden">
      
      {/* --- Local Cinematic Video Background --- */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-85">
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-espresso-900/50 mix-blend-multiply"></div>
        {/* Soft gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-900/95 via-espresso-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/80 via-transparent to-transparent"></div>
      </div>

      {/* --- Premium Public Navbar (Pristine Approved Version) --- */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <header className="relative w-full max-w-5xl h-[64px] md:h-[72px] bg-white rounded-[32px] md:rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-camel-100/50 flex items-center justify-between overflow-hidden pointer-events-auto transition-all duration-300">
          
          {/* RIGHT ZONE SWOOP BACKGROUND - Perfect SVG curve */}
          <div className="absolute top-0 right-0 h-full w-[220px] md:w-[360px] z-0 pointer-events-none transition-all duration-300">
            <svg viewBox="0 0 360 72" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="camelSwoop" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F9F6F0" stopOpacity="1" />
                  <stop offset="100%" stopColor="#E4D1B9" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path 
                d="M0,72 C120,72 160,0 260,0 L360,0 L360,72 Z" 
                fill="url(#camelSwoop)" 
              />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between w-full h-full px-2">
            
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 md:pr-4 lg:pr-8 shrink-0 hover:opacity-80 transition-opacity">
              <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-all duration-300">
                <div className="absolute inset-0 bg-camel-200 rounded-full mix-blend-multiply filter blur-[3px] opacity-80 scale-110 rotate-12"></div>
                <div className="absolute inset-1 bg-camel-300 rounded-full mix-blend-multiply filter blur-[4px] opacity-60 -rotate-12"></div>
                <div className="absolute -inset-0.5 bg-camel-100 rounded-full mix-blend-multiply filter blur-[2px] opacity-70 rotate-45 scale-105"></div>
                <PawPrint size={20} className="relative z-10 text-espresso-900 md:w-[22px] md:h-[22px]" fill="currentColor" />
              </div>
              <div className="flex flex-col justify-center">
                <span 
                  className="text-[24px] md:text-[26px] lg:text-[28px] text-espresso-900 leading-[0.9] tracking-tight transition-all duration-300"
                  style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
                >
                  FurShield
                </span>
                <span className="hidden lg:block text-[10px] text-espresso-500 font-medium mt-0.5 tracking-wide">
                  For tails that tell stories.
                </span>
              </div>
            </Link>

            {/* Center: Dashboard Navigation Sync */}
            <nav className="hidden md:flex items-center gap-1 md:gap-2 lg:gap-6 h-full pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className="relative group h-full flex items-center justify-center px-1 lg:px-2"
                  >
                    {({ isActive }) => (
                      <div className="flex flex-col items-center justify-center gap-[3px]">
                        <Icon 
                          size={21} 
                          strokeWidth={1.5} 
                          className={cn(
                            "transition-colors duration-300",
                            isActive ? "text-camel-900" : "text-espresso-400 group-hover:text-camel-600"
                          )}
                        />
                        <div className="relative px-2 lg:px-3 py-0.5 flex items-center justify-center">
                          {isActive && (
                            <svg className="absolute inset-0 w-full h-full text-camel-200 scale-x-[1.25] scale-y-[1.1] -z-10 drop-shadow-sm opacity-90" preserveAspectRatio="none" viewBox="0 0 100 30">
                              <path d="M 3,6 C 20,2 40,7 60,3 S 80,8 97,5 C 98,12 95,20 96,25 C 80,28 60,23 40,27 S 20,22 4,24 C 2,18 5,10 3,6 Z" fill="currentColor" />
                            </svg>
                          )}
                          {!isActive && (
                            <svg className="absolute inset-0 w-full h-full text-camel-100 scale-x-[1.25] scale-y-[1.1] -z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-300" preserveAspectRatio="none" viewBox="0 0 100 30">
                              <path d="M 3,6 C 20,2 40,7 60,3 S 80,8 97,5 C 98,12 95,20 96,25 C 80,28 60,23 40,27 S 20,22 4,24 C 2,18 5,10 3,6 Z" fill="currentColor" />
                            </svg>
                          )}
                          <span className={cn(
                            "relative z-10 text-[12px] lg:text-[13px] tracking-wide transition-colors duration-300",
                            isActive ? "text-camel-900 font-bold" : "text-espresso-600 font-semibold group-hover:text-camel-800"
                          )}>
                            {item.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right: Sign In Action */}
            <div className="flex items-center pr-1 md:pr-3 h-full shrink-0">
              <Link 
                to="/dashboard" 
                className="px-5 py-2 md:px-7 md:py-2.5 bg-camel-600 hover:bg-camel-500 text-white rounded-full font-bold text-[13px] md:text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            </div>

          </div>
        </header>
      </motion.div>

      {/* --- Warm, Elegant Hero Content --- */}
      <main className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-32">
        
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
            <Link to="/dashboard" className="group relative px-8 py-4 bg-camel-600 hover:bg-camel-500 text-white rounded-full font-bold text-base transition-all shadow-[0_10px_30px_rgba(186,127,72,0.3)] hover:shadow-[0_15px_40px_rgba(186,127,72,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-camel-500 to-camel-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            {/* Ultra-Premium Bespoke "Watch Demo" Action */}
            <button className="group flex items-center gap-5 hover:opacity-90 transition-opacity">
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
      </main>

      {/* --- Infinite Cinematic Emotional Anchor Gallery --- */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 z-20 overflow-hidden bg-gradient-to-t from-espresso-900 via-espresso-900/60 to-transparent pointer-events-none flex items-end pb-4">
        {/* We use w-max and the 50% translation keyframe for a perfectly seamless infinite scroll */}
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
    </main>
  );
}




