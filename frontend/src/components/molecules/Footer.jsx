import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowRight, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-espresso-900 text-camel-50 pt-16 pb-6 overflow-hidden rounded-t-[2.5rem] mt-12 sm:mt-24 border-t border-espresso-900/10">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-camel-900/20 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Top Section: Compact Newsletter */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12 border-b border-white/10 pb-10">
          <div className="text-center lg:text-left">
            <h3 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
              Join the <span className="text-camel-400 italic">ecosystem.</span>
            </h3>
            <p className="text-camel-100/70 text-sm max-w-sm font-medium">
              Get the latest updates on pet care tech and new features.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-camel-400 transition-colors shadow-inner text-sm font-medium"
            />
            <button className="shrink-0 bg-camel-600 hover:bg-camel-500 text-white px-6 py-3 rounded-full font-bold transition-all shadow-[0_5px_15px_rgba(186,127,72,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
              Subscribe <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Middle Section: Condensed Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-16">
          
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="text-camel-500" size={22} />
              <span className="font-display font-bold text-lg text-white tracking-tight">FurShield.</span>
            </div>
            <p className="text-white/60 text-xs font-medium leading-relaxed mb-6 max-w-xs">
              Uniting pet owners, veterinarians, and shelters into one seamless digital ecosystem.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-camel-600 hover:text-white transition-colors border border-white/10"><Twitter size={14} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-camel-600 hover:text-white transition-colors border border-white/10"><Instagram size={14} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-camel-600 hover:text-white transition-colors border border-white/10"><Linkedin size={14} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-5 tracking-wide uppercase text-xs">Platform</h4>
            <ul className="space-y-3 text-xs font-medium text-white/60">
              <li><Link to="/dashboard" className="hover:text-camel-400 transition-colors">Owner Dashboard</Link></li>
              <li><Link to="/vet" className="hover:text-camel-400 transition-colors">Veterinary Hub</Link></li>
              <li><Link to="/shelter" className="hover:text-camel-400 transition-colors">Shelter Portal</Link></li>
              <li><Link to="/shop" className="hover:text-camel-400 transition-colors">Pet Shop</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 tracking-wide uppercase text-xs">Resources & Legal</h4>
            <ul className="space-y-3 text-xs font-medium text-white/60">
              <li><Link to="/blog" className="hover:text-camel-400 transition-colors">Blog & News</Link></li>
              <li><Link to="/about" className="hover:text-camel-400 transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-camel-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-camel-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/10 text-xs text-white/40 font-medium z-10 relative">
          <p>© 2026 FurShield by Raza Hussain. All rights reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <Link to="/status" className="hover:text-white transition-colors">System Status</Link>
          </div>
        </div>
      </div>

      {/* Enormous Typographic Background - Scaled down slightly to prevent overflow issues */}
      <div className="absolute bottom-[-5%] left-0 right-0 overflow-hidden flex justify-center pointer-events-none select-none z-0">
        <span className="text-[15vw] font-display font-black leading-[0.75] text-white/[0.02] tracking-tighter">
          FURSHIELD
        </span>
      </div>
      
    </footer>
  );
}
