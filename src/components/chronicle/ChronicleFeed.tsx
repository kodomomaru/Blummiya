'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Sparkles, Compass, Plus, Flame } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/lib/skills/taxonomy';

interface ChronicleFeedProps {
  onOpenSparkModal: () => void;
  refreshTrigger: number;
}

export function ChronicleFeed({ onOpenSparkModal, refreshTrigger }: ChronicleFeedProps) {
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/moments')
      .then((res) => res.json())
      .then((data) => setMoments(data.moments || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Living Chronicle</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">The Tapestry of Everyday Mastery</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Every moment you navigate leaves a growth ring. Here are the everyday actions that lit your constellation.
          </p>
        </div>

        <button
          onClick={onOpenSparkModal}
          className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Chronicle New Spark</span>
        </button>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Unfolding your chronicle...</div>
      ) : moments.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl p-8">
          <p className="text-slate-400 text-sm">No moments chronicled yet.</p>
          <button
            onClick={onOpenSparkModal}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium hover:bg-emerald-500/30 transition-all"
          >
            Ignite your first spark
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {moments.map((moment) => (
            <div
              key={moment.id}
              className="p-6 rounded-2xl bg-[#0d131f]/80 border border-white/10 hover:border-emerald-500/30 transition-all glass-panel-hover"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="capitalize px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] border border-white/5">
                    {moment.context === 'work' && '💼 Work'}
                    {moment.context === 'life' && '🌿 Life'}
                    {moment.context === 'craft' && '🛠️ Craft'}
                    {moment.context === 'community' && '🤝 Community'}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{new Date(moment.created_at).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">{moment.title}</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{moment.narrative}</p>

              {moment.impact && (
                <div className="mt-3 text-xs p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-slate-300">
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] mr-1.5">
                    Shift / Ripple:
                  </span>
                  {moment.impact}
                </div>
              )}

              {/* Revealed Skills Tags */}
              {moment.skills && moment.skills.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Illuminated Skills:</span>
                  </span>
                  {moment.skills.map((s: any, idx: number) => {
                    const cat = SKILL_CATEGORIES[s.category as keyof typeof SKILL_CATEGORIES] || SKILL_CATEGORIES.craft;
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-0.5 rounded-lg border font-medium ${cat.bgClass} ${cat.borderClass}`}
                      >
                        {s.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

