import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, Bell, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Veterinarian', path: '/vet', icon: Stethoscope },
    { name: 'Shelter', path: '/shelter', icon: HeartHandshake },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      
      {/* 
        Main Container: Pristine white pill
      */}
      <header className="relative w-full max-w-5xl h-[72px] bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-between overflow-hidden pointer-events-auto">
        
        {/* 
          THE PERFECT WAVE: Right-side background
          Cubic Bezier (C) curve — precisely calculated to replicate the reference S-wave.
        */}
        <div className="absolute right-0 top-0 h-full w-[350px] z-0 pointer-events-none">
          <svg viewBox="0 0 350 72" className="w-full h-full" preserveAspectRatio="none">
            <path 
              d="M0,72 C100,72 150,0 250,0 L350,0 L350,72 Z" 
              className="fill-emerald-50/80" 
            />
          </svg>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex items-center justify-between w-full h-full px-2">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 pl-4 pr-8">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              FurShield<span className="text-indigo-600">.</span>
            </span>
          </div>

          {/* Center: Navigation */}
          <nav className="flex items-center gap-2 h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="relative group h-full flex items-center px-3"
                >
                  {({ isActive }) => (
                    <div className="flex flex-col items-center justify-center relative">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                          isActive 
                            ? "bg-white shadow-sm text-emerald-700" 
                            : "bg-transparent text-slate-500 group-hover:text-emerald-600"
                        )}>
                          <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={cn(
                          "text-sm font-semibold transition-colors duration-300 pr-1",
                          isActive ? "text-emerald-700" : "text-slate-500 group-hover:text-emerald-600"
                        )}>
                          {item.name}
                        </span>
                      </div>
                      <div className={cn(
                        "absolute -bottom-2.5 h-[3px] rounded-full bg-emerald-700 transition-all duration-300",
                        isActive ? "w-6 opacity-100" : "w-0 opacity-0"
                      )}></div>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 pr-2 pl-8 h-full">
            <button className="p-2 text-emerald-900/70 hover:text-emerald-900 transition-colors rounded-full hover:bg-white/50">
              <Search size={18} strokeWidth={2.5} />
            </button>
            
            <button className="relative p-2 text-emerald-900/70 hover:text-emerald-900 transition-colors rounded-full hover:bg-white/50">
              <Bell size={18} strokeWidth={2.5} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-emerald-50"></span>
            </button>
            
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200/60 flex items-center justify-center ml-2 cursor-pointer hover:bg-white/60 transition-all shadow-sm">
              <span className="text-xs font-bold text-emerald-800">RH</span>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
