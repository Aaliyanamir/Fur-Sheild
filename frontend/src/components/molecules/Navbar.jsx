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
        Flawless CSS geometry with rounded-[40px] and overflow-hidden to contain the right-side swoop.
      */}
      <header className="relative w-full max-w-5xl h-[72px] bg-white rounded-[40px] shadow-[0_8px_30px_rgb(90,56,37,0.06)] border border-camel-100 flex items-center justify-between overflow-hidden pointer-events-auto">
        
        {/* 
          The Soft Right-Side Swoop
          Using a massive, perfectly round gradient circle to create that distinct zone smoothly.
        */}
        <div className="absolute -top-[120px] -right-[40px] w-[400px] h-[400px] bg-gradient-to-bl from-camel-100/70 to-camel-50/30 rounded-full pointer-events-none z-0"></div>

        {/* Foreground Content */}
        <div className="relative z-10 flex items-center justify-between w-full h-full px-2">
          
          {/* Left: Logo Area */}
          <div className="flex items-center gap-3 pl-4 pr-8">
            <div className="w-9 h-9 rounded-xl bg-camel-600 flex items-center justify-center shadow-sm">
              <HeartHandshake size={18} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-espresso-900 tracking-tight">
              FurShield<span className="text-camel-500">.</span>
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
                        {/* Icon inside a soft circle when active */}
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                          isActive 
                            ? "bg-camel-50 text-camel-700 shadow-sm" 
                            : "bg-transparent text-espresso-400 group-hover:text-camel-500 group-hover:bg-camel-50/50"
                        )}>
                          <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        {/* Nav Text */}
                        <span className={cn(
                          "text-sm font-semibold transition-colors duration-300 pr-1",
                          isActive ? "text-camel-700" : "text-espresso-500 group-hover:text-camel-600"
                        )}>
                          {item.name}
                        </span>
                      </div>
                      
                      {/* Floating Underline */}
                      <div className={cn(
                        "absolute -bottom-2.5 h-[3px] rounded-full bg-camel-600 transition-all duration-300",
                        isActive ? "w-6 opacity-100" : "w-0 opacity-0"
                      )}></div>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Actions (Floating over the subtle camel gradient) */}
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
