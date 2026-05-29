# Pull Request Review System

This project uses a custom Claude Code skill for structured PR reviews. It is built and maintained in-house — no third-party review bots, no external services. Every review is produced by the skill, posted directly to the GitHub PR as inline review comments and a summary block comment, and is visible to anyone reading the PR on GitHub.

**Version:** 2.0.0 — Stack-agnostic. Works on any repo with an `AGENTS.md` and a `gh`-authenticated terminal.

---

## How to Run a Review

```
/pr-review
```

Run this in Claude Code with the feature branch checked out. The skill:

1. Runs a **preflight check** — confirms `gh` is authenticated, an open PR exists, and `AGENTS.md` is present
2. Reads the diff against `main`
3. Reads `AGENTS.md` and derives review lenses from the project's own rules
4. Applies universal quality checks (secrets, debug logs, type safety, async error states)
5. Applies AGENTS.md-derived checks against the diff
6. Produces a structured report
7. Posts inline review comments to the PR and a full summary block comment

**Prerequisites:** `gh` CLI installed and authenticated (`gh auth login`).

---

## Phase 0 — Preflight (Proof of Life)

Before any review work, the skill runs a health check and prints a status table:

```
## /pr-review Preflight

| Check              | Status | Detail                        |
|--------------------|--------|-------------------------------|
| Git repository     | ✅     | /path/to/repo                 |
| Active branch      | ✅     | feature/my-branch             |
| gh authenticated   | ✅     | logged in as <username>       |
| Open PR            | ✅     | PR #3 — Add language selector |
| AGENTS.md present  | ✅     | found                         |

Skill version 2.0.0 — ready.
```

If `gh` is not authenticated or no open PR exists, the skill stops immediately and tells you exactly what to run. This phase alone is usable as a standalone health check without running a full review.

---

## What It Reviews

The reviewer applies two categories of checks to every changed file.

### Category A — Universal (any stack)

These checks never change regardless of project type.

| Priority | Checks |
|---|---|
| P0 | Secrets in client code, debug statements, type-safety bypasses (`any`), missing null guards, async with no error state, unauthorized new packages |
| P1 | Business logic in route/page files, `useEffect` for derived state |
| P3 | Unclear names, WHAT comments (if banned by AGENTS.md), orphaned TODOs, missing return types |
| P4 | Touch targets under 44×44pt (mobile), missing loading/empty/error states |

### Category B — AGENTS.md Derived (project-specific)

The skill reads your `AGENTS.md` and constructs checks from it dynamically. No rules are hardcoded. Every finding in this category traces back to a specific rule the project itself defined.

| AGENTS.md rule type | Priority |
|---|---|
| Secret handling, security | P0 |
| Architecture boundaries | P1 |
| File placement, naming conventions | P1 |
| Styling system, design token rules | P2 |
| Asset import conventions | P2 |
| Data placement conventions | P2 |
| Comment style | P3 |
| Visual fidelity, polish | P4 |

---

## Priority Scale

| Level | Label | Meaning |
|---|---|---|
| P0 | Critical | Blocks the merge. Must be fixed first. |
| P1 | High | Should be fixed before merge. |
| P2 | Medium | Should be fixed. Convention violation. |
| P3 | Low | Optional. Readability or naming improvement. |
| P4 | Polish | Optional. Visual or UX quality. |

---

## Output Format

Every review produces:

1. **Inline review comments** — P0 through P2 findings posted as resolvable GitHub conversations anchored to the specific lines in the diff
2. **Block summary comment** — the full structured report posted to the PR conversation

```
## PR Summary
  2–3 sentence overview.

## Changes Walkthrough
  Table of every changed file.

## Findings
  Grouped by P0 → P4. Each finding: file path, issue, concrete fix.

## AGENTS.md Compliance Checklist
  Dynamically generated from the project's own AGENTS.md rules.

## Verdict
  Approve / Needs Discussion — with a one-sentence justification.
```

---

## Using It on Another Project

Because the skill derives its lenses from `AGENTS.md`, it is portable to any repository:

1. Copy `.claude/skills/pr-review/` into the target repo's `.claude/skills/` directory
2. Ensure the target repo has an `AGENTS.md` at its root describing the project's architecture, style, and convention rules
3. Authenticate `gh` (`gh auth login`) in the target repo's context
4. Run `/pr-review` on any open PR branch

The skill will read the target repo's `AGENTS.md` and calibrate its lenses accordingly. No edits to the skill file are needed.

---

## Design Philosophy

**Built in-house.** No external review services. The skill, the rules, and the output format are maintained in this repo. Every review reflects standards the project itself defined.

**Rules-driven, not stack-driven.** In v1.x, lenses were hardcoded for Expo + NativeWind. In v2.0, the skill reads `AGENTS.md` and derives checks from it. A project without NativeWind will never see NativeWind findings.

**Teach, don't nitpick.** Every finding explains why the issue matters — connected to either a universal principle or a specific AGENTS.md rule. A finding without a "why" is noise.

**Severity is explicit.** P0 through P4 are defined, not implied. Severity determines whether a finding blocks a merge.

**Actionable by default.** Every finding includes a specific file, a specific issue, and a specific fix.
