'use client';

import React, { useEffect, useState } from 'react';
import { Share2, Sparkles, Flame, User, ArrowRight } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/lib/skills/taxonomy';

interface Trail {
  id: string;
  title: string;
  author_name: string;
  description: string;
  sparks_count: number;
  skills: any[];
}

interface TrailsExplorerProps {
  onSelectTrailSkill: (skill: any) => void;
}

export function TrailsExplorer({ onSelectTrailSkill }: TrailsExplorerProps) {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [litTrailIds, setLitTrailIds] = useState<Set<string>>(new Set());

  const fetchTrails = () => {
    fetch('/api/trails')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setTrails(data.trails || []))
      .catch((err) => console.error('Failed to load trails:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrails();
  }, []);

  const handleLightTrail = async (trailId: string) => {
    if (litTrailIds.has(trailId)) return;

    setLitTrailIds((prev) => new Set(prev).add(trailId));
    setTrails((prev) =>
      prev.map((t) => (t.id === trailId ? { ...t, sparks_count: t.sparks_count + 1 } : t))
    );

    try {
      await fetch('/api/trails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trailId }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-white/10 text-left">
        <div className="flex items-center space-x-1.5 text-amber-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
          <Share2 className="w-3.5 h-3.5" />
          <span>Shared Knowledge Trails</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Leaving Trails to Light the Way</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Growth should never remain an isolated journey. Here are pathways blazed through real-world trial,
          revealing how different skills interlock to overcome common human, technical, and creative challenges.
        </p>
      </div>

      {/* Trails Grid (1 column on mobile/portrait, 2 columns on tablet/desktop/unfolded folding) */}
      {loading ? (
        <div className="py-16 text-center text-xs sm:text-sm text-slate-500">Discovering shared trails...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {trails.map((trail) => {
            const isLit = litTrailIds.has(trail.id);
            return (
              <div
                key={trail.id}
                className="flex flex-col justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0d131f]/80 border border-white/10 hover:border-amber-500/30 transition-all glass-panel-hover"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 mb-2">
                    <span className="flex items-center space-x-1.5 font-medium text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{trail.author_name}</span>
                    </span>

                    <button
                      onClick={() => handleLightTrail(trail.id)}
                      className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        isLit
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                          : 'bg-white/5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10'
                      }`}
                    >
                      <Flame className={`w-3.5 h-3.5 ${isLit ? 'text-amber-400 animate-pulse' : ''}`} />
                      <span>{trail.sparks_count} Sparks</span>
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{trail.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">{trail.description}</p>

                  {/* Skills along this pathway */}
                  <div className="mt-4 sm:mt-5">
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 sm:mb-2">
                      Path of Blooms:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {trail.skills.map((skill: any, idx: number) => {
                        const cat =
                          SKILL_CATEGORIES[skill.category as keyof typeof SKILL_CATEGORIES] ||
                          SKILL_CATEGORIES.craft;
                        return (
                          <React.Fragment key={skill.id}>
                            <button
                              onClick={() => onSelectTrailSkill(skill)}
                              className={`text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 ${cat.bgClass} ${cat.borderClass}`}
                              title={`Inspect ${skill.name}`}
                            >
                              {skill.name}
                            </button>
                            {idx < trail.skills.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-slate-600 inline shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
                  <span className="italic text-[10px] sm:text-[11px]">"Grow forward. Light the way."</span>
                  <button
                    onClick={() => handleLightTrail(trail.id)}
                    className="text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1 transition-colors active:scale-95"
                  >
                    <span>{isLit ? 'Trail Illuminated' : 'Light this Trail'}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
