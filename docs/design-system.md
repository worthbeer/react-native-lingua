# Design System — Lingua

This document explains every file in the foundation/design-system layer: what each file does, why it exists, and the architectural decisions behind it. It is written for developers and AI assistants reading this codebase for the first time.

---

## File Map

```
global.css                  ← NativeWind v5 design tokens + utility classes
metro.config.js             ← Wires NativeWind into the Metro bundler
postcss.config.mjs          ← Registers Tailwind v4 as a PostCSS plugin
nativewind-env.d.ts         ← TypeScript types for the className prop
src/theme/tokens.ts         ← Design tokens mirrored as TypeScript constants
src/theme/index.ts          ← Barrel export for the theme directory
src/app/_layout.tsx         ← Root layout: font loading + CSS import
src/app/index.tsx           ← Default route: living style guide / dev smoke test
```

---

## `global.css`

The heart of the styling layer. NativeWind v5 uses a CSS-first approach — all token definitions live here instead of a `tailwind.config.js` file.

### `@import` block

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";
```

The first three imports pull in Tailwind v4's reset, theme defaults, and utility generator. `nativewind/theme` adds NativeWind-specific CSS properties that make Tailwind work on native platforms — translating `rem` values to device-independent pixels (`dp`), etc.

### `@theme {}` block

Variables declared inside `@theme` become first-class Tailwind utilities automatically — no config file needed.

```css
--color-lingua-purple: #6c4ef5;
```

This single declaration generates `bg-lingua-purple`, `text-lingua-purple`, and `border-lingua-purple` as usable `className` values. No manual mapping required.

### `@layer base`

Sets Poppins-Regular as the global default font. Every `Text` component inherits it without an explicit `fontFamily` — only override when you need a different weight.

### `@layer utilities` — Typography

```css
.h1 { font-size: 32px; font-family: "Poppins-Bold"; line-height: 38px; }
```

BEM-style semantic utilities. Size + weight + line-height are bundled because they must always move together. Writing `className="h1"` expresses intent; writing `text-[32px] font-bold leading-[38px] font-poppins-bold` everywhere invites inconsistency.

### `@layer utilities` — Buttons, Cards, Badges, Layout

All follow the BEM block + modifier pattern:

- Block defines shape, spacing, alignment: `.btn`, `.card`, `.badge`
- Modifier sets only the color variation: `.btn-primary`, `.card-surface`, `.badge-streak`

This means any `View` or `TouchableOpacity` can compose them without duplicating style logic.

---

## `metro.config.js`

```js
const { withNativewind } = require("nativewind/metro");
module.exports = withNativewind(config, { input: "./global.css" });
```

Metro is React Native's JavaScript bundler. By default it knows nothing about CSS. `withNativewind` hooks into the build pipeline to:

1. Run PostCSS on `global.css` at build time.
2. Convert the resulting CSS into a JavaScript style sheet React Native can consume.
3. Enable the `className` prop on every React Native component.

The `input` path must point to your root CSS file. Everything else is derived from it.

---

## `postcss.config.mjs`

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

Tailwind v4 runs as a PostCSS plugin. This file tells PostCSS which plugins to run when Metro processes CSS. `.mjs` is used because Expo's toolchain expects ES module syntax here.

**Why Tailwind v4?** It eliminates `tailwind.config.js` entirely and moves token definitions into CSS. The design system is self-contained in `global.css` rather than split across two files.

---

## `nativewind-env.d.ts`

```ts
/// <reference types="nativewind/types" />
```

Tells TypeScript about the `className` prop NativeWind adds to React Native components. Without it, every `className="..."` on a `View` or `Text` would be a type error, because those props don't exist in base React Native typings.

---

## `src/theme/tokens.ts`

Exports raw design values as TypeScript constants — the same values defined as CSS variables in `global.css`.

### Why have both CSS variables and TypeScript constants?

NativeWind utilities cover most styling. But several React Native components and scenarios require `StyleSheet` or inline styles — `SafeAreaView`, `Animated.View`, dynamic values calculated at runtime, platform-specific shadows. In those cases, `className="bg-lingua-purple"` cannot be used. `colors.linguaPurple` is the fallback that keeps values consistent without hardcoding hex strings in component files.

See `AGENTS.md` → *Style Exception Rules* for the full list of when to use `StyleSheet` instead of NativeWind.

### `as const`

Freezes objects as literal types. `colors.linguaPurple` has the type `"#6C4EF5"` rather than `string`, enabling autocomplete and catching typos at compile time.

### Why are `fontSize` and `lineHeight` separate maps?

They're always paired conceptually but stored separately so you can pull just the size for a `StyleSheet.create()` call without being forced to also apply a line height (which might conflict with an existing layout).

---

## `src/theme/index.ts`

```ts
export * from "./tokens";
```

A barrel export. All imports use `@/theme` rather than `@/theme/tokens`. If tokens are ever split into multiple files (`colors.ts`, `typography.ts`, etc.), only this index file changes — no import paths break elsewhere.

---

## `src/app/_layout.tsx`

Expo Router's root layout — it wraps every screen in the app.

### `import "../../global.css"`

NativeWind requires the CSS file to be imported exactly once, at the top of the render tree. The root layout is the correct place because it renders before any screen. Importing it inside a screen file would mean CSS is only active when that screen is mounted.

### `SplashScreen.preventAutoHideAsync()`

Called at module level (outside the component) so it executes immediately when the JS bundle loads — before any React rendering. Inside a `useEffect` it would be too late and the splash screen might flicker away before fonts finish loading.

### `useFonts`

Expo's font loading hook returns `[loaded, error]`. Two `useEffect` hooks handle both outcomes: rethrow errors so Expo's error boundary catches them, and hide the splash once fonts are ready. `if (!loaded) return null` ensures the app renders nothing until fonts exist, preventing a flash of system fallback font.

### `return <Stack />`

Expo Router reads the `app/` folder and builds navigation automatically. `<Stack />` renders a native stack navigator for all routes. No screens are manually registered — that is the value of file-based routing.

---

## `src/app/index.tsx`

The default route (`/`). It is a **living style guide** — it renders one example of every utility class from `global.css` so you can immediately verify the design system is wired up correctly when the app starts.

### Why a demo screen before real screens?

The project is built feature by feature. Shipping a demo screen first lets you confirm that fonts load, colors resolve, and NativeWind is compiling before any real UI is built on top. Once the design system is validated, this screen becomes the first real screen of the app.

### `bg-background`

Uses the token-defined `--color-background: #ffffff`. The screen background always comes from the token, never a hardcoded value. A future dark mode change updates one variable everywhere.

---

## Design Decisions Summary

| Decision | Reason |
|---|---|
| CSS-first tokens in `global.css` | NativeWind v5 requires it; eliminates `tailwind.config.js` |
| Mirrored TypeScript constants in `tokens.ts` | Required for `StyleSheet` / `Animated` cases where `className` does not work |
| BEM naming in `@layer utilities` | Enforces consistent composition; easy to teach and scan |
| Poppins loaded in root layout only | Single font load, no duplicates |
| Barrel export from `src/theme/index.ts` | Stable import paths if tokens are later split into multiple files |
| Demo `index.tsx` as smoke test | Validates full stack integration before any feature work begins |

---

## Color Palette Reference

| Token | Hex | Usage |
|---|---|---|
| `lingua-purple` | `#6C4EF5` | Primary brand, buttons, links |
| `lingua-deep-purple` | `#5B38F6` | Pressed states, accents |
| `lingua-blue` | `#4D88FF` | Info, secondary actions |
| `lingua-green` | `#21C16B` | Success, XP, correct answers |
| `success` | `#21C16B` | Correct / completion states |
| `warning` | `#FFCB00` | Caution states |
| `streak` | `#FF8A00` | Streak counter, fire badge |
| `error` | `#FF4D4F` | Wrong answers, destructive actions |
| `text-primary` | `#001132` | Body copy, headings |
| `text-secondary` | `#6B7280` | Subtitles, captions, placeholders |
| `border` | `#E5E7EB` | Card borders, dividers |
| `surface` | `#F6F7FB` | Screen and card backgrounds (off-white) |
| `background` | `#FFFFFF` | Default screen background |

---

## Typography Scale Reference

| Class | Size | Weight | Line Height |
|---|---|---|---|
| `h1` | 32px | Bold | 38px |
| `h2` | 24px | SemiBold | 31px |
| `h3` | 20px | SemiBold | 26px |
| `h4` | 16px | Medium | 22px |
| `body-lg` | 16px | Regular | 26px |
| `body-md` | 14px | Regular | 22px |
| `body-sm` | 13px | Regular | 21px |
| `caption` | 11px | Regular | 15px |
