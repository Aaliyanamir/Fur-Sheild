import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowRight, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-espresso-900 text-camel-50 pt-24 pb-8 overflow-hidden rounded-t-[3rem] mt-12 sm:mt-24 border-t border-espresso-900/10">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-camel-900/30 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Top Section: CTA & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 border-b border-white/10 pb-16">
          <div>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
              Ready to transform <span className="text-camel-400 italic">pet care?</span>
            </h3>
            <p className="text-camel-100/70 text-lg max-w-md font-medium">
              Join the ecosystem today and experience the future of veterinary and shelter management.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md lg:ml-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-camel-400 transition-colors shadow-inner font-medium"
            />
            <button className="shrink-0 bg-camel-600 hover:bg-camel-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_5px_20px_rgba(186,127,72,0.3)] hover:shadow-[0_10px_30px_rgba(186,127,72,0.5)] flex items-center justify-center gap-2 hover:-translate-y-0.5">
              Subscribe <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <PawPrint className="text-camel-500" size={24} />
              <span className="font-display font-bold text-xl text-white tracking-tight">FurShield.</span>
            </div>
            <p className="text-white/60 text-sm font-medium leading-relaxed mb-6 max-w-xs">
              Uniting pet owners, veterinarians, and shelters into one seamless digital ecosystem.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-camel-600 hover:text-white transition-colors border border-white/10"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-camel-600 hover:text-white transition-colors border border-white/10"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-camel-600 hover:text-white transition-colors border border-white/10"><Linkedin size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link to="/dashboard" className="hover:text-camel-400 transition-colors">Owner Dashboard</Link></li>
              <li><Link to="/vet" className="hover:text-camel-400 transition-colors">Veterinary Hub</Link></li>
              <li><Link to="/shelter" className="hover:text-camel-400 transition-colors">Shelter Portal</Link></li>
              <li><Link to="/shop" className="hover:text-camel-400 transition-colors">Integrated Pharmacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><a href="#" className="hover:text-camel-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-camel-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-camel-400 transition-colors">Partner Network</a></li>
              <li><a href="#" className="hover:text-camel-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><a href="#" className="hover:text-camel-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-camel-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-camel-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-camel-400 transition-colors">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-sm text-white/40 font-medium">
          <p>© 2026 FurShield by Raza Hussain. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">System Status</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>

      {/* Enormous Typographic Background */}
      <div className="absolute bottom-[-10%] left-0 right-0 overflow-hidden flex justify-center pointer-events-none select-none z-0">
        <span className="text-[18vw] font-display font-black leading-[0.75] text-white/[0.03] tracking-tighter">
          FURSHIELD
        </span>
      </div>
      
    </footer>
  );
}
