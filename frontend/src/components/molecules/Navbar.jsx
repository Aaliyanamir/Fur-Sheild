import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, Bell, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../atoms/Button';

export default function Navbar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Veterinarian', path: '/vet', icon: Stethoscope },
    { name: 'Shelter', path: '/shelter', icon: HeartHandshake },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold font-display leading-none">F</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              FurShield<span className="text-brand-600">.</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center gap-1 px-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-brand-50 text-brand-700 shadow-sm" 
                      : "text-slate-500 hover:text-brand-600 hover:bg-slate-50"
                  )}
                >
                  <Icon size={16} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="relative p-2 text-slate-400 hover:text-brand-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-brand-100 to-brand-50 border border-brand-200 flex items-center justify-center ml-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-bold text-brand-700">RH</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
