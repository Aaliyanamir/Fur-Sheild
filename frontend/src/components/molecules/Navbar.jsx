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
      
      {/* Outer Crisp White Container (Image 2 style) */}
      <header className="w-full max-w-6xl bg-white border border-camel-100/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-1.5 flex items-center justify-between pointer-events-auto">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center gap-2.5 pl-4 pr-6">
          <div className="w-8 h-8 rounded-[10px] bg-camel-600 flex items-center justify-center shadow-md">
            <HeartHandshake size={18} className="text-white" />
          </div>
          <span className="font-display font-extrabold text-xl text-espresso-900 tracking-tight">
            FurShield<span className="text-camel-500">.</span>
          </span>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                  isActive 
                    ? "bg-camel-50 text-camel-700 shadow-sm"
                    : "text-espresso-500 hover:text-camel-600 hover:bg-camel-50/50"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={cn("shrink-0 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Actions inside the Watercolor Wash Zone */}
        <div className="flex items-center gap-3 pl-6 pr-2 py-1.5 ml-auto rounded-full bg-watercolor border border-white/50 shadow-inner">
          <button className="p-2 text-camel-900 hover:text-camel-700 transition-colors rounded-full hover:bg-white/40">
            <Search size={20} />
          </button>
          
          <button className="relative p-2 text-camel-900 hover:text-camel-700 transition-colors rounded-full hover:bg-white/40">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-accent-500 border-2 border-[#f6e9de]"></span>
          </button>
          
          <div className="w-9 h-9 rounded-full bg-white border-2 border-white flex items-center justify-center ml-2 cursor-pointer shadow-sm hover:scale-105 transition-transform">
            <span className="text-xs font-black text-camel-800">RH</span>
          </div>
        </div>

      </header>
    </div>
  );
}
