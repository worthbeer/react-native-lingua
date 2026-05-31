# Production Notes — Lingua AI Language App

## What This Project Is

Lingua is a Duolingo-inspired AI language learning mobile app built with Expo + React Native. It is a **teaching project** — the primary goal is to demonstrate how a modern AI-powered mobile app is built feature by feature, using AI-assisted development as the implementation engine.

The project follows a numbered curriculum of 18 prompts located in `prompts/`. Each prompt describes one feature and includes the relevant documentation. The prompts are run sequentially through Claude (VS Code or CLI), and the output is reviewed, corrected where necessary, committed, and PR'd before moving to the next.

---

## AI-Assisted Development Workflow

Every feature in this repo was implemented through the following loop:

```
prompt → AI generates implementation → review → correct drift → commit → PR → merge → tag
```

The AI does the implementation work. The engineer's role is:

1. **Curate the prompt** — the prompt includes documentation links, design references, and project rules (`AGENTS.md`)
2. **Review the output** — does it use real APIs? Does it follow project conventions?
3. **Identify and correct drift** — where the AI generated plausible-sounding but incorrect code
4. **Enforce the paper trail** — every change goes through a PR with inline review comments, author responses, and semantic version tags

This workflow is intentional. AI tools produce output at speed; engineering judgment determines whether that output is correct.

---

## Quality Control Mechanisms

### AGENTS.md
The authoritative rules file for the project. Every AI prompt reads it first. It defines architecture, styling rules, state management rules, image imports, comment policy, and the approved tech stack. Any output that violates AGENTS.md is a finding.

### Custom PR Review Skill (`/pr-review`)
A Claude Code skill (`.claude/skills/pr-review/`) that conducts structured code reviews against AGENTS.md rules and universal software quality standards. It posts findings as inline GitHub review conversations (resolvable threads) and a summary block comment. Version 2.0 is stack-agnostic — it derives its lenses from AGENTS.md rather than hardcoding framework-specific rules.

### Semantic Version Tags
Every merged PR is tagged on `main`:
- `v0.1.0` — onboarding + design system + pr-review skill v1
- `v0.2.0` — auth screens: sign-up, sign-in, verification modal
- `v0.3.0` — pr-review skill v2.0.0 (stack-agnostic)
- `v0.4.0` — Clerk authentication integration *(in progress)*

Tags are immutable rollback points. `git checkout v0.2.0` restores the exact state of any prior release.

### Git Workflow
GitHub Flow: short-lived feature branches off `main`, PR → `main`, delete branch after merge. No squash merges — full commit history is preserved on `main` so any change is traceable to the PR that introduced it. Merge commits use GitHub's auto-generated message format (`Merge pull request #N from owner/branch`) to keep the PR reference in the audit trail.

---

## Documented Drift Events

Drift events are cases where AI-generated output was syntactically valid but semantically wrong — code that would compile but fail at runtime because it called APIs that don't exist.

### Prompt 05 — Clerk Authentication

**What happened:** VS Code Chat implemented the Clerk auth integration using fabricated SDK methods. The code was structurally correct (right flow, right hooks) but used method names that do not exist in `@clerk/expo`.

**Fabricated methods identified:**

| Location | Invented | Actual SDK |
|---|---|---|
| `sign-up.tsx` | `useSignUp().errors` / `.fetchStatus` | `useSignUp()` returns `{ isLoaded, signUp, setActive }` |
| `sign-up.tsx` | `signUp.password()` | `signUp.create({ emailAddress, password })` |
| `sign-up.tsx` | `signUp.verifications.sendEmailCode()` | `signUp.prepareEmailAddressVerification({ strategy: 'email_code' })` |
| `sign-up.tsx` | `signUp.verifications.verifyEmailCode()` | `signUp.attemptEmailAddressVerification({ code })` |
| `sign-up.tsx` | `signUp.finalize({ navigate })` | `setActive({ session: result.createdSessionId })` |
| `sign-in.tsx` | `signIn.emailCode.sendCode()` | `signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId })` |
| `sign-in.tsx` | `signIn.emailCode.verifyCode()` | `signIn.attemptFirstFactor({ strategy: 'email_code', code })` |
| `sign-in.tsx` | `signIn.finalize()` | `setActive({ session: result.createdSessionId })` |
| Both | `errors.fields.X.message` | `isClerkAPIResponseError(err)` in try/catch |

**Why it happens:** The AI has learned patterns from code that looks like Clerk usage across training data. It generates plausible method chains that follow a consistent naming convention — they just don't match the actual published SDK. The structure was correct; the method names were invented.

**How it was caught:** Code review against the Clerk Expo documentation. The `useSignUp()` hook signature doesn't include `errors` or `fetchStatus`. Any of these calls would throw `TypeError: signUp.verifications is not a function` at runtime.

**Correction:** Both screens were rewritten using the verified SDK API. Error handling was also corrected to use `isClerkAPIResponseError(err)` with try/catch rather than the fictional `errors.fields` object.

**Corrective commit:** `feat: integrate Clerk authentication (prompt 05)` — see PR #4.

---

## Intent

The comparison goal at the end of this course is to diff the output of this AI-assisted workflow against the published reference repo. Differences will fall into one of three categories:

1. **Corrected drift** — where this repo diverges because AI output was wrong and was fixed
2. **Design decisions** — where this repo made intentional choices the reference didn't
3. **Scope** — where the curriculum was adapted for this specific build

That diff, combined with the PR history, commit messages, and this document, is the complete record of how the app was built.

---

## Stack Reference

| Layer | Technology |
|---|---|
| Framework | Expo SDK ~54 + React Native 0.81 |
| Language | TypeScript (strict) |
| Navigation | Expo Router ~6 |
| Styling | NativeWind v5 + Tailwind v4 |
| Global State | Zustand + AsyncStorage |
| Authentication | Clerk (`@clerk/expo`) |
| Real-time / Video | Stream / GetStream *(upcoming)* |
| AI Features | Stream Vision Agents *(upcoming)* |
| Secrets | `.env` (gitignored) — `EXPO_PUBLIC_` keys only |
