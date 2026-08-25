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
        Main Pristine Container
        Uses standard rounded-[40px] for a flawless edge. overflow-hidden is key here.
      */}
      <header className="relative w-full max-w-5xl h-[72px] bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-between overflow-hidden pointer-events-auto">
        
        {/* 
          The Internal Right-Side Swooping Curve
          This creates the perfect mathematical curve without messy SVGs.
        */}
        <div className="absolute -top-[150px] -right-[50px] w-[450px] h-[450px] bg-gradient-to-bl from-emerald-100/80 to-emerald-50/30 rounded-full pointer-events-none z-0"></div>

        {/* Foreground Content */}
        <div className="relative z-10 flex items-center justify-between w-full h-full px-2">
          
          {/* Left: Logo (Matching the Blue Box from reference) */}
          <div className="flex items-center gap-3 pl-4 pr-8">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              FurShield<span className="text-indigo-600">.</span>
            </span>
          </div>

          {/* Center: Navigation (Exact Reference Match) */}
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
                        {/* Icon Container: Only white circle if active */}
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                          isActive 
                            ? "bg-white shadow-sm text-emerald-700" 
                            : "bg-transparent text-slate-500 group-hover:text-emerald-600"
                        )}>
                          <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        {/* Text */}
                        <span className={cn(
                          "text-sm font-semibold transition-colors duration-300 pr-1",
                          isActive ? "text-emerald-700" : "text-slate-500 group-hover:text-emerald-600"
                        )}>
                          {item.name}
                        </span>
                      </div>
                      
                      {/* Active Underline (Floating) */}
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

          {/* Right: Actions (Inside the green swoop) */}
          <div className="flex items-center gap-3 pr-2 pl-8 h-full">
            <button className="p-2 text-emerald-900/70 hover:text-emerald-900 transition-colors rounded-full hover:bg-white/40">
              <Search size={18} strokeWidth={2.5} />
            </button>
            
            <button className="relative p-2 text-emerald-900/70 hover:text-emerald-900 transition-colors rounded-full hover:bg-white/40">
              <Bell size={18} strokeWidth={2.5} />
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[#e6f4ed]"></span>
            </button>
            
            <div className="w-10 h-10 rounded-full bg-emerald-100/50 border border-emerald-200/50 flex items-center justify-center ml-2 cursor-pointer hover:bg-white/60 transition-all">
              <span className="text-xs font-bold text-emerald-800">RH</span>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
