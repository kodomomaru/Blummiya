'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Filter, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { SKILL_CATEGORIES, SkillCategory } from '@/lib/skills/taxonomy';

export interface PathwaySkill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  is_tacit: number;
  radiance: number;
  moments_count: number;
  x: number;
  y: number;
}

export interface PathwayLink {
  id: string;
  source_id: string;
  target_id: string;
  strength: number;
}

interface PathwayCanvasProps {
  skills: PathwaySkill[];
  links: PathwayLink[];
  onSelectSkill: (skill: PathwaySkill) => void;
  selectedSkillId?: string;
}

export function PathwayCanvas({
  skills,
  links,
  onSelectSkill,
  selectedSkillId,
}: PathwayCanvasProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map for fast lookup
  const skillMap = useMemo(() => new Map(skills.map((s) => [s.id, s])), [skills]);

  // Connected skills for highlighted hover
  const activeHighlightedNeighbors = useMemo(() => {
    const targetId = hoveredSkillId || selectedSkillId;
    if (!targetId) return new Set<string>();

    const neighbors = new Set<string>();
    neighbors.add(targetId);
    for (const link of links) {
      if (link.source_id === targetId) neighbors.add(link.target_id);
      if (link.target_id === targetId) neighbors.add(link.source_id);
    }
    return neighbors;
  }, [hoveredSkillId, selectedSkillId, links]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    if (filterCategory === 'all') return skills;
    return skills.filter((s) => s.category === filterCategory);
  }, [skills, filterCategory]);

  // Bloom stage calculation
  const getBloomStage = (radiance: number) => {
    if (radiance >= 75) return { stage: 'Radiant Beacon', icon: '✨', auraSize: 42, ringColor: '#34d399' };
    if (radiance >= 50) return { stage: 'Full Bloom', icon: '🌸', auraSize: 34, ringColor: '#22d3ee' };
    if (radiance >= 25) return { stage: 'Living Sprout', icon: '🌿', auraSize: 26, ringColor: '#a78bfa' };
    return { stage: 'Awakened Seed', icon: '🌱', auraSize: 20, ringColor: '#fbbf24' };
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'svg' || (e.target as HTMLElement).tagName.toLowerCase() === 'rect') {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-white/10 bg-[#080c14] select-none">
      {/* Background ambient nebula glow */}
      <div className="absolute inset-0 bg-ambient-nebula pointer-events-none" />

      {/* Floating starry dust background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-400 animate-pulse-slow"
            style={{
              top: `${(i * 17 + 7) % 100}%`,
              left: `${(i * 23 + 13) % 100}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              animationDelay: `${i * 0.3}s`,
              opacity: (i % 5 + 3) / 10,
            }}
          />
        ))}
      </div>

      {/* Top Filter and Info Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 pointer-events-auto">
          <Filter className="w-3.5 h-3.5 ml-2 text-slate-400" />
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Constellations ({skills.length})
          </button>
          {Object.entries(SKILL_CATEGORIES).map(([catKey, cat]) => (
            <button
              key={catKey}
              onClick={() => setFilterCategory(catKey)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                filterCategory === catKey
                  ? `${cat.bgClass} border border-current shadow-sm`
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 pointer-events-auto">
          <button
            onClick={() => setScale((s) => Math.min(1.8, s + 0.15))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            title="Reset Pan/Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main SVG Graph */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <defs>
          {/* Bioluminescent Gradients */}
          <linearGradient id="trail-grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
          style={{ transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
        >
          {/* Organic Trail Lines connecting skills */}
          {links.map((link) => {
            const source = skillMap.get(link.source_id);
            const target = skillMap.get(link.target_id);
            if (!source || !target) return null;

            const isHighlighted =
              activeHighlightedNeighbors.has(link.source_id) && activeHighlightedNeighbors.has(link.target_id);

            // Curved quadratic bezier for natural organic feel
            const midX = (source.x + target.x) / 2 + (source.y - target.y) * 0.08;
            const midY = (source.y + target.y) / 2 + (target.x - source.x) * 0.08;
            const pathData = `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;

            return (
              <g key={link.id} className="transition-opacity duration-300">
                {/* Background glow path */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isHighlighted ? '#10b981' : '#334155'}
                  strokeWidth={isHighlighted ? 3 : Math.max(1.5, link.strength)}
                  strokeOpacity={isHighlighted ? 0.9 : 0.35}
                  strokeDasharray={isHighlighted ? 'none' : '4, 4'}
                  filter={isHighlighted ? 'url(#glow)' : undefined}
                />

                {/* Animated light pulse along highlighted trail */}
                {isHighlighted && (
                  <circle r="3.5" fill="#34d399" filter="url(#glow)">
                    <animateMotion path={pathData} dur="3s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Skill Nodes */}
          {filteredSkills.map((skill) => {
            const catInfo = SKILL_CATEGORIES[skill.category] || SKILL_CATEGORIES.craft;
            const bloom = getBloomStage(skill.radiance);
            const isSelected = skill.id === selectedSkillId;
            const isHovered = skill.id === hoveredSkillId;
            const isRelated = activeHighlightedNeighbors.has(skill.id);
            const opacity =
              activeHighlightedNeighbors.size === 0 || isRelated ? 1 : 0.25;

            return (
              <g
                key={skill.id}
                transform={`translate(${skill.x}, ${skill.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSkill(skill);
                }}
                onMouseEnter={() => setHoveredSkillId(skill.id)}
                onMouseLeave={() => setHoveredSkillId(null)}
                className="cursor-pointer transition-all duration-300"
                style={{ opacity }}
              >
                {/* Outer Radiance Halo Ring */}
                <circle
                  r={bloom.auraSize + (isHovered || isSelected ? 8 : 0)}
                  fill={catInfo.color}
                  fillOpacity={isSelected ? 0.25 : isHovered ? 0.2 : 0.08}
                  stroke={catInfo.color}
                  strokeWidth="1"
                  strokeOpacity={isSelected ? 0.8 : 0.3}
                  className={skill.radiance >= 75 ? 'animate-pulse-slow' : ''}
                />

                {/* Second inner pulsating ring */}
                <circle
                  r={bloom.auraSize * 0.65}
                  fill={catInfo.color}
                  fillOpacity={0.15}
                  stroke={bloom.ringColor}
                  strokeWidth="1.5"
                  strokeOpacity={0.6}
                />

                {/* Core node */}
                <circle
                  r={12}
                  fill="#0b1120"
                  stroke={bloom.ringColor}
                  strokeWidth={isSelected ? 3 : 2}
                  filter="url(#glow)"
                />

                {/* Tacit Sparkle marker */}
                {skill.is_tacit === 1 && (
                  <circle
                    cx="8"
                    cy="-8"
                    r="4"
                    fill="#fbbf24"
                    stroke="#0b1120"
                    strokeWidth="1.5"
                  />
                )}

                {/* Stage emoji or icon */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fill="#ffffff"
                  className="pointer-events-none"
                >
                  {bloom.icon}
                </text>

                {/* Label Box */}
                <g transform="translate(0, 24)" className="pointer-events-none">
                  <rect
                    x={-(skill.name.length * 4.2)}
                    y="-4"
                    width={skill.name.length * 8.4}
                    height="18"
                    rx="6"
                    fill="rgba(8, 12, 20, 0.85)"
                    stroke={isSelected ? catInfo.color : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    y="5"
                    fontSize="11"
                    fontWeight={isSelected ? '600' : '500'}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  >
                    {skill.name}
                  </text>
                </g>

                {/* Radiance percentage pill on hover */}
                {(isHovered || isSelected) && (
                  <g transform="translate(0, -26)" className="pointer-events-none animate-fadeIn">
                    <rect
                      x="-32"
                      y="-10"
                      width="64"
                      height="16"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={catInfo.color}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      y="-2"
                      fontSize="9"
                      fontWeight="600"
                      fill={bloom.ringColor}
                    >
                      {Math.round(skill.radiance)}% Radiant
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Canvas Bottom Legend */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between text-xs text-slate-400 pointer-events-none">
        <div className="flex items-center space-x-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md pointer-events-auto">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="text-slate-300">Tacit / Hidden Skill</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>Click any node to explore its chronicle lineage</span>
        </div>

        <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md pointer-events-auto">
          <span>🌱 Seed</span>
          <span>➜</span>
          <span>🌿 Sprout</span>
          <span>➜</span>
          <span>🌸 Bloom</span>
          <span>➜</span>
          <span className="text-emerald-300 font-medium">✨ Radiant Beacon</span>
        </div>
      </div>
    </div>
  );
}

