import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowRight, PlayCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans overflow-hidden">
      
      {/* --- Video Background Section --- */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder Video - Will be replaced by AI generated video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          {/* Using a generic high-quality pet video placeholder for scaffolding */}
          <source src="https://cdn.pixabay.com/video/2021/08/04/83908-584742637_large.mp4" type="video/mp4" />
        </video>
        
        {/* Warm Overlay to match the Espresso/Camel theme and ensure text contrast */}
        <div className="absolute inset-0 bg-espresso-900/60 mix-blend-multiply"></div>
        {/* Additional gradient for bottom fading */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-transparent to-transparent"></div>
      </div>

      {/* --- Public Transparent Navbar --- */}
      <header className="relative z-10 w-full px-6 py-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-camel-600 flex items-center justify-center shadow-lg">
            <HeartHandshake size={20} className="text-white" />
          </div>
          <span className="font-display font-extrabold text-2xl text-white tracking-tight drop-shadow-md">
            FurShield<span className="text-camel-500">.</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium text-sm">
          <a href="#features" className="hover:text-camel-400 transition-colors">Features</a>
          <a href="#about" className="hover:text-camel-400 transition-colors">Our Mission</a>
          <a href="#contact" className="hover:text-camel-400 transition-colors">Contact</a>
        </nav>

        <div>
          <Link 
            to="/dashboard" 
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-sm transition-all flex items-center gap-2"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* --- Hero Content --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-[-80px]">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-camel-500/20 border border-camel-400/30 backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-camel-400 animate-pulse"></span>
          <span className="text-xs font-bold text-camel-100 tracking-wide uppercase">Next-Gen Pet Care Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
          For tails that tell <br/>
          <span className="text-camel-400">beautiful stories.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto mb-10 drop-shadow-md leading-relaxed">
          Comprehensive health tracking, veterinary integration, and unified shelter management. Experience the future of animal welfare today.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            to="/dashboard" 
            className="w-full sm:w-auto px-8 py-4 bg-camel-600 hover:bg-camel-500 text-white rounded-full font-bold text-base transition-all shadow-[0_0_40px_rgba(186,127,72,0.4)] hover:shadow-[0_0_60px_rgba(186,127,72,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Enter Dashboard <ArrowRight size={18} />
          </Link>
          
          <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-base transition-all flex items-center justify-center gap-2">
            <PlayCircle size={18} /> Watch Demo
          </button>
        </div>
        
      </main>
      
    </div>
  );
}
