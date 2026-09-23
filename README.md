# Blummiya 🌿✨

> **Tagline**: *"Grow forward. Light the way."*  
> **Mission**: *"We believe progress shouldn't feel like a cold checklist. Our mission is to transform everyday experiences into fertile ground for personal mastery, helping people grow naturally and leave behind a thriving trail of shared knowledge."*

---

## What is Blummiya?

Unlike static resumes, stale achievement certificates, and impossible-to-complete competency checklists, **Blummiya** transforms your everyday actions into visually striking growth progress. 

Every time you navigate a friction point—whether mediating team tension without assigning blame, diagnosing a silent memory leak under pressure, or mentoring a peer through a setback—Blummiya reveals the **hidden tacit skills** underneath, illuminates them on an interactive bioluminescent constellation, and weaves shared trails that inspire others.

---

## Core Features

- 🌌 **The Living Pathway Canvas**: An interactive, organic SVG/Canvas visualization where skills bloom across four essential life domains:
  - **Human Dynamics & Fellowship** (Cyan): Empathetic connection, psychological safety, quiet mediation.
  - **Cognitive Strategy & Synthesis** (Violet): Systems synthesis, second-order thinking, essential triage.
  - **Craft & Tactical Mastery** (Emerald): Tactile fluency, root-cause intuition, graceful iteration.
  - **Inner Mastery & Groundedness** (Amber): Crisis composure, psychological resilience, sustainable rhythm.
- 🔮 **Hidden Skill Extraction Engine**: Analyzes natural language reflections to identify subtle, tacit instincts (the unteachable competencies often lost in traditional HR matrices) and awards radiance boosts.
- 📖 **Living Chronicle Timeline**: A rich log of your real-world challenges, actions, and ripple effects.
- 🌟 **Shared Trails ("Light The Way")**: Curated pathways that illuminate how diverse skills combine to navigate specific journeys, allowing trailblazers to inspire future seekers.
- ⚡ **Zero-Config Native SQLite**: Powered by Node 24's native `node:sqlite`, ensuring ultra-fast local persistence with zero external compilation or native build dependencies.

---

## Quickstart

### 1. Prerequisites
- **Node.js**: v22+ (v24.x recommended for native `node:sqlite`)
- **npm**: v10+

### 2. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── moments/route.ts   # Chronicles everyday actions & extracts skills
│   │   ├── skills/route.ts    # Provides pathway nodes, radiance & links
│   │   └── trails/route.ts    # Curated shared trails & inspiration sparks
│   ├── globals.css            # Bioluminescent glow theme & glassmorphism
│   ├── layout.tsx             # Root dark layout
│   └── page.tsx               # Orchestrates canvas, chronicles, & drawer
├── components/
│   ├── chronicle/
│   │   ├── ChronicleFeed.tsx       # Timeline of moments & illuminated rings
│   │   └── MomentCaptureModal.tsx  # "Ignite a Spark" with live skill detection
│   ├── layout/
│   │   └── Navbar.tsx              # Brand header & navigation
│   ├── pathway/
│   │   ├── NodeDetailDrawer.tsx    # Lineage, bloom stage, & moment history
│   │   └── PathwayCanvas.tsx       # Interactive bioluminescent canvas
│   └── trails/
│       └── TrailsExplorer.tsx      # Community shared trails
└── lib/
    ├── db.ts                  # Native node:sqlite database manager
    └── skills/
        ├── extractor.ts       # Tacit skill extraction & growth revelation
        └── taxonomy.ts        # 4-domain life skill ontology
```

---

*Blummiya — Grow forward. Light the way.*

