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
        
        {/* RIGHT ZONE SWOOP BACKGROUND - Perfect SVG curve */}
        <div className="absolute top-0 right-0 h-full w-[360px] z-0 pointer-events-none">
          <svg viewBox="0 0 360 72" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="camelSwoop" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F9F6F0" stopOpacity="1" />
                <stop offset="100%" stopColor="#E4D1B9" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path 
              d="M0,72 C120,72 160,0 260,0 L360,0 L360,72 Z" 
              fill="url(#camelSwoop)" 
            />
          </svg>
        </div>

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

          {/* Center: Navigation (AI reference stacked layout with simple sans font and rough rectangle brushstroke) */}
          <nav className="flex items-center gap-6 h-full pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="relative group h-full flex items-center justify-center px-1"
                >
                  {({ isActive }) => (
                    <div className="flex flex-col items-center justify-center gap-[3px]">
                      
                      {/* Top Icon */}
                      <Icon 
                        size={21} 
                        strokeWidth={1.5} 
                        className={cn(
                          "transition-colors duration-300",
                          isActive ? "text-camel-900" : "text-espresso-400 group-hover:text-camel-600"
                        )}
                      />
                      
                      {/* Bottom Text with Hand-Painted Marker SVG */}
                      <div className="relative px-3 py-0.5 flex items-center justify-center">
                        {/* Active Brushstroke */}
                        {isActive && (
                          <svg 
                            className="absolute inset-0 w-full h-full text-camel-200 scale-x-[1.25] scale-y-[1.1] -z-10 drop-shadow-sm opacity-90" 
                            preserveAspectRatio="none" 
                            viewBox="0 0 100 30"
                          >
                            <path 
                              d="M 3,6 C 20,2 40,7 60,3 S 80,8 97,5 C 98,12 95,20 96,25 C 80,28 60,23 40,27 S 20,22 4,24 C 2,18 5,10 3,6 Z" 
                              fill="currentColor" 
                            />
                          </svg>
                        )}
                        {/* Hover Brushstroke */}
                        {!isActive && (
                          <svg 
                            className="absolute inset-0 w-full h-full text-camel-100 scale-x-[1.25] scale-y-[1.1] -z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-300" 
                            preserveAspectRatio="none" 
                            viewBox="0 0 100 30"
                          >
                            <path 
                              d="M 3,6 C 20,2 40,7 60,3 S 80,8 97,5 C 98,12 95,20 96,25 C 80,28 60,23 40,27 S 20,22 4,24 C 2,18 5,10 3,6 Z" 
                              fill="currentColor" 
                            />
                          </svg>
                        )}
                        <span 
                          className={cn(
                            "relative z-10 text-[13px] tracking-wide transition-colors duration-300",
                            isActive ? "text-camel-900 font-bold" : "text-espresso-600 font-semibold group-hover:text-camel-800"
                          )}
                        >
                          {item.name}
                        </span>
                      </div>
                      
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
