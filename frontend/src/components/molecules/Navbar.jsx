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
        Fixed height wrapper — SVG dimensions are anchored to this.
        The wave dip creates the visual depth that makes the logo/nav sit at different vertical levels.
      */}
      <header className="relative w-full max-w-6xl h-[72px] flex items-center pointer-events-auto">

        {/* ── Custom SVG Container ────────────────────────────────────────
            Two paths:
            1. Main white shape — rounded pill left/right, organic wave dip at center-bottom.
            2. Sage green zone — right-side organic blob for the action buttons, matching the
               reference image's distinctive sage/mint right section.
        ──────────────────────────────────────────────────────────────── */}
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-[0_8px_24px_rgba(90,56,37,0.07)]"
          viewBox="0 0 1200 72"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main white pill body with wave bottom */}
          <path
            d="
              M36,0
              H1164 C1184,0 1200,16 1200,36
              C1200,56 1184,72 1164,72
              H870
              C830,72 815,55 780,55
              C730,55 700,72 660,72
              H36 C16,72 0,56 0,36
              C0,16 16,0 36,0 Z
            "
            fill="white"
          />
          {/* Sage green right-side zone — matches reference image's tinted action area */}
          <path
            d="
              M870,72
              H1164 C1184,72 1200,56 1200,36
              C1200,16 1184,0 1164,0
              H960
              C920,0 895,18 870,36
              C848,52 845,65 870,72 Z
            "
            fill="#DCF0E4"
            opacity="0.85"
          />
        </svg>

        {/* ── Foreground Content ─────────────────────────────────────── */}
        <div className="relative z-10 flex items-center w-full px-4">

          {/* Logo — left section, sits at standard vertical center */}
          <div className="flex-shrink-0 flex items-center gap-2.5 pr-8">
            <div className="w-9 h-9 rounded-[10px] bg-camel-600 flex items-center justify-center shadow-sm">
              <HeartHandshake size={18} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-espresso-900 tracking-tight">
              FurShield<span className="text-camel-500">.</span>
            </span>
          </div>

          {/* Nav — pushed slightly down by pb-3 to sit in the wave dip visually */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 pb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "group relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300",
                    isActive
                      ? "text-espresso-900"
                      : "text-espresso-500 hover:text-espresso-800"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={16} className="shrink-0" />
                      <span>{item.name}</span>
                      {/* Active underline — matching the reference image's green underline */}
                      {isActive && (
                        <span className="absolute -bottom-0.5 left-3 right-3 h-[2.5px] rounded-full bg-green-500" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right actions — sit over the sage green SVG zone */}
          <div className="flex items-center gap-2 ml-auto pr-2">
            <button className="p-2 text-espresso-800 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50">
              <Search size={19} />
            </button>

            <button className="relative p-2 text-espresso-800 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50">
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            <div className="w-9 h-9 rounded-full bg-white border border-camel-200 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 hover:shadow-md transition-all ml-1">
              <span className="text-xs font-black text-camel-800">RH</span>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
