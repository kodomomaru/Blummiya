'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Flame, Compass, CheckCircle2 } from 'lucide-react';
import { extractHiddenSkills, ExtractionAnalysis } from '@/lib/skills/extractor';
import { SKILL_CATEGORIES } from '@/lib/skills/taxonomy';

interface MomentCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMomentSaved: (data: any) => void;
  defaultSkillName?: string;
}

export function MomentCaptureModal({
  isOpen,
  onClose,
  onMomentSaved,
  defaultSkillName,
}: MomentCaptureModalProps) {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState<'work' | 'life' | 'craft' | 'community'>('work');
  const [narrative, setNarrative] = useState('');
  const [impact, setImpact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [livePreview, setLivePreview] = useState<ExtractionAnalysis | null>(null);
  const [celebrationResult, setCelebrationResult] = useState<any | null>(null);

  // Live detection of hidden skills as user types
  useEffect(() => {
    if (narrative.length > 20 || title.length > 5) {
      const preview = extractHiddenSkills({
        title: title || 'Everyday experience',
        narrative,
        context,
        impact,
      });
      setLivePreview(preview);
    } else {
      setLivePreview(null);
    }
  }, [title, narrative, context, impact]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !narrative.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/moments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          narrative,
          context,
          impact,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCelebrationResult(data);
        onMomentSaved(data);
      } else {
        alert(data.error || 'Failed to save moment');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving spark');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setTitle('');
    setNarrative('');
    setImpact('');
    setLivePreview(null);
    setCelebrationResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0d131f] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Ambient background bloom */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {celebrationResult ? (
          /* Celebration & Growth Revelation Screen */
          <div className="py-6 text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-4 shadow-glow-md">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">Your Pathway Illuminated</h3>
            <p className="text-xs uppercase font-mono tracking-widest text-emerald-400 mt-1">
              Hidden Skills Unveiled
            </p>

            <div className="my-6 p-5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-left">
              <p className="text-xs font-semibold uppercase text-emerald-400 mb-2 flex items-center space-x-1.5">
                <Compass className="w-4 h-4" />
                <span>Blummiya Growth Revelation</span>
              </p>
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "{celebrationResult.analysis.revelation}"
              </p>

              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-xs text-slate-400 font-medium">Activated Blooms:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {celebrationResult.analysis.skills.map((s: any) => {
                    const cat = SKILL_CATEGORIES[s.category as keyof typeof SKILL_CATEGORIES] || SKILL_CATEGORIES.craft;
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cat.bgClass} ${cat.borderClass}`}
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] text-emerald-300 font-mono">+{s.radianceBoost}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-sm shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
            >
              Return to Living Pathway
            </button>
          </div>
        ) : (
          /* Form Input Screen */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Ignite a Spark</h3>
                  <p className="text-xs text-slate-400">Chronicle an everyday moment and reveal its hidden mastery.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Life Sphere
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['work', 'life', 'craft', 'community'] as const).map((ctx) => (
                  <button
                    key={ctx}
                    type="button"
                    onClick={() => setContext(ctx)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all text-center ${
                      context === ctx
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-glow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                    }`}
                  >
                    {ctx === 'work' && '💼 Work'}
                    {ctx === 'life' && '🌿 Life'}
                    {ctx === 'craft' && '🛠️ Craft'}
                    {ctx === 'community' && '🤝 Community'}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                What did you navigate today?
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Navigated tense disagreement during retrospective without finger-pointing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            {/* Narrative */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                The Narrative (Friction & Movement)
              </label>
              <textarea
                required
                rows={3}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Describe what occurred. What was the subtle friction, tension, or surprise, and how did your actions guide the situation?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            {/* Impact (Optional) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                The Shift (Outcome / Ripple effect)
              </label>
              <input
                type="text"
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                placeholder="e.g. Both engineers aligned on a shared test harness; trust felt restored."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500/60 transition-all"
              />
            </div>

            {/* Live Tacit Skills Detector Preview */}
            {livePreview && livePreview.skills.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 animate-fadeIn">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Blummiya Senses Underlying Blooms:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {livePreview.skills.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-800 border border-emerald-500/30 text-emerald-300 font-medium shadow-sm"
                    >
                      <span>{s.name}</span>
                      {s.isTacit && <span className="text-amber-400 font-bold">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="pt-3 flex items-center justify-end space-x-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title || !narrative}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isSubmitting ? 'Lighting Pathway...' : 'Light the Pathway'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

