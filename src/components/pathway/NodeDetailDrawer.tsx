'use client';

import React, { useEffect, useState } from 'react';
import { X, Sparkles, Calendar, BookOpen, Compass } from 'lucide-react';
import { PathwaySkill } from './PathwayCanvas';
import { SKILL_CATEGORIES } from '@/lib/skills/taxonomy';

interface NodeDetailDrawerProps {
  skill: PathwaySkill | null;
  onClose: () => void;
  onAddSpark: (skillName: string) => void;
}

export function NodeDetailDrawer({
  skill,
  onClose,
  onAddSpark,
}: NodeDetailDrawerProps) {
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!skill) return;

    setLoading(true);
    fetch('/api/moments')
      .then((res) => res.json())
      .then((data) => {
        const related = (data.moments || []).filter((m: any) =>
          m.skills?.some((s: any) => s.name.toLowerCase() === skill.name.toLowerCase())
        );
        setMoments(related);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [skill]);

  if (!skill) return null;

  const catInfo = SKILL_CATEGORIES[skill.category] || SKILL_CATEGORIES.craft;

  const getBloomStageName = (radiance: number) => {
    if (radiance >= 75) return { name: 'Radiant Beacon', desc: 'A beacon of mastery that naturally guides and anchors others.' };
    if (radiance >= 50) return { name: 'Full Bloom', desc: 'Thriving tactical fluency developed through repetitive real-world trial.' };
    if (radiance >= 25) return { name: 'Living Sprout', desc: 'Consistently nurtured instinct taking deep root.' };
    return { name: 'Awakened Seed', desc: 'Freshly illuminated tacit skill beginning to unfurl.' };
  };

  const stage = getBloomStageName(skill.radiance);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer: Bottom-sheet on mobile/portrait (<sm), Right slide-over on tablet/desktop (sm+) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${skill.name} details`}
        className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:left-auto sm:right-0 z-50 w-full sm:w-[460px] max-h-[88dvh] sm:max-h-full rounded-t-3xl sm:rounded-none bg-[#0c121e]/98 backdrop-blur-2xl border-t sm:border-t-0 sm:border-l border-white/15 shadow-2xl p-5 sm:p-6 overflow-y-auto flex flex-col justify-between animate-slide-up sm:animate-none pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <div>
          {/* Mobile Bottom-sheet Pull Bar */}
          <div className="w-12 h-1 bg-slate-600/70 rounded-full mx-auto mb-3 sm:hidden" />

          {/* Header */}
          <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-white/10">
            <div className="pr-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full border ${catInfo.bgClass} ${catInfo.borderClass}`}
                >
                  {catInfo.label.split('&')[0]}
                </span>
                {skill.is_tacit === 1 && (
                  <span className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Tacit Skill</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 tracking-tight">
                {skill.name}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 -mr-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all touch-manipulation"
              aria-label="Close skill details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Skill Radiance & Bloom Gauge */}
          <div className="my-4 sm:my-6 p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Bloom Stage
              </span>
              <span className="text-xs font-medium text-emerald-400 font-mono">
                {Math.round(skill.radiance)}% Radiance
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-100 flex items-center space-x-1.5">
              <span>{stage.name}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{stage.desc}</p>

            {/* Bioluminescent Progress Track */}
            <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 shadow-glow-sm transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(8, skill.radiance))}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Nature of Mastery
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{skill.description}</p>
          </div>

          {/* Chronicled Moments that ignited this skill */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lineage ({skill.moments_count} moments)</span>
              </h3>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-500">Unearthing historical rings...</div>
            ) : moments.length === 0 ? (
              <div className="p-3.5 rounded-xl border border-dashed border-slate-700/60 text-center">
                <p className="text-xs text-slate-400">
                  This skill is currently anchored by foundation seed data. Ignite a spark to add your own personal narrative!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[35vh] sm:max-h-[38vh] overflow-y-auto pr-1">
                {moments.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="capitalize px-1.5 py-0.2 rounded bg-white/5 font-mono text-[9px]">
                        {m.context}
                      </span>
                      <span className="flex items-center space-x-1 text-[10px]">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{new Date(m.created_at).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-medium text-slate-200">{m.title}</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-2">{m.narrative}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 mt-4 sm:mt-6">
          <button
            onClick={() => onAddSpark(skill.name)}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-sm active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Chronicle Moment for {skill.name}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
