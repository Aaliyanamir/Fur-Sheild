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
        Container with precise drop-shadow. 
        The SVG inside will cast this shadow naturally outlining the custom curves.
      */}
      <header className="relative w-full max-w-5xl h-[80px] pointer-events-auto filter drop-shadow-[0_12px_24px_rgba(90,56,37,0.06)]">
        
        {/* EXACT GEOMETRY: SVG Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <svg viewBox="0 0 1024 80" className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rightZone" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F9F6F0" stopOpacity="1" />
                <stop offset="100%" stopColor="#E4D1B9" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            
            {/* Main White Body with Left/Right Thin zones and Center Deep zone */}
            <path d="
              M 24 0
              L 1000 0
              C 1013.25 0, 1024 10.75, 1024 24
              L 1024 36
              C 1024 49.25, 1013.25 60, 1000 60
              L 800 60
              C 760 60, 740 80, 700 80
              L 300 80
              C 260 80, 240 60, 200 60
              L 24 60
              C 10.75 60, 0 49.25, 0 36
              L 0 24
              C 0 10.75, 10.75 0, 24 0
              Z
            " fill="white" />
            
            {/* The Right-Side Swooping Zone */}
            <path d="
              M 750 0
              C 750 40, 720 80, 700 80
              C 740 80, 760 60, 800 60
              L 1000 60
              C 1013.25 60, 1024 49.25, 1024 36
              L 1024 24
              C 1024 10.75, 1013.25 0, 1000 0
              Z
            " fill="url(#rightZone)" />
          </svg>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex items-start justify-between w-full h-full">
          
          {/* Left: Logo (Centered in the 60px height part) */}
          <div className="flex items-center gap-3 pl-6 pr-8 h-[60px]">
            <div className="w-8 h-8 rounded-lg bg-camel-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-[16px] leading-none">F</span>
            </div>
            <span className="font-display font-bold text-[19px] text-espresso-900 tracking-tight">
              FurShield<span className="text-camel-500">.</span>
            </span>
          </div>

          {/* Center: Navigation (Centered in the 80px height part) */}
          <nav className="flex items-center gap-6 h-[80px] px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="relative group flex items-center justify-center h-full"
                >
                  {({ isActive }) => (
                    <div className="flex items-center gap-2">
                      
                      {/* Icon inside a shadow circle when active */}
                      <div className={cn(
                        "w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all duration-300",
                        isActive 
                          ? "bg-white shadow-[0_2px_10px_rgba(90,56,37,0.08)] border border-slate-50 text-camel-700" 
                          : "bg-transparent text-espresso-400 group-hover:text-camel-600 group-hover:bg-camel-50/50"
                      )}>
                        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      
                      {/* Text & Underline Stack */}
                      <div className="flex flex-col items-center pt-1">
                        <span className={cn(
                          "text-[14px] font-semibold transition-colors duration-300 tracking-tight",
                          isActive ? "text-camel-700" : "text-espresso-500 group-hover:text-camel-700"
                        )}>
                          {item.name}
                        </span>
                        
                        {/* Reference-Perfect Underline centered beneath the text */}
                        <div className="h-[3px] mt-1 flex justify-center w-full">
                          <div className={cn(
                            "h-full rounded-full bg-camel-600 transition-all duration-300",
                            isActive ? "w-[18px] opacity-100" : "w-0 opacity-0"
                          )}></div>
                        </div>
                      </div>
                      
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Actions (Centered in the 60px height part) */}
          <div className="flex items-center gap-3 pr-4 h-[60px]">
            <button className="p-2 text-espresso-600 hover:text-camel-800 transition-colors rounded-full hover:bg-white/40">
              <Search size={18} strokeWidth={2} />
            </button>
            
            <button className="relative p-2 text-espresso-600 hover:text-camel-800 transition-colors rounded-full hover:bg-white/40">
              <Bell size={18} strokeWidth={2} />
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-accent-500 border-2 border-[#F6EBE0]"></span>
            </button>
            
            <div className="w-[34px] h-[34px] rounded-full bg-camel-100/80 border border-camel-200/60 flex items-center justify-center ml-2 cursor-pointer hover:bg-white transition-all shadow-sm text-camel-800">
              <span className="text-[11px] font-bold">RH</span>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
