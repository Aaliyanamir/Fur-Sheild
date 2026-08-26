import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, ArrowRight, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function LandingPage() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Veterinarian', path: '/vet', icon: Stethoscope },
    { name: 'Shelter', path: '/shelter', icon: HeartHandshake },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
  ];

  // Animation variants for staggered text reveal
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-espresso-900 selection:bg-camel-500 selection:text-white overflow-hidden">
      
      {/* --- Immersive Cinematic Video Background --- */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-[1.02] opacity-80">
          <source src="https://cdn.pixabay.com/video/2021/08/04/83908-584742637_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-espresso-900/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-900/95 via-espresso-900/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-transparent to-transparent"></div>
      </div>

      {/* --- Architectural Grid Overlay --- */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-between px-6 lg:px-12">
        <div className="w-[1px] h-full bg-white/5"></div>
        <div className="w-[1px] h-full bg-white/5 hidden md:block"></div>
        <div className="w-[1px] h-full bg-white/5 hidden lg:block"></div>
        <div className="w-[1px] h-full bg-white/5"></div>
      </div>

      {/* --- Premium Public Navbar (Pristine Approved Version) --- */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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

      {/* --- Vertical Typographic Accent (Editorial Detail) --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="hidden xl:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left z-20"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-bold whitespace-nowrap">
          FurShield Architecture v1.0
        </p>
      </motion.div>

      {/* --- Architectural Hero Content --- */}
      <main className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20">
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Subtle Overline */}
          <motion.div variants={item} className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[1px] bg-camel-400"></span>
            <span className="text-[11px] font-bold tracking-[0.3em] text-camel-300 uppercase">
              Next-Generation Platform
            </span>
          </motion.div>

          {/* Massive Minimalist Typography */}
          <motion.h1 variants={item} className="text-[4rem] sm:text-[5.5rem] lg:text-[7rem] font-display font-bold text-white tracking-tighter leading-[0.9] mb-8">
            Beyond <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-camel-300 to-camel-600 italic font-medium pr-4">Standard</span><br/>
            Pet Care.
          </motion.h1>
          
          <motion.p variants={item} className="text-base sm:text-lg text-white/70 font-medium max-w-xl leading-relaxed mb-12 pl-1 border-l border-white/20 ml-2">
            An enterprise-grade ecosystem uniting pet owners, clinical veterinarians, and rescue shelters into one meticulously engineered reality.
          </motion.p>

          {/* Bespoke Expanding-Line CTA */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pl-3">
            <Link 
              to="/dashboard" 
              className="group flex items-center gap-5 cursor-pointer"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full border border-camel-500 text-camel-400 group-hover:bg-camel-500 group-hover:text-white transition-all duration-300">
                <ArrowRight size={18} strokeWidth={2} className="group-hover:-rotate-45 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white group-hover:text-camel-300 transition-colors">
                  Initialize Workspace
                </span>
                {/* Animated underline */}
                <div className="h-[2px] w-8 bg-camel-500 mt-1 group-hover:w-full transition-all duration-500 ease-out"></div>
              </div>
            </Link>
          </motion.div>

        </motion.div>
      </main>
      
    </div>
  );
}
