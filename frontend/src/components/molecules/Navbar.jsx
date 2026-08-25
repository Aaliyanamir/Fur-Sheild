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
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
      
      {/* 
        PERFECT CSS PILL CONTAINER
        No SVG distortion. Perfectly crisp rounded-full pill with overflow-hidden.
      */}
      <header className="relative w-full max-w-[1060px] h-[72px] bg-white rounded-full shadow-[0_8px_30px_rgb(90,56,37,0.06)] border border-camel-100 flex items-center justify-between overflow-hidden pointer-events-auto">
        
        {/* 
          RIGHT ZONE SWOOP BACKGROUND
          Fixed width SVG inside the overflow-hidden container. Never distorts.
        */}
        <div className="absolute top-0 right-0 h-full w-[360px] z-0 pointer-events-none">
          <svg viewBox="0 0 360 72" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="camelSwoop" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FAF7F2" stopOpacity="1" />
                <stop offset="100%" stopColor="#EADDCB" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path 
              d="M0,72 C120,72 160,0 260,0 L360,0 L360,72 Z" 
              fill="url(#camelSwoop)" 
            />
          </svg>
        </div>

        {/* 
          FOREGROUND CONTENT 
        */}
        <div className="relative z-10 flex items-center justify-between w-full h-full px-2">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 pl-5 pr-8">
            <div className="w-9 h-9 rounded-xl bg-camel-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-display font-extrabold text-[20px] text-espresso-900 tracking-tight">
              FurShield<span className="text-camel-500">.</span>
            </span>
          </div>

          {/* Center: Navigation */}
          <nav className="flex items-center gap-1 h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="relative group h-full flex items-center px-4"
                >
                  {({ isActive }) => (
                    <div className="flex items-center gap-2.5">
                      
                      {/* Icon Container */}
                      <div className={cn(
                        "w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300",
                        isActive 
                          ? "bg-white shadow-[0_2px_12px_rgba(90,56,37,0.06)] border border-camel-50 text-camel-700" 
                          : "bg-transparent text-slate-400 group-hover:text-camel-600 group-hover:bg-camel-50/50"
                      )}>
                        <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      
                      {/* Text & Underline */}
                      <span className={cn(
                        "relative text-[15px] font-bold transition-colors duration-300 tracking-wide",
                        isActive ? "text-camel-800" : "text-slate-500 group-hover:text-camel-700"
                      )}>
                        {item.name}
                        
                        {/* 
                          Active Underline
                          Perfectly centered under the text only. Absolute positioned so it never breaks flex alignment.
                        */}
                        <span className={cn(
                          "absolute -bottom-[20px] left-1/2 -translate-x-1/2 h-[3px] rounded-full bg-camel-600 transition-all duration-300",
                          isActive ? "w-[20px] opacity-100" : "w-0 opacity-0"
                        )}></span>
                      </span>
                      
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 pr-3 pl-8">
            <button className="p-2.5 text-espresso-600 hover:text-camel-800 transition-colors rounded-full hover:bg-white/50">
              <Search size={20} strokeWidth={2} />
            </button>
            
            <button className="relative p-2.5 text-espresso-600 hover:text-camel-800 transition-colors rounded-full hover:bg-white/50">
              <Bell size={20} strokeWidth={2} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-accent-500 border-[2.5px] border-[#F6EBE0]"></span>
            </button>
            
            <div className="w-[40px] h-[40px] rounded-full bg-white border border-camel-200 flex items-center justify-center ml-1 cursor-pointer hover:shadow-md transition-all shadow-sm">
              <span className="text-[13px] font-black text-camel-800">RH</span>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
