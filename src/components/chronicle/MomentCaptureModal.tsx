'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Flame, Compass } from 'lucide-react';
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
  const [title, setTitle] = useState(defaultSkillName ? `Honed ${defaultSkillName} through ` : '');
  const [context, setContext] = useState<'work' | 'life' | 'craft' | 'community'>('work');
  const [narrative, setNarrative] = useState('');
  const [impact, setImpact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [livePreview, setLivePreview] = useState<ExtractionAnalysis | null>(null);
  const [celebrationResult, setCelebrationResult] = useState<any | null>(null);

  // Sync defaultSkillName if changed
  useEffect(() => {
    if (defaultSkillName) {
      setTitle((t) => t || `Deepened ${defaultSkillName} by `);
    }
  }, [defaultSkillName]);

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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl max-h-[92dvh] flex flex-col bg-[#0d131f] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-7 overflow-hidden">
        {/* Ambient background bloom */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {celebrationResult ? (
          /* Celebration & Growth Revelation Screen */
          <div className="py-4 sm:py-6 text-center overflow-y-auto animate-fadeIn pb-safe">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-3 sm:mb-4 shadow-glow-md">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Your Pathway Illuminated</h3>
            <p className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-emerald-400 mt-1">
              Hidden Skills Unveiled
            </p>

            <div className="my-4 sm:my-6 p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-left">
              <p className="text-[11px] sm:text-xs font-semibold uppercase text-emerald-400 mb-2 flex items-center space-x-1.5">
                <Compass className="w-4 h-4" />
                <span>Blummiya Growth Revelation</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{celebrationResult.analysis.revelation}"
              </p>

              <div className="mt-4 pt-3 sm:pt-4 border-t border-white/10">
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Activated Blooms:</span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
            >
              Return to Living Pathway
            </button>
          </div>
        ) : (
          /* Form Input Screen */
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Ignite a Spark</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">Chronicle an everyday moment & reveal hidden mastery.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all touch-manipulation"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-0.5">
              {/* Context Selector (2 columns on mobile/folding, 4 columns on tablet/desktop) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Life Sphere
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  {(['work', 'life', 'craft', 'community'] as const).map((ctx) => (
                    <button
                      key={ctx}
                      type="button"
                      onClick={() => setContext(ctx)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-medium capitalize border transition-all text-center ${
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

              {/* Title Input (font size text-base on mobile avoids Safari zoom-in) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  What did you navigate today?
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Guided a tense retro without assigning blame"
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              {/* Narrative Textarea */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  The Narrative (Friction & Movement)
                </label>
                <textarea
                  required
                  rows={3}
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Describe the subtle friction or unexpected challenge, and how your actions moved through it."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                />
              </div>

              {/* Impact / Shift */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  The Shift (Outcome / Ripple effect)
                </label>
                <input
                  type="text"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  placeholder="e.g. Aligned on shared testing goals; restored psychological trust."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-base sm:text-xs focus:outline-none focus:border-emerald-500/60 transition-all"
                />
              </div>

              {/* Live Tacit Skills Detector Preview */}
              {livePreview && livePreview.skills.length > 0 && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 animate-fadeIn">
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
            </div>

            {/* Buttons Footer */}
            <div className="pt-3 flex items-center justify-end space-x-2 sm:space-x-3 border-t border-white/10 shrink-0 pb-safe">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title || !narrative}
                className="flex items-center space-x-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isSubmitting ? 'Lighting...' : 'Light the Pathway'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
