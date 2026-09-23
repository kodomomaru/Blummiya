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
    <header className="sticky top-0 z-30 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('pathway')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-amber-500/20 border border-emerald-500/30 shadow-glow-sm">
            <span className="text-xl">🌿</span>
            <div className="absolute -inset-0.5 rounded-xl bg-emerald-500/20 blur-sm -z-10 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">Blummiya</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                v0.1
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block tracking-wide">Grow forward. Light the way.</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/60 p-1 rounded-xl border border-white/5">
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
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Pathway Radiance:</span>
            <span className="font-semibold text-white">{Math.round(totalRadiance)}</span>
          </div>

          <button
            onClick={onOpenSparkModal}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Ignite a Spark</span>
          </button>
        </div>
      </div>
    </header>
  );
}

