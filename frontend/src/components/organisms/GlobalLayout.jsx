import { Outlet } from 'react-router-dom';

export default function GlobalLayout() {
  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden">
      {/* Sidebar Placeholder: Hidden on mobile, fixed width on desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
            FurShield<span className="text-forest-600">.</span>
          </span>
        </div>
        <nav className="flex-1 p-4 text-slate-500 text-sm">
          [Navigation goes here]
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Top Header Placeholder */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-20">
          <div className="md:hidden font-display font-bold text-lg text-slate-900">
            FurShield<span className="text-forest-600">.</span>
          </div>
          <div className="hidden md:block text-sm text-slate-500">Global Search & Topbar</div>
        </header>

        {/* Dynamic Route Content Injected Here */}
        <div className="flex-1 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
