# GEMINI.md — Blummiya Project Guidelines & Architecture

> **Tagline**: *"Grow forward. Light the way."*  
> **Mission**: *"We believe progress shouldn't feel like a cold checklist. Our mission is to transform everyday experiences into fertile ground for personal mastery, helping people grow naturally and leave behind a thriving trail of shared knowledge."*

---

## 1. Project Overview & Philosophy

**Blummiya** is an organic life skill pathway platform. Unlike static resumes, stale certificates, or rigid competency checkboxes, Blummiya captures everyday actions and unlocks the hidden, tacit skills underneath (e.g., quiet mediation, systems synthesis, crisis composure).

### Design Aesthetics & Visual Tone
- **Bioluminescent Cosmos**: Dark obsidian background (`#080c14`), glowing nodes, and particle luminescence.
- **Color System**:
  - 💬 **Human Dynamics**: Cyan (`#06b6d4`, `shadow-glow-cyan`)
  - 🧠 **Cognitive Strategy**: Violet / Purple (`#a855f7`, `shadow-glow-violet`)
  - 🛠️ **Craft & Tactical Mastery**: Emerald (`#10b981`, `shadow-glow-sm`)
  - ⚓ **Inner Mastery**: Amber (`#f59e0b`, `shadow-glow-amber`)
- **Bloom Stages**:
  - `0–25%`: 🌱 *Awakened Seed*
  - `26–50%`: 🌿 *Living Sprout*
  - `51–74%`: 🌸 *Full Bloom*
  - `75–100%`: ✨ *Radiant Beacon*

---

## 2. Technology Stack & Rules

- **Framework**: Next.js 15 (App Router), React 19, TypeScript.
- **Styling**: Tailwind CSS + custom glassmorphism and glow utilities in `src/app/globals.css`.
- **Database**: Native `node:sqlite` (`DatabaseSync` from Node.js 22/24+).
  - **No external C++ native addon builds** (avoid `better-sqlite3` to prevent `node-gyp` / `make` dependency issues).
  - Database file: `blummiya.db` (git-ignored).
- **Visualization**: Custom SVG/Canvas living graph (`PathwayCanvas.tsx`) with animated bezier links and pulse indicators.
- **Icons & Motion**: `lucide-react`, `framer-motion`.

---

## 3. Directory Layout

```
src/
├── app/
│   ├── api/
│   │   ├── moments/route.ts   # Log everyday moments & grow skill radiance
│   │   ├── skills/route.ts    # Fetch pathway nodes & connection links
│   │   └── trails/route.ts    # Community shared trails & spark actions
│   ├── globals.css            # Glow classes, CSS variables, dark palette
│   ├── layout.tsx             # Root layout with metadata
│   └── page.tsx               # Primary dashboard coordinating views
├── components/
│   ├── chronicle/
│   │   ├── ChronicleFeed.tsx       # Timeline of chronicled moments
│   │   └── MomentCaptureModal.tsx  # "Ignite a Spark" modal with live skill sensor
│   ├── layout/
│   │   └── Navbar.tsx              # Glowing brand header and navigation
│   ├── pathway/
│   │   ├── NodeDetailDrawer.tsx    # Slide-over displaying skill lineage & moments
│   │   └── PathwayCanvas.tsx       # Interactive bioluminescent constellation
│   └── trails/
│       └── TrailsExplorer.tsx      # Shared knowledge trails
└── lib/
    ├── db.ts                  # SQLite singleton and schema initialization
    └── skills/
        ├── extractor.ts       # Tacit skill extraction & growth revelation logic
        └── taxonomy.ts        # 4-domain life skill ontology definitions
```

---

## 4. Key Workflows & Commands

```bash
# Start local development server
npm run dev

# Production build and type checking
npm run build

# Verify database schema & seed constellation
node scripts/verify.mjs

# Verify hidden skill extraction engine
node scripts/test-extractor.mjs

# Re-seed or reset database
node scripts/init-db.mjs
```

---

## 5. Working Conventions for AI Assistants

- **Be Proactive & Direct**: Do not stall with meta-questionnaires or "grill me" checklists. Propose concrete architectures, scaffold clean code, and execute.
- **Respect Aesthetics**: Keep the UI bioluminescent, fluid, and organic—never degrade it into standard administrative tables or flat corporate dashboard forms.
- **Preserve Native SQLite**: Retain zero-dependency `node:sqlite` for database operations.
