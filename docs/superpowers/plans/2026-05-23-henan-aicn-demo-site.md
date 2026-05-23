# Henan AICN Demo Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished static website for demonstrating the Henan AICN + education-science-talent integration platform to Henan Department of Science and Technology, Zhejiang Tsinghua Yangtze River Delta Research Institute, and Henan Talent Group leaders.

**Architecture:** Create a static, deployable website at the repository root using `index.html`, `styles.css`, and `script.js`, with content driven by the approved design spec. Add Node-based tests that verify required official positioning, AICN agent roles, dual-region collaboration, deployment links, and essential accessibility structure.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

---

## File Structure

- `index.html`: single-page demo website with official navigation, hero control room, network visualization, agent matrix, dual collaboration lanes, project board, institutional role section, and closing call-to-action.
- `styles.css`: full responsive visual system, official civic-tech color palette, layouts, animation, cards, mobile rules, and print-safe fallbacks.
- `script.js`: progressive enhancements for animated counters, network canvas, project filtering, section reveal, and active navigation state.
- `tests/site-content.test.js`: Node tests that read the static files and assert required content, structure, and asset references.
- `package.json`: npm scripts for `npm test` and `npm run check`.
- `docs/superpowers/plans/2026-05-23-henan-aicn-demo-site.md`: this implementation plan.

### Task 1: Add Static Site Tests

**Files:**
- Create: `package.json`
- Create: `tests/site-content.test.js`

- [ ] Create `package.json` with Node test scripts.
- [ ] Create `tests/site-content.test.js` that reads `index.html`, `styles.css`, and `script.js`.
- [ ] Assert `index.html` contains the official platform title, Henan Department of Science and Technology, Zhejiang Tsinghua Yangtze River Delta Research Institute, Henan Talent Group, AICN, education-science-talent integration, the Aliyun URL, and all major agent roles.
- [ ] Assert `index.html` contains navigation landmarks, one `h1`, at least six sections, and a canvas-based network visual.
- [ ] Assert `styles.css` includes responsive media queries and CSS variables for the core palette.
- [ ] Assert `script.js` includes project filtering and canvas network initialization.
- [ ] Run `npm test` and verify it fails because the website files do not exist yet.

### Task 2: Implement Static Website

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`

- [ ] Create `index.html` with required sections:
  - official top navigation
  - hero control room for official AICN + 教科人一体化 positioning
  - live-looking multi-agent network canvas
  - metrics strip for agents/projects/nodes
  - education-science-talent integration section
  - Henan and Yangtze River Delta dual-domain collaboration section
  - agent matrix section
  - dual project board section
  - institutional roles section
  - project closed-loop timeline
  - footer with GitHub and Aliyun links
- [ ] Create `styles.css` with a refined civic technology aesthetic: deep official blue, clean white, cyan signal accents, gold institutional emphasis, green Henan growth accents, and responsive layouts.
- [ ] Create `script.js` with no external dependencies:
  - animate counters after entering viewport
  - draw and animate the network canvas
  - filter project cards by collaboration direction
  - set active navigation state on scroll
  - reveal sections as they enter viewport
- [ ] Run `npm test` and verify it passes.

### Task 3: Browser Verification

**Files:**
- Verify only.

- [ ] Serve the site locally with `python3 -m http.server 4173`.
- [ ] Open `http://localhost:4173` in the browser.
- [ ] Verify desktop viewport: first screen clearly shows official platform identity, AICN, 教科人一体化, intelligent agent network, and the three leadership audiences.
- [ ] Verify mobile viewport: navigation wraps cleanly, hero text does not overlap, project cards and agent matrix remain readable, and the canvas is nonblank.
- [ ] If visual issues appear, fix CSS/HTML and re-run `npm test`.

### Task 4: Commit and Publish Branch

**Files:**
- Modify: all new site files and plan file.

- [ ] Run `npm test`.
- [ ] Run `git diff --check`.
- [ ] Review `git diff --stat`.
- [ ] Commit with `feat: build henan aicn demo site`.
- [ ] Push branch `codex/build-henan-aicn-site` to origin.
