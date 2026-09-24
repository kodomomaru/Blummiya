'use client';

import React from 'react';
import { Sparkles, Compass, BookOpen, Share2, Flame } from 'lucide-react';

interface NavbarProps {
  activeTab: 'pathway' | 'chronicles' | 'trails';
  setActiveTab: (tab: 'pathway' | 'chronicles' | 'trails') => void;
  onOpenSparkModal: () => void;
  totalRadiance: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenSparkModal,
  totalRadiance,
}: NavbarProps) {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-white/10 glass-panel pt-safe">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Brand */}
          <div
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer shrink-0"
            onClick={() => setActiveTab('pathway')}
          >
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-amber-500/20 border border-emerald-500/30 shadow-glow-sm">
              <span className="text-base sm:text-xl">🌿</span>
              <div className="absolute -inset-0.5 rounded-xl bg-emerald-500/20 blur-sm -z-10 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                  Blummiya
                </span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  v0.1
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden md:block tracking-wide">
                Grow forward. Light the way.
              </p>
            </div>
          </div>

          {/* Desktop / Tablet Navigation tabs (hidden on mobile) */}
          <nav className="hidden sm:flex items-center space-x-1 sm:space-x-2 bg-slate-900/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('pathway')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'pathway'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Living Pathway</span>
            </button>

            <button
              onClick={() => setActiveTab('chronicles')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'chronicles'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Chronicles</span>
            </button>

            <button
              onClick={() => setActiveTab('trails')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'trails'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Shared Trails</span>
            </button>
          </nav>

          {/* Action button & radiance badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Radiance indicator (compact on mobile) */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Radiance:</span>
              <span className="font-semibold text-white">{Math.round(totalRadiance)}</span>
            </div>

            {/* Ignite a Spark button */}
            <button
              onClick={onOpenSparkModal}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
              <span className="whitespace-nowrap">Ignite Spark</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Portrait Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c14]/90 backdrop-blur-xl border-t border-white/10 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
      >
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setActiveTab('pathway')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'pathway'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium leading-none">Pathway</span>
          </button>

          <button
            onClick={() => setActiveTab('chronicles')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'chronicles'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium leading-none">Chronicles</span>
          </button>

          <button
            onClick={() => setActiveTab('trails')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'trails'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium leading-none">Trails</span>
          </button>
        </div>
      </nav>
    </>
  );
}
