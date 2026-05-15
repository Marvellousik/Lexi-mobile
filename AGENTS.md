# LexiAssist Mobile — Agent Guide

> This file is the single source of truth for AI coding agents working on this codebase. If you modify build steps, testing strategies, or code conventions, update this file.

---

## Project Overview

**LexiAssist** is a React Native mobile application built with the Expo SDK. It provides AI-assisted learning tools including Text-to-Speech, Reading Assistant, Writing Assistant, StudyBuddy (quizzes, flashcards, and chat), and user history management.

- **Name:** `lexi-mobile`
- **Display Name:** LexiAssist
- **Entry Point:** `expo-router/entry` (file-based routing)
- **Platforms:** iOS, Android, Web
- **Orientation:** Portrait
- **New Architecture:** Enabled (Fabric / TurboModules)
- **JS Engine:** Hermes

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo SDK | ~54.0.34 |
| Runtime | React Native | 0.81.5 |
| UI Library | React | 19.1.0 |
| Language | TypeScript | ~5.9.2 (strict mode) |
| Navigation | Expo Router | ~6.0.23 |
| State Management | Zustand | ^5.0.4 |
| HTTP Client | Axios | ^1.7.9 |
| Forms + Validation | React Hook Form + Zod | ^7.54.2 + ^3.24.2 |
| Animations | React Native Reanimated | ~4.1.0 |
| Gestures | React Native Gesture Handler | ~2.28.0 |
| SVG Rendering | react-native-svg | 15.12.1 |
| Secure Storage | expo-secure-store | ~15.0.8 |
| Local Storage | @react-native-async-storage/async-storage | 2.2.0 |
| Audio | expo-av | ~16.0.8 |
| Haptics | expo-haptics | ~15.0.8 |
| Document Picker | expo-document-picker | ~14.0.8 |
| Blur Effects | expo-blur | ~15.0.8 |
| Icons | @expo/vector-icons | ^15.0.2 |

---

## Project Structure

```
src/
├── app/                    # Screens and layouts (file-based routing)
│   ├── (auth)/             # Auth route group: login, register, email-verification
│   ├── (tabs)/             # Main tab group: home, chat, history, profile
│   ├── settings/           # Settings screen
│   ├── tools/              # Tool screens
│   │   ├── reading/
│   │   ├── studybuddy/     # quiz, flashcards, chat
│   │   ├── tts/
│   │   └── writing/
│   ├── _layout.tsx         # Root layout with splash screen animation
│   └── index.tsx           # Entry redirect (auth-guarded)
├── components/
│   ├── dashboard/          # Dashboard-specific widgets
│   ├── illustrations/      # Custom SVG illustration components
│   ├── layout/             # AppHeader, GlobalTabBar, GlassTabBar, Sidebar
│   ├── shared/             # Reusable components (PrimaryButton, OutlineButton, FAB, etc.)
│   └── ui/                 # Small UI primitives (Toast, Skeleton, selectors, etc.)
├── constants/
│   ├── colors.ts           # Light/dark color palettes
│   ├── routes.ts           # Centralized route-to-title mapping
│   ├── spacing.ts          # Design-system spacing tokens
│   └── typography.ts       # Text style presets
├── hooks/                  # Custom React hooks (useTheme, useAnimatedPress, etc.)
├── services/
│   ├── api.ts              # Axios instance with interceptors (auth + refresh)
│   ├── auth.service.ts     # Auth API + mock implementations
│   └── tools.service.ts    # Tool API endpoints
├── stores/
│   ├── authStore.ts        # Zustand auth state (persisted)
│   ├── themeStore.ts       # Zustand theme state (persisted)
│   └── sidebarStore.ts     # Zustand sidebar state
└── types/
    ├── declarations.d.ts   # SVG module declarations
    └── index.ts            # Shared TypeScript interfaces
```

### Path Aliases

`@/*` maps to `./src/*`. Always use `@/components/...`, `@/stores/...`, etc., for imports.

---

## Build and Run Commands

All commands use `npm`:

| Command | Action |
|---------|--------|
| `npm start` | Start the Expo development server |
| `npm run start:clear` | Start with cleared Metro bundler cache |
| `npm run android` | Start and open on Android emulator/device |
| `npm run ios` | Start and open on iOS simulator/device |
| `npm run stop` | Kill Metro/node processes (Windows PowerShell) |
| `npm run restart` | Run `stop` then `start:clear` |

**Note:** There is no test suite configured. The project currently has **zero test files**.

---

## Routing Architecture

The app uses **Expo Router** with file-based routing. The router root is `./src/app`.

### Route Groups

- `(auth)` — Authentication flows (login, register, email-verification). Hidden from tab bar.
- `(tabs)` — Main app tabs: `home`, `chat`, `history`, `profile`.
- `tools` — Standalone tool screens accessed from the dashboard. Not inside `(tabs)`.
- `settings` — Settings screen.

### Auth Guard Pattern

Auth guards are implemented declaratively in layout files and `index.tsx`:

```typescript
// Select the primitive only
const user = useAuthStore((s) => s.user);
const isAuthenticated = user !== null;

useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/(auth)/login');
  }
}, [isAuthenticated]);
```

**Never** select derived functions from stores (see Zustand Rules below).

### Custom Tab Bar

The default tab bar is hidden (`tabBar={() => null}`) and replaced with a custom `<GlobalTabBar />` rendered in the root `_layout.tsx`. It uses a blur-backed floating pill design on iOS and a solid fallback on Android.

---

## Code Style Guidelines

### TypeScript

- **Strict mode is enabled.** No implicit `any`. All function parameters and return types should be explicit.
- Use `interface` for object shapes and `type` for unions / mapped types.
- Export shared types from `src/types/index.ts`.

### Styling

- **Always use `StyleSheet.create`** — no inline style objects.
- **Never use raw `fontSize` values in component files.** Import presets from `@/constants/typography`.
- **Use the spacing system.** Import `sp` from `@/constants/spacing` and use tokens like `sp['4']`, `sp['6']`, etc.
- **Use color constants.** Import `lightColors` / `darkColors` from `@/constants/colors` (or use `useTheme()` for dynamic theming).

### Typography Rules (enforced in `src/constants/typography.ts`)

- Every text element must have `lineHeight >= fontSize * 1.4`.
- Large bold text (20pt+) gets `letterSpacing: -0.3` to `-0.5`.
- Body text gets `letterSpacing: 0` to `0.1`.
- Uppercase labels get `letterSpacing: 0.8`.

### Spacing Rules (documented in `src/constants/spacing.ts`)

- Screen horizontal padding: `sp['6']` (24pt)
- Section vertical gap: `sp['8']` (32pt)
- Element internal padding: `sp['4']` (16pt) minimum
- Sibling element gap: `sp['3']` (12pt)
- Label-to-input gap: `sp['1.5']` (6pt)
- Icon-to-text gap: `sp['2']` (8pt)

### Component Patterns

- Default export for screen components; named exports for reusable components.
- Accessibility props are mandatory on interactive elements:
  - `accessible={true}`
  - `accessibilityLabel="..."`
  - `accessibilityRole="button"` (or `"link"`, etc.)
- Haptics feedback on primary interactions via `expo-haptics`.
- Press animations should use the `useAnimatedPress` hook instead of raw `Animated` boilerplate.

### SVG Assets

- SVG files are imported as React components via `react-native-svg-transformer`.
- Custom inline SVG icons are preferred over icon fonts for tab bar and brand imagery.
- Module declaration is in `src/types/declarations.d.ts`.

---

## State Management (Zustand)

This codebase has **strict Zustand rules** established after a production-blocking infinite loop incident. See `DOCUMENTATION.md` for the full post-mortem.

### Rule 1: Selectors Must Return Stable References

**Wrong:**
```typescript
const values = useStore((s) => ({ a: s.a, b: s.b })); // NEW OBJECT EVERY TIME
```

**Correct:**
```typescript
const a = useStore((s) => s.a);
const b = useStore((s) => s.b);
// OR
const values = useStore((s) => ({ a: s.a, b: s.b }), shallow);
```

### Rule 2: Never Store Derived State in Zustand

**Wrong:**
```typescript
interface Store {
  items: Item[];
  itemCount: () => number;  // DERIVED — ANTI-PATTERN
}
```

**Correct:**
```typescript
interface Store {
  items: Item[];
}
const selectItemCount = (s: Store) => s.items.length;
```

### Rule 3: Never Select Functions from Zustand State

**Wrong:**
```typescript
const isAuthenticated = useAuthStore((s) => s.isAuthenticated); // unstable function
```

**Correct:**
```typescript
const user = useAuthStore((s) => s.user);
const isAuthenticated = user !== null;
```

### Store Conventions

- Stores are in `src/stores/`.
- Use `persist` middleware with `AsyncStorage` for state that should survive app restarts.
- Use `partialize` to persist only serializable fields.
- **Never persist functions or derived values.**

---

## API and Services

### Base API (`src/services/api.ts`)

- Axios instance with base URL `https://api.lexiassist.com/api/v1`.
- Request interceptor injects `Bearer` token from `expo-secure-store`.
- Response interceptor handles 401 refresh-token rotation. On failure, tokens are cleared.
- Timeout: 30 seconds.

### Auth Service (`src/services/auth.service.ts`)

- Implemented as a singleton class (`AuthService`).
- Has a **`useMock` master switch** (currently `true`). When enabled, all auth methods return mock responses with simulated latency instead of hitting the real API.
- Mock credentials for development: `dev@lexiassist.com` / `password123`.

### Tools Service (`src/services/tools.service.ts`)

- Plain object with async methods for each tool endpoint.
- All file uploads use `FormData` with `multipart/form-data` headers.

---

## Security Considerations

- **Access tokens** and **refresh tokens** are stored in `expo-secure-store` (encrypted keychain/keystore).
- Tokens are automatically cleared on refresh failure or logout.
- No environment files (`.env`) are committed to version control.
- Native iOS/Android folders (`/ios`, `/android`) are ignored and generated by Expo prebuild when needed.

---

## Deployment Configuration

Configured in `app.json`:

- **iOS Bundle ID:** `com.lexiassist.app`
- **Android Package:** `com.lexiassist.app`
- **Adaptive Icon Background:** `#3C8350`
- **Splash Screen:** White background with centered icon (`./assets/splash-icon.png`)
- **Web:** Static output via Metro bundler

Plugins registered:
- `expo-router` (root: `./src/app`)
- `expo-av`
- `expo-secure-store`

---

## Testing Instructions

> ⚠️ **There is currently no testing framework installed** (no Jest, no testing-library, no test files).

If you add tests, the convention should be:
- Co-locate test files next to source files (`Component.test.tsx`) or in `__tests__` directories.
- Update this section with the chosen framework and run commands.

---

## Key Files for Quick Reference

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts |
| `app.json` | Expo configuration, bundle IDs, plugins |
| `tsconfig.json` | TypeScript strict mode + path aliases |
| `metro.config.js` | Metro bundler config with SVG transformer |
| `babel.config.js` | Babel preset (`babel-preset-expo`) |
| `src/app/_layout.tsx` | Root layout, splash animation, providers |
| `src/app/index.tsx` | App entry redirect (auth state) |
| `src/services/api.ts` | Axios instance + interceptors |
| `src/constants/colors.ts` | Theme color palettes |
| `src/constants/typography.ts` | Text style system |
| `src/constants/spacing.ts` | Spacing token system |
| `DOCUMENTATION.md` | Architecture recovery log (Zustand infinite loop post-mortem) |
