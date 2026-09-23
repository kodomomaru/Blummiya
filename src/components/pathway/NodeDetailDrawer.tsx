'use client';

import React, { useEffect, useState } from 'react';
import { X, Sparkles, Calendar, BookOpen, ArrowUpRight, Award, Compass } from 'lucide-react';
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
        // Find moments that touched this skill
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
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-[#0c121e]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${catInfo.bgClass} ${catInfo.borderClass}`}
              >
                {catInfo.label}
              </span>
              {skill.is_tacit === 1 && (
                <span className="flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Hidden Tacit Skill</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mt-2 tracking-tight">{skill.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skill Radiance & Bloom Gauge */}
        <div className="my-6 p-4 rounded-xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
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
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Nature of Mastery
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">{skill.description}</p>
        </div>

        {/* Chronicled Moments that ignited this skill */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chronicled Lineage ({skill.moments_count} moments)</span>
            </h3>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Unearthing historical rings...</div>
          ) : moments.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-700/60 text-center">
              <p className="text-xs text-slate-400">
                This skill is currently anchored by foundation seed data. Ignite a spark to add your own personal narrative!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {moments.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="capitalize px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]">
                      {m.context}
                    </span>
                    <span className="flex items-center space-x-1 text-[10px]">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(m.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200">{m.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{m.narrative}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10 mt-6">
        <button
          onClick={() => onAddSpark(skill.name)}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-medium text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chronicle Another Moment for {skill.name}</span>
        </button>
      </div>
    </div>
  );
}

