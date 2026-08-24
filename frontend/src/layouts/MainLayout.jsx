import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Shield, Heart, Mail, Phone, MapPin } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-soft font-sans">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-brand-darker text-slate-300 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-brand-dark text-white p-2.5 rounded-2xl shadow-sm">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Fur<span className="text-brand-sage">Shield</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Every Paw & Wing. Premium MERN Pet Care Platform unifying Owners, Licensed Veterinarians, and Animal Rescue Shelters.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Platform Links</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link to="/" className="hover:text-brand-sage transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-brand-sage transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-sage transition-colors">Contact Support</Link></li>
              <li><Link to="/shop" className="hover:text-brand-sage transition-colors">Curated Marketplace</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Role Portals</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><Link to="/owner-dashboard" className="hover:text-brand-sage transition-colors">Pet Owner Portal</Link></li>
              <li><Link to="/vet-dashboard" className="hover:text-brand-sage transition-colors">Veterinarian Portal</Link></li>
              <li><Link to="/shelter-dashboard" className="hover:text-brand-sage transition-colors">Shelter & Adoption Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate-300 font-medium">
              <li className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-brand-sage" />
                <span>123 Pet Care Way, Tech City</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-brand-sage" />
                <span>+1 (800) 555-FURCARE</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-brand-sage" />
                <span>support@furshield.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-emerald-900/60 text-center text-xs text-slate-400 font-medium flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} FurShield Pet Care Platform. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for <Heart className="w-4 h-4 text-emerald-400 fill-current" /> Every Companion Pet
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
