import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, Bell, Search, PawPrint } from 'lucide-react';
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
      
      {/* Main Pristine Container - Strictly 72px for perfect curve containment */}
      <header className="relative w-full max-w-5xl h-[72px] bg-white rounded-[40px] shadow-[0_8px_30px_rgb(90,56,37,0.06)] border border-camel-100 flex items-center justify-between overflow-hidden pointer-events-auto">
        
        {/* The Soft Right-Side Swoop */}
        <div className="absolute -top-[120px] -right-[40px] w-[400px] h-[400px] bg-gradient-to-bl from-camel-100/70 to-camel-50/30 rounded-full pointer-events-none z-0"></div>

        {/* Foreground Content */}
        <div className="relative z-10 flex items-center justify-between w-full h-full px-2">
          
          {/* Left: Logo (Watercolor Splash + Script Font + Tagline, mapped to Camel theme) */}
          <div className="flex items-center gap-3 pl-4 pr-8">
            <div className="relative w-11 h-11 flex items-center justify-center">
              {/* Watercolor Splash Blobs in Camel Theme */}
              <div className="absolute inset-0 bg-camel-200 rounded-full mix-blend-multiply filter blur-[3px] opacity-80 scale-110 rotate-12"></div>
              <div className="absolute inset-1 bg-camel-300 rounded-full mix-blend-multiply filter blur-[4px] opacity-60 -rotate-12"></div>
              <div className="absolute -inset-0.5 bg-camel-100 rounded-full mix-blend-multiply filter blur-[2px] opacity-70 rotate-45 scale-105"></div>
              
              <PawPrint size={22} className="relative z-10 text-espresso-900" fill="currentColor" />
            </div>
            
            <div className="flex flex-col justify-center">
              <span 
                className="text-[28px] text-espresso-900 leading-[0.9] tracking-tight"
                style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
              >
                FurShield
              </span>
              <span className="text-[10px] text-espresso-500 font-medium mt-0.5 tracking-wide">
                For tails that tell stories.
              </span>
            </div>
          </div>

          {/* Center: Navigation (Clean side-by-side layout, simple underline active state) */}
          <nav className="flex items-center gap-2 h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="relative group h-full flex items-center px-4"
                >
                  {({ isActive }) => (
                    <div className="flex flex-col items-center justify-center relative h-full">
                      <div className="flex items-center gap-2">
                        <Icon 
                          size={18} 
                          strokeWidth={isActive ? 2.5 : 2}
                          className={cn(
                            "transition-colors duration-300",
                            isActive ? "text-camel-700" : "text-espresso-400 group-hover:text-camel-600"
                          )}
                        />
                        <span className={cn(
                          "text-sm font-semibold transition-colors duration-300",
                          isActive ? "text-camel-800" : "text-espresso-500 group-hover:text-camel-700"
                        )}>
                          {item.name}
                        </span>
                      </div>
                      
                      {/* Floating Underline Only */}
                      <div className={cn(
                        "absolute bottom-[18px] h-[3px] rounded-full bg-camel-600 transition-all duration-300",
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
            <button className="p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50">
              <Search size={18} strokeWidth={2.5} />
            </button>
            
            <button className="relative p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50">
              <Bell size={18} strokeWidth={2.5} />
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-accent-500 border-2 border-[#f6e9de]"></span>
            </button>
            
            <div className="w-10 h-10 rounded-full bg-white border border-camel-200 flex items-center justify-center ml-2 cursor-pointer hover:shadow-md transition-all">
              <span className="text-xs font-bold text-camel-800">RH</span>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
