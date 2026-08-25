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
        h-[80px] gives the SVG room for the wave to breathe.
        pointer-events-auto re-enables interaction on the actual component.
      */}
      <header className="relative w-full max-w-6xl h-[80px] pointer-events-auto">

        {/* ── SVG SHELL ─────────────────────────────────────────────────────
            viewBox: 1200 wide × 80 tall.

            Path 1 (white body):
              - Starts at top-left with a rounded pill cap (r=36).
              - Top edge is FLAT across to the right pill cap.
              - Right pill cap curves down.
              - Bottom-right is HIGHER (sage zone sits taller).
              - A smooth S-wave runs left from ~x=870 to x=260, dipping to y=80 at center.
              - Bottom-left rises back up and closes at the left pill cap.

            Path 2 (sage green right zone):
              - Mirrors the right portion of path 1, filling it with the mint tone.
              - Organic left edge curves inward to create the fluid blob shape.
        ──────────────────────────────────────────────────────────────── */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.06))' }}
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* White pill body with organic wavy bottom */}
          <path
            d="
              M36,0
              H1164 C1184,0 1200,16 1200,36
              C1200,56 1184,72 1164,72
              H870
              C840,72 820,62 790,54
              C755,44 730,80 700,80
              H500
              C470,80 445,44 410,54
              C380,62 360,72 330,72
              H36 C16,72 0,56 0,36
              C0,16 16,0 36,0 Z
            "
            fill="white"
          />

          {/* Sage green right action zone — matches Image 2's mint blob */}
          <path
            d="
              M870,72
              H1164 C1184,72 1200,56 1200,36
              C1200,16 1184,0 1164,0
              H980
              C940,0 910,14 885,32
              C862,48 852,64 870,72 Z
            "
            fill="#D4EDDA"
            opacity="0.9"
          />
        </svg>

        {/* ── FOREGROUND CONTENT ────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center h-full px-4">

          {/* Logo — vertically centered in the pill (standard height zone) */}
          <div className="flex-shrink-0 flex items-center gap-2.5 pr-8">
            <div className="w-9 h-9 rounded-[10px] bg-camel-600 flex items-center justify-center shadow-sm">
              <HeartHandshake size={18} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-espresso-900 tracking-tight">
              FurShield<span className="text-camel-500">.</span>
            </span>
          </div>

          {/* Nav — sits in the visual wave valley, pushed down slightly */}
          <nav className="hidden md:flex items-end flex-1 gap-1 pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "group relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={15} className="shrink-0" />
                      <span>{item.name}</span>
                      {/* Exact match to reference: solid green underline, no pill */}
                      {isActive && (
                        <span className="absolute bottom-0 left-4 right-4 h-[2.5px] rounded-full bg-emerald-500" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right actions — over the sage SVG zone */}
          <div className="flex items-center gap-1.5 ml-auto pr-1">
            <button className="p-2 text-slate-600 hover:text-camel-700 transition-colors rounded-full hover:bg-white/60">
              <Search size={19} />
            </button>

            <button className="relative p-2 text-slate-600 hover:text-camel-700 transition-colors rounded-full hover:bg-white/60">
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center ml-1 cursor-pointer shadow-sm hover:scale-105 hover:shadow-md transition-all">
              <span className="text-xs font-black text-slate-700">RH</span>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
