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
        Main Navbar Container
        Uses overflow-hidden to keep the watercolor blobs inside the pill shape.
      */}
      <header className="relative w-full max-w-5xl rounded-[2rem] shadow-soft flex items-center justify-between px-3 py-2.5 pointer-events-auto transition-all border border-camel-100/60 bg-white/60 backdrop-blur-xl overflow-hidden">
        
        {/* --- Watercolor Background Texture (Simulating Image 7) --- */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          {/* Left splash */}
          <div className="absolute -top-8 -left-8 w-48 h-48 bg-camel-200/40 rounded-full mix-blend-multiply blur-2xl"></div>
          {/* Right splash (covers the icon area like Image 2) */}
          <div className="absolute -top-10 -right-4 w-64 h-64 bg-camel-300/20 rounded-full mix-blend-multiply blur-3xl"></div>
          {/* Center soft wash */}
          <div className="absolute top-4 left-1/3 w-40 h-40 bg-[#F5F2EB] rounded-full mix-blend-multiply blur-2xl"></div>
        </div>

        {/* --- Foreground Content (z-10 ensures it sits above the texture) --- */}
        <div className="relative z-10 flex items-center justify-between w-full px-3">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2.5 pr-8">
            <div className="w-9 h-9 rounded-[14px] bg-camel-500 flex items-center justify-center shadow-sm">
              <HeartHandshake size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-espresso-900 tracking-tight">
              FurShield<span className="text-camel-500">.</span>
            </span>
          </div>

          {/* Center Navigation (Pill structure like Image 2) */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300",
                    isActive 
                      ? "bg-camel-100/90 text-camel-800 shadow-sm"
                      : "text-espresso-500 hover:text-camel-600 hover:bg-camel-50/50"
                  )}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions & Profile (Integrated softly) */}
          <div className="flex items-center gap-1 pl-8">
            <button className="p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-camel-100/50">
              <Search size={18} />
            </button>
            <button className="relative p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-camel-100/50 mr-2">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 border border-white"></span>
            </button>
            
            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-camel-200/50 border border-camel-200 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-soft transition-all hover:scale-105">
              <span className="text-sm font-bold text-camel-900">RH</span>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
