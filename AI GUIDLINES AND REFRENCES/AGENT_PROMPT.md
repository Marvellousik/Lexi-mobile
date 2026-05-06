# LexiAssist Mobile — Coding Agent Orchestration Prompt
# Single source of truth for build order, design system, and iOS-quality standards
# Feed this file to your coding agent (Cursor, Claude Code, Copilot, etc.) at session start

---

## AGENT IDENTITY & RULES

You are a senior React Native engineer building LexiAssist Mobile.
Stack: Expo SDK 52, Expo Router v4, React Native, TypeScript, Zustand, Axios, react-hook-form + zod.
Backend: Go microservices, JWT auth, base URL in `src/services/api.ts`.

Rules:
1. Never mock data. All state comes from real API responses or Zustand.
2. Production-ready code only. No placeholders, no TODO stubs left unresolved.
3. Every screen uses `useSafeAreaInsets()` — never hardcode top/bottom padding.
4. All colors, spacing, radius, and typography come from `src/constants/colors.ts` only.
5. Dark mode support on every screen via `useTheme()` hook from `src/hooks/useTheme.ts`.
6. Never use `StyleSheet.create` with raw color strings — always reference tokens.
7. Reanimated for any animation. Never use `Animated` from core React Native.

---

## BUILD ORDER — Follow this sequence exactly, do not skip ahead

### PHASE 0 — Foundation (build first, nothing works without these)
```
1. src/constants/colors.ts           ← already scaffolded, verify tokens
2. src/services/api.ts               ← already scaffolded, verify interceptors
3. src/store/authStore.ts            ← already scaffolded
4. src/store/themeStore.ts           ← already scaffolded
5. src/hooks/useTheme.ts             ← already scaffolded
6. src/components/layout/AppHeader.tsx
7. src/components/layout/Sidebar.tsx
8. src/components/layout/IOSTabBar.tsx   ← see design spec below
9. src/app/_layout.tsx               ← already scaffolded
10. src/app/index.tsx                ← already scaffolded (splash + auth gate)
```

### PHASE 1 — Auth Flow
```
11. src/app/(auth)/_layout.tsx       ← already scaffolded
12. src/app/(auth)/login.tsx         ← already scaffolded
13. src/app/(auth)/register.tsx      ← already scaffolded
14. src/app/(auth)/email-verification.tsx
```

### PHASE 2 — Main Shell
```
15. src/app/(tabs)/_layout.tsx       ← mounts IOSTabBar, defines tab routes
16. src/app/(tabs)/home.tsx          ← dashboard
```

### PHASE 3 — TTS Tool
```
17. src/app/(tabs)/tools/tts/index.tsx     ← upload states
18. src/app/(tabs)/tools/tts/player.tsx   ← player + word highlight
```

### PHASE 4 — Reading Assistant
```
19. src/app/(tabs)/tools/reading/index.tsx
20. src/app/(tabs)/tools/reading/reader.tsx
21. src/components/ui/DifficultySelector.tsx
```

### PHASE 5 — Writing Assistant
```
22. src/app/(tabs)/tools/writing/index.tsx
23. src/components/ui/ConfidenceTooltip.tsx
24. src/components/ui/ExportOptionsSheet.tsx
```

### PHASE 6 — StudyBuddy
```
25. src/app/(tabs)/tools/studybuddy/quiz/index.tsx
26. src/app/(tabs)/tools/studybuddy/quiz/session.tsx
27. src/app/(tabs)/tools/studybuddy/quiz/results.tsx
28. src/app/(tabs)/tools/studybuddy/quiz/review.tsx
29. src/app/(tabs)/tools/studybuddy/flashcards/index.tsx
30. src/app/(tabs)/tools/studybuddy/flashcards/session.tsx
31. src/app/(tabs)/tools/studybuddy/chat/index.tsx
32. src/app/(tabs)/tools/studybuddy/chat/conversation.tsx
```

### PHASE 7 — Shared UI Components
```
33. src/components/ui/UploadZone.tsx          ← reused across all tools
34. src/components/ui/DocumentRow.tsx         ← reused across all tools
35. src/components/ui/ToolHeroCard.tsx        ← reused across all tools
36. src/components/ui/ColorPickerPopover.tsx
37. src/components/ui/ReadingModeSelector.tsx
38. src/components/ui/SpeedSelector.tsx
39. src/components/shared/PrimaryButton.tsx
40. src/components/shared/OutlineButton.tsx
41. src/components/shared/FAB.tsx
```

---

## SCREEN → ROUTE MAP (complete)

| Screen | File Path |
|---|---|
| Splash / Auth Gate | `src/app/index.tsx` |
| Login | `src/app/(auth)/login.tsx` |
| Register | `src/app/(auth)/register.tsx` |
| Email Verification | `src/app/(auth)/email-verification.tsx` |
| Dashboard | `src/app/(tabs)/home.tsx` |
| TTS Upload | `src/app/(tabs)/tools/tts/index.tsx` |
| TTS Player | `src/app/(tabs)/tools/tts/player.tsx` |
| Reading Upload | `src/app/(tabs)/tools/reading/index.tsx` |
| Reading Reader | `src/app/(tabs)/tools/reading/reader.tsx` |
| Writing Assistant | `src/app/(tabs)/tools/writing/index.tsx` |
| Quiz Upload | `src/app/(tabs)/tools/studybuddy/quiz/index.tsx` |
| Quiz Session | `src/app/(tabs)/tools/studybuddy/quiz/session.tsx` |
| Quiz Results | `src/app/(tabs)/tools/studybuddy/quiz/results.tsx` |
| Quiz Review | `src/app/(tabs)/tools/studybuddy/quiz/review.tsx` |
| Flashcards Upload | `src/app/(tabs)/tools/studybuddy/flashcards/index.tsx` |
| Flashcards Session | `src/app/(tabs)/tools/studybuddy/flashcards/session.tsx` |
| Chat Empty | `src/app/(tabs)/tools/studybuddy/chat/index.tsx` |
| Chat Conversation | `src/app/(tabs)/tools/studybuddy/chat/conversation.tsx` |

---

## iOS DESIGN PRINCIPLES — Apply to every single screen

### 1. Safe Area — Non-negotiable
```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// In every screen root:
const insets = useSafeAreaInsets();

// Top of screen (status bar clearance):
paddingTop: insets.top           // handles notch, Dynamic Island, status bar

// Bottom of screen (home indicator clearance):
paddingBottom: insets.bottom     // handles home indicator bar on iPhone

// Never use:
// paddingTop: 44   ← hardcoded, wrong on different devices
// paddingBottom: 34 ← hardcoded, wrong on different devices
```

### 2. App Header (green bar) — Spec
```tsx
// src/components/layout/AppHeader.tsx

// Height: does NOT include safe area top — parent screen handles that
// The header bar itself is 56pt tall
// Background: colors.brand.primary (#3D7A52)
// Layout: horizontal row, space-between

// LEFT: hamburger (24pt) + gap 12 + logo icon (28pt) + gap 8 + wordmark text
// RIGHT: settings gear (22pt) + gap 16 + moon icon (22pt)

// Status bar: use expo-status-bar with style="light" on all screens with green header
import { StatusBar } from 'expo-status-bar';
<StatusBar style="light" backgroundColor={colors.brand.primary} />

// The green background of the header MUST extend into the status bar area
// Wrap AppHeader with a View that has paddingTop: insets.top + bg: brand.primary
// This makes the status bar icons (time, wifi, battery) appear white on green — matching Figma
```

### 3. IOSTabBar — Bottom Navigation
```tsx
// src/components/layout/IOSTabBar.tsx
// Replace the glassmorphic spec with a cleaner solid iOS-style tab bar

// Design:
// - Background: #FFFFFF (solid white, no blur, no transparency)
// - Border top: 1pt, color: #E5E5E5
// - Height: 49pt (iOS HIG standard) + insets.bottom
// - Tab items: 4 tabs — Home, Tools, History, Profile
// - Active: icon + label in #3D7A52 (green), filled icon variant
// - Inactive: icon + label in #8E8E93 (iOS system gray)
// - Label: 10pt, SF-style weight 500
// - Icon: 24pt
// - No badge animations, no glassmorphism — clean, solid, minimal
// - Shadow: shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 8

// iOS feel on Android: achieved via:
// 1. Solid white background (not material design elevation)
// 2. Hairline top border (not a shadow bar)
// 3. Small crisp label below icon (not floating labels)
// 4. Instant tap response (no ripple) — use TouchableOpacity with activeOpacity: 0.7

// Implementation with Expo Router:
// src/app/(tabs)/_layout.tsx uses Tabs component with tabBar prop
// Pass custom IOSTabBar component as tabBar={() => <IOSTabBar />}

// Never use default bottom tab bar — always use custom IOSTabBar
```

### 4. Typography Hierarchy
```
Page titles:      26-28pt, weight 800, #111111
Section headings: 18-20pt, weight 700, #111111
Body text:        14pt, weight 400, #111111
Muted/captions:   12-13pt, weight 400, #888888
Button labels:    16pt, weight 600, #FFFFFF or #3D7A52
Input labels:     13pt, weight 600, #111111
Tab labels:       10pt, weight 500, active #3D7A52 / inactive #8E8E93
```

### 5. Touch Targets
```
Minimum touch target: 44×44pt (iOS HIG requirement)
All buttons, icons, and interactive elements must meet this minimum
Use padding to expand small icons to 44pt hit area
```

### 6. Input Fields
```
Height: 52pt minimum
Border radius: 50 (full pill)
Border: 1.5pt, #E5E5E5 default / #3D7A52 focused / #EF4444 error
Font size: 16pt minimum inside inputs (prevents iOS auto-zoom on focus)
Background: #FFFFFF
```

### 7. Scroll Behavior
```
All scrollable content: bounces={true} (iOS default — keep it)
showsVerticalScrollIndicator={false} on all ScrollViews
KeyboardAvoidingView behavior: 'padding' on iOS, 'height' on Android
  → Platform.OS === 'ios' ? 'padding' : 'height'
```

### 8. Haptic Feedback
```tsx
import * as Haptics from 'expo-haptics';

// Primary buttons (Login, Submit, Sign Up):
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

// Destructive actions (logout, delete):
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)

// Quiz answer selected:
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

// Flashcard flip:
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

// Copy to clipboard success:
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
```

### 9. Animations
```tsx
// All animations via react-native-reanimated
// Fade in on mount:
const opacity = useSharedValue(0);
useEffect(() => { opacity.value = withTiming(1, { duration: 250 }) }, []);

// Card press scale:
const scale = useSharedValue(1);
const onPressIn = () => { scale.value = withSpring(0.97) };
const onPressOut = () => { scale.value = withSpring(1) };

// Flashcard flip:
const rotation = useSharedValue(0);
const flip = () => { rotation.value = withTiming(rotation.value === 0 ? 1 : 0, { duration: 400 }) };
```

### 10. Loading States
```tsx
// Every API call must have:
// 1. Loading state (button disabled + spinner or text change)
// 2. Error state (inline error message, never silent failure)
// 3. Success state (navigate or update UI)

// Button loading pattern:
<TouchableOpacity disabled={loading} style={[styles.btn, loading && styles.btnDisabled]}>
  {loading
    ? <ActivityIndicator color="#fff" />
    : <Text style={styles.btnText}>Submit</Text>
  }
</TouchableOpacity>
```

---

## SIDEBAR — Route-Driven Config

The Sidebar reads the current pathname and applies active states automatically.
No prop drilling. No manual active state management.

```tsx
// src/components/layout/Sidebar.tsx
import { usePathname } from 'expo-router';

const SIDEBAR_CONFIG = {
  '/(tabs)/home': { activeTop: 'dashboard', expandedSection: null, activeSub: null },
  '/(tabs)/tools/tts': { activeTop: 'tts', expandedSection: 'textEditing', activeSub: null,
    subItems: ['Voice Option', 'Speed', 'Reading Options', 'Dim Surrounding Text', 'Tint Background Colour', 'Highlight Colour'] },
  '/(tabs)/tools/reading': { activeTop: 'reading', expandedSection: 'textEditing', activeSub: null,
    subItems: ['Font Choice', 'Spacing', 'Dim Surrounding Text', 'Tint Background Colour'] },
  '/(tabs)/tools/writing': { activeTop: 'writing', expandedSection: null, activeSub: null },
  '/(tabs)/tools/studybuddy/chat': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'chat' },
  '/(tabs)/tools/studybuddy/flashcards': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'flashcards' },
  '/(tabs)/tools/studybuddy/quiz': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'quiz' },
} as const;
```

---

## UPLOAD PATTERN — Reusable across all tools

All 5 tools (TTS, Reading, Writing, Quiz, Flashcards) share identical upload/submitted states.
Build `UploadZone` and `DocumentRow` as shared components first (Phase 7).

```tsx
// State machine: 'empty' | 'selected' | 'processing' | 'done'
// empty    → show UploadZone
// selected → show DocumentRow + Submit button (dropzone hidden)
// processing → show loading spinner
// done     → navigate to tool-specific result screen

// File pick:
import * as DocumentPicker from 'expo-document-picker';
const pick = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'application/msword', 'text/plain', 'image/*'],
  });
  if (!result.canceled) setFile(result.assets[0]);
};
```

---

## API ENDPOINT REFERENCE

All endpoints relative to base URL in `src/services/api.ts`.

| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | `/auth/register` |
| Login | POST | `/auth/login` |
| Resend verification | POST | `/auth/resend-verification` |
| TTS process | POST | `/audio/process` (multipart) |
| Reading process | POST | `/reading/process` (multipart) |
| Writing clean | POST | `/writing/clean` |
| Quiz generate | POST | `/quiz/generate` (multipart) |
| Quiz submit | POST | `/quiz/submit` |
| Flashcards generate | POST | `/flashcards/generate` (multipart) |
| Chat message | POST | `/chat/message` |

Auth header: `Authorization: Bearer <access_token>` (injected by axios interceptor automatically)

---

## DESIGN DEVIATIONS FROM FIGMA (confirmed decisions)

| Figma | Built As | Reason |
|---|---|---|
| Glassmorphic blur tab bar | Solid white iOS-style tab bar | Cleaner, more native, better Android support |
| 3 large stacked prompt cards in Chat | Compact horizontal scrollable chips | Space efficiency |
| Login footer: "Already have account? Register" | "Don't have an account? Register" | Copy error in Figma |
| "Size maximun" in upload zone | "Size maximum" | Typo fix |
| "Empericism" in chat response | "Empiricism" | Typo fix |
| Reading Assistant: dual upload + doc visible | Swap pattern (same as TTS) | Confirmed UX decision |

---

## DEPENDENCY INSTALL COMMAND

```bash
npx expo install \
  expo-blur \
  expo-document-picker \
  expo-av \
  expo-sharing \
  expo-secure-store \
  expo-clipboard \
  expo-haptics \
  expo-status-bar \
  react-native-reanimated \
  react-native-gesture-handler \
  react-native-safe-area-context \
  react-native-screens \
  zustand \
  axios \
  react-hook-form \
  zod \
  @hookform/resolvers
```

---

## GIT SETUP

```bash
git init
git remote add origin https://github.com/YOUR_ORG/lexiassist-mobile.git
git add .
git commit -m "chore: initial scaffold — 48 screens, full architecture"
git branch -M main
git push -u origin main
```

Recommended branch strategy:
- `main` — production-ready only
- `dev` — integration branch
- `feat/phase-1-auth` → `feat/phase-2-shell` → etc. per build phase above
