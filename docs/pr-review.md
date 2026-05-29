# Pull Request Review System — Lingua Duolingo-Clone

This document describes the structured PR review system used on this project. Reviews are conducted by Claude Code using a custom skill that mirrors the approach of tools like CodeRabbit — automated, structured, and enforcement-driven — but tuned specifically to this project's stack, conventions, and AGENTS.md rules.

---

## How to Run a Review

```bash
/pr-review
```

Run this command in Claude Code with the feature branch checked out. The reviewer reads the diff against `main`, loads the project rules, and produces a structured report.

No configuration required. The skill reads `AGENTS.md` and `package.json` automatically before writing any findings.

---

## What It Reviews

The reviewer applies five sequential lenses to every changed file. Each lens has a priority level that determines how a finding affects the verdict.

### Priority Scale

| Level | Label | Meaning |
|---|---|---|
| P0 | Critical | Blocks the merge. Must be fixed first. |
| P1 | High | Should be fixed before merge. Architectural or convention violation. |
| P2 | Medium | Should be fixed. Inconsistency that compounds at scale. |
| P3 | Low | Optional. Readability, naming, or structure improvement. |
| P4 | Polish | Optional. Visual fidelity and UX quality. |

---

### P0 — Critical

Findings that block the PR entirely.

- **TypeScript `any`** — the project enforces strict types throughout (`AGENTS.md: "Avoid any"`)
- **Secrets in the Expo app** — API keys, Stream tokens, or Clerk secrets must live in server-side API routes, never in the mobile bundle
- **Debugging statements** — `console.log` left in production code paths
- **Missing null/undefined guards** — unguarded access on data from Zustand stores, Clerk hooks, or API calls
- **Broken async flows** — navigation or UI that has no loading state and no error state
- **Unauthorized new packages** — any addition to `package.json` not explicitly approved by the project owner

---

### P1 — High

Findings that represent architectural violations.

- **Logic in route files** — `app/` files are for routing and composition only; business logic belongs in `hooks/` or Zustand store actions
- **Premature component extraction** — a component created for a UI block used in exactly one place (adds indirection without benefit)
- **Missing component extraction** — a complex, nameable UI block left inline when it makes the screen harder to read
- **Wrong route group** — screens placed outside their correct group (`(auth)/`, `(tabs)/`, `lesson/`)
- **`useEffect` for derived state** — state that can be computed inline does not belong in an effect
- **State management violations** — global state in `useState`; transient UI state in Zustand

---

### P2 — Medium

Findings that violate project styling or organization conventions.

- **NativeWind on exception components** — `SafeAreaView`, `Animated.View`, `KeyboardAvoidingView`, `Modal`, `ScrollView` contentContainerStyle, and `Pressable` pressed-state styles must use `StyleSheet` or inline styles, not `className` (see `AGENTS.md` Style Exception Rules)
- **Direct image imports** — images must be imported through `constants/images.ts`, not required inline in screens or components
- **Hardcoded design tokens** — hex colors, font sizes, line heights, or font families that duplicate values already defined in `global.css` or `src/theme/tokens.ts`
- **Data hardcoded in components** — lesson content, copy, or structured data belongs in `data/`, not inside component files

---

### P3 — Low

Findings that affect readability — important for a project used to teach developers.

- Unclear names that require reading the implementation to understand
- Comments that describe what the code does instead of why (well-named code explains itself)
- Abstractions introduced before they are used in more than one real location
- Deep prop drilling when a Zustand store already manages the relevant state
- Missing TypeScript return types on non-trivial exported functions

---

### P4 — Polish

Findings that affect visual quality and production feel.

- Spacing or layout that deviates from the attached design references
- Inconsistent use of typography or color tokens across visually equivalent elements
- Touch targets smaller than 44×44pt (Apple Human Interface Guidelines minimum)
- Lists or async components missing loading, empty, or error states

---

## Output Format

Every review produces the following sections.

```
## PR Summary
  2–3 sentence overview of what the PR does and its overall quality signal.

## Changes Walkthrough
  Table of every changed file with its change type and a one-line summary.

## Findings
  Grouped by P0 → P4. Each finding includes:
  - File path and line number
  - What the issue is and why it matters
  - A concrete fix, with a code snippet if needed

## AGENTS.md Compliance Checklist
  Binary pass/fail grid against the ten core project rules.

## Verdict
  Approve / Request Changes / Needs Discussion — with a one-sentence justification.
```

---

## AGENTS.md Rules Enforced

The following rules from `AGENTS.md` are checked on every review.

| Rule | Where It's Enforced |
|---|---|
| No TypeScript `any` | P0 |
| No secrets in Expo app code | P0 |
| Images via `constants/images.ts` | P2 |
| NativeWind style exceptions | P2 |
| No unauthorized new libraries | P0 |
| Business logic not in `app/` files | P1 |
| Components only when reused or complex | P1 |
| Lesson content in `data/` | P2 |
| Zustand for global state, `useState` for local | P1 |
| No hardcoded design tokens | P2 |

---

## Design Philosophy

This reviewer is built around three principles:

**Teach, don't nitpick.** Every finding explains why the issue matters to this specific project and stack. A finding without a "why" is noise.

**Severity is explicit.** P0 through P4 are defined, not implied. A reviewer that treats every issue as equally urgent trains developers to ignore all feedback equally.

**Actionable by default.** Every finding includes a specific file, a specific issue, and a specific fix. Vague observations ("this could be cleaner") are not included.

---

## Stack Reference

| Layer | Technology |
|---|---|
| Framework | Expo + React Native |
| Language | TypeScript (strict) |
| Navigation | Expo Router |
| Styling | NativeWind v5 + Tailwind v4 |
| Global State | Zustand + AsyncStorage |
| Authentication | Clerk |
| Real-time / Video | Stream / GetStream |
| AI Features | Stream Vision Agents |
| Secrets | Expo API Routes (server-side only) |
