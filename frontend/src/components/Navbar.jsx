import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ShoppingBag, User, LogOut, Menu, X, Wand2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleSwitcher from './RoleSwitcher';

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (role === 'owner') navigate('/owner-dashboard');
    else if (role === 'vet') navigate('/vet-dashboard');
    else if (role === 'shelter') navigate('/shelter-dashboard');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-card font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-brand-dark text-white p-2.5 rounded-2xl shadow-sm">
              <Shield className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Fur<span className="text-brand-dark">Shield</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-brand-dark font-bold text-sm transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-slate-700 hover:text-brand-dark font-bold text-sm transition-colors">
              About Us
            </Link>
            <Link to="/avatar-studio" className="text-slate-700 hover:text-brand-dark font-bold text-sm transition-colors flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-brand-dark" />
              AI Studio
            </Link>
            <Link to="/contact" className="text-slate-700 hover:text-brand-dark font-bold text-sm transition-colors">
              Contact Us
            </Link>
            <Link to="/shop" className="text-slate-700 hover:text-brand-dark font-bold text-sm transition-colors flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-brand-dark" />
              Pet Marketplace
            </Link>
          </div>

          {/* Custom Role Switcher & Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <RoleSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDashboardRedirect}
                  className="bg-brand-dark hover:bg-brand-darker text-white px-5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-red-600 p-2 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-brand-sage text-brand-dark hover:bg-emerald-200 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  Explore Features
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-dark hover:bg-brand-darker text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-900 p-2 rounded-xl focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-bold text-slate-700 hover:bg-bg-soft"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-bold text-slate-700 hover:bg-bg-soft"
          >
            About Us
          </Link>
          <Link
            to="/avatar-studio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-bold text-slate-700 hover:bg-bg-soft"
          >
            AI Studio
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-bold text-slate-700 hover:bg-bg-soft"
          >
            Contact Us
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-bold text-slate-700 hover:bg-bg-soft"
          >
            Pet Marketplace
          </Link>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <RoleSwitcher />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDashboardRedirect();
              }}
              className="w-full bg-brand-dark text-white py-3 rounded-xl text-center font-extrabold text-xs"
            >
              Go to Dashboard ({role.toUpperCase()})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
