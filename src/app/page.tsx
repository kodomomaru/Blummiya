'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PathwayCanvas, PathwaySkill, PathwayLink } from '@/components/pathway/PathwayCanvas';
import { NodeDetailDrawer } from '@/components/pathway/NodeDetailDrawer';
import { MomentCaptureModal } from '@/components/chronicle/MomentCaptureModal';
import { ChronicleFeed } from '@/components/chronicle/ChronicleFeed';
import { TrailsExplorer } from '@/components/trails/TrailsExplorer';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'pathway' | 'chronicles' | 'trails'>('pathway');
  const [skills, setSkills] = useState<PathwaySkill[]>([]);
  const [links, setLinks] = useState<PathwayLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<PathwaySkill | null>(null);
  const [isSparkModalOpen, setIsSparkModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPathwayData = () => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => {
        if (data.skills) setSkills(data.skills);
        if (data.links) setLinks(data.links);
      })
      .catch((err) => console.error('Failed to load pathway:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPathwayData();
  }, [refreshTrigger]);

  const totalRadiance = useMemo(() => {
    return skills.reduce((sum, s) => sum + s.radiance, 0);
  }, [skills]);

  const tacitCount = useMemo(() => {
    return skills.filter((s) => s.is_tacit === 1).length;
  }, [skills]);

  const handleMomentSaved = (data: any) => {
    if (data.skills) setSkills(data.skills);
    if (data.links) setLinks(data.links);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300 pb-20 sm:pb-6">
      <div>
        {/* Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSparkModal={() => setIsSparkModalOpen(true)}
          totalRadiance={totalRadiance}
        />

        {/* Tab 1: Living Pathway Canvas */}
        {activeTab === 'pathway' && (
          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Mission Hero Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl glass-panel border border-white/10">
              <div>
                <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>The Living Life Skill Pathway</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Grow forward. Light the way.
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Everyday actions hold uncredited mastery. Watch your experiences bloom into an interconnected
                  bioluminescent constellation, leaving trails that inspire others to follow.
                </p>
              </div>

              {/* Quick Summary Badges (compact on narrow/folding devices) */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3 bg-slate-900/80 p-1.5 sm:p-3 rounded-xl border border-white/5 shrink-0">
                <div className="px-2 sm:px-3 py-1 text-center">
                  <span className="block text-base sm:text-lg font-bold text-emerald-400 font-mono">{skills.length}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Blooms</span>
                </div>
                <div className="px-2 sm:px-3 py-1 text-center border-x border-white/10">
                  <span className="block text-base sm:text-lg font-bold text-amber-400 font-mono">{tacitCount}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Tacit</span>
                </div>
                <div className="px-2 sm:px-3 py-1 text-center">
                  <span className="block text-base sm:text-lg font-bold text-cyan-400 font-mono">{links.length}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Links</span>
                </div>
              </div>
            </div>

            {/* Interactive Pathway Canvas */}
            {loading ? (
              <div className="h-[60dvh] min-h-[420px] sm:h-[620px] w-full rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-slate-500 text-sm">
                Illuminating living pathway...
              </div>
            ) : (
              <PathwayCanvas
                skills={skills}
                links={links}
                onSelectSkill={(skill) => setSelectedSkill(skill)}
                selectedSkillId={selectedSkill?.id}
              />
            )}
          </main>
        )}

        {/* Tab 2: Chronicles Feed */}
        {activeTab === 'chronicles' && (
          <ChronicleFeed
            onOpenSparkModal={() => setIsSparkModalOpen(true)}
            refreshTrigger={refreshTrigger}
          />
        )}

        {/* Tab 3: Shared Trails Explorer */}
        {activeTab === 'trails' && (
          <TrailsExplorer
            onSelectTrailSkill={(skill) => {
              setSelectedSkill(skill);
              setActiveTab('pathway');
            }}
          />
        )}
      </div>

      {/* Skill Detail Slide-over / Bottom Sheet */}
      {selectedSkill && (
        <NodeDetailDrawer
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onAddSpark={() => {
            const skillName = selectedSkill.name;
            setSelectedSkill(null);
            setIsSparkModalOpen(true);
          }}
        />
      )}

      {/* Ignite a Spark Modal */}
      <MomentCaptureModal
        isOpen={isSparkModalOpen}
        onClose={() => setIsSparkModalOpen(false)}
        onMomentSaved={handleMomentSaved}
      />

      {/* Subtle Bioluminescent Footer */}
      <footer className="mt-8 sm:mt-12 border-t border-white/5 py-6 px-4 text-center text-[11px] sm:text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold font-mono">Blummiya</span>
            <span>—</span>
            <span className="italic">"We believe progress shouldn't feel like a cold checklist."</span>
          </div>
          <div className="text-slate-400">
            Grow forward. Light the way. &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
