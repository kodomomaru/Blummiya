# MEMORY.md — Blummiya Project State & Context

## Project Identity
- **Name**: Blummiya
- **Tagline**: *"Grow forward. Light the way."*
- **Mission**: *"We believe progress shouldn't feel like a cold checklist. Our mission is to transform everyday experiences into fertile ground for personal mastery, helping people grow naturally and leave behind a thriving trail of shared knowledge."*
- **GitHub Repository**: [https://github.com/kodomomaru/Blummiya](https://github.com/kodomomaru/Blummiya) (Branch: `main`)

---

## Architectural Decisions & Milestones
- **Next.js 15 (App Router) + React 19 + TypeScript**: Modern, performant fullstack foundation.
- **Native Node SQLite (`node:sqlite`)**: Chosen over `better-sqlite3` to completely avoid C++ / `node-gyp` / `make` compilation friction in modern Node 24 environments.
- **Bioluminescent Visual System**: Deep obsidian background with radiant emerald, cyan, violet, and amber glows.
- **Living Pathway Constellation**: Interactive SVG/Canvas (`PathwayCanvas.tsx`) showing organic nodes progressing through bloom stages (Seed $\to$ Sprout $\to$ Bloom $\to$ Radiant Beacon).
- **Mobile, Portrait & Folding Device Optimization**:
  - Full touch gestures on constellation canvas: single-finger pan, two-finger pinch-to-zoom, and 32px invisible thumb hit targets.
  - Native bottom navigation bar on mobile/portrait screens with safe-area insets (`env(safe-area-inset-bottom)` / `env(safe-area-inset-top)`).
  - Responsive bottom-sheet slide-up drawer on mobile and clean side-by-side drawer on tablet/desktop/unfolded folding screens.
  - Horizontally swipeable filter pills with hidden scrollbars for narrow cover screens (e.g. 280–360px).
  - Keyboard-safe modal with `max-h-[92dvh]`, 16px font inputs to prevent iOS auto-zoom distortion, and 2-column mobile life sphere selectors.
- **Dual-Mode Skill Extractor**: Natural language processor that surfaces hidden tacit skills (e.g. *Conflict Mediation*, *Systems Synthesis*, *Crisis Composure*) from everyday moments and generates a narrative "Growth Revelation".
- **Action Chronicle ("Ignite a Spark")**: Low-friction input modal with live preview sensor detecting tacit skills as the user types.
- **Shared Trails ("Light The Way")**: Curated learning and mastery pathways that can be shared and illuminated by the community.

---

## User Preferences
- **No passive grilling**: Avoid generic 20-questions or questionnaires asking "what are you missing?". Bring ideas, take the wheel on technical scaffolding, and provide concrete solutions.
- **Direct execution**: Test and verify builds, commits, and pushes proactively.
