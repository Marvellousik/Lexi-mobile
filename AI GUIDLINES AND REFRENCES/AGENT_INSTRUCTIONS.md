# LexiAssist Mobile — Agent Build Order & Design Principles
# Feed this file to your coding agent as the primary instruction set.
# Every decision here maps directly to the screen spec doc (splash-screen.md).

---

## SECTION 1 — BUILD ORDER (execute in sequence, do not skip steps)

### PHASE 0 — Foundation (build first, everything depends on this)
```
1. src/constants/colors.ts          ← tokens, already scaffolded
2. src/services/api.ts              ← axios + JWT interceptor, already scaffolded
3. src/services/auth.service.ts     ← register/login/resend, already scaffolded
4. src/services/tools.service.ts    ← all tool API calls, already scaffolded
5. src/store/authStore.ts           ← zustand + SecureStore, already scaffolded
6. src/store/themeStore.ts          ← dark mode toggle, already scaffolded
7. src/hooks/useTheme.ts            ← dark/light token switcher, already scaffolded
```

### PHASE 1 — Shell & Navigation
```
8.  src/app/_layout.tsx                          ← root layout, hydrates auth
9.  src/app/index.tsx                            ← splash screen + auth redirect
10. src/components/layout/AppHeader.tsx          ← green header, hamburger, settings, moon
11. src/components/layout/Sidebar.tsx            ← drawer, route-driven active states
12. src/components/layout/GlassTabBar.tsx        ← iOS-feel solid bottom nav (see Section 3)
13. src/app/(auth)/_layout.tsx
14. src/app/(auth)/login.tsx                     ← already scaffolded
15. src/app/(auth)/register.tsx                  ← already scaffolded
16. src/app/(auth)/email-verification.tsx        ← mailbox icon, Resend, 60s countdown
17. src/app/(tabs)/_layout.tsx                   ← tab navigator wiring GlassTabBar
18. src/app/(tabs)/home.tsx                      ← dashboard, tool cards, recent items, FAB
```

### PHASE 2 — TTS Tool
```
19. src/app/(tabs)/tools/tts/index.tsx           ← upload empty → doc uploaded swap
20. src/app/(tabs)/tools/tts/player.tsx          ← playback controls, word highlight, export MP3
21. src/components/ui/SpeedSelector.tsx          ← 0.75x/1.0x/1.25x/1.5x/2.0x popover
22. src/components/ui/ReadingModeSelector.tsx    ← Word by Word / Line by Line popover
23. src/components/ui/ColorPickerPopover.tsx     ← 4x4 pastel swatch grid
```

### PHASE 3 — Reading Assistant
```
24. src/app/(tabs)/tools/reading/index.tsx       ← upload → swap → submit
25. src/app/(tabs)/tools/reading/reader.tsx      ← yellow card, simplified text dropdown, expand icon
26. src/components/ui/DifficultySelector.tsx     ← Beginner / Intermediate popover
```

### PHASE 4 — Writing Assistant
```
27. src/app/(tabs)/tools/writing/index.tsx       ← mic recording, confidence dot, word highlights
28. src/components/ui/ConfidenceTooltip.tsx      ← info modal for low confidence
29. src/components/ui/ExportOptionsSheet.tsx     ← Download as docx / Export to Google docx (stub Google)
```

### PHASE 5 — StudyBuddy: Quizzes
```
30. src/app/(tabs)/tools/studybuddy/quiz/index.tsx    ← upload → swap → submit
31. src/app/(tabs)/tools/studybuddy/quiz/session.tsx  ← Q1→Qn, option selection, Next/Previous/Finish
32. src/app/(tabs)/tools/studybuddy/quiz/results.tsx  ← score, avatar, Try Again / Check Answers
33. src/app/(tabs)/tools/studybuddy/quiz/review.tsx   ← all Qs, green correct, red border wrong
```

### PHASE 6 — StudyBuddy: Flashcards
```
34. src/app/(tabs)/tools/studybuddy/flashcards/index.tsx    ← upload → swap → submit
35. src/app/(tabs)/tools/studybuddy/flashcards/session.tsx  ← flip card animation, ←/→ nav
```

### PHASE 7 — StudyBuddy: Chat Assistant
```
36. src/app/(tabs)/tools/studybuddy/chat/index.tsx          ← greeting, input, horizontal prompt chips
37. src/app/(tabs)/tools/studybuddy/chat/conversation.tsx   ← user bubble, AI plain text, pinned input
```

### PHASE 8 — Shared Components (build alongside Phase 2–7 as needed)
```
38. src/components/shared/UploadZone.tsx         ← reusable dashed upload area (used by all tools)
39. src/components/shared/DocRow.tsx             ← reusable uploaded file row with dismiss
40. src/components/shared/ToolHeroCard.tsx       ← reusable colored hero card with illustration
41. src/components/shared/FAB.tsx               ← green floating action button
42. src/components/shared/PrimaryButton.tsx      ← full-width green pill button
43. src/components/shared/OutlineButton.tsx      ← green border, white bg pill button
```

---

## SECTION 2 — SCREEN STATE RULES (agent must follow these)

### Upload screens — ALL tools use the same swap pattern:
```
state: file = null  → show <UploadZone />
state: file = set   → show <DocRow file={file} /> + <PrimaryButton label="Submit" />
NEVER show both simultaneously.
```

### Sidebar active state — route-driven, not prop-driven:
```tsx
// Inside Sidebar.tsx
import { usePathname } from 'expo-router';
const pathname = usePathname();
// Map pathname → active item + expanded section + active sub-item
// See toolsConfig in splash-screen.md Screen 38
```

### Dark mode — ALL screens must consume useTheme():
```tsx
const { bg, card, text } = useTheme();
// Apply to: screen background, card backgrounds, text colors
// AppHeader and brand buttons stay green in both modes
```

### Countdown timer (email verification):
```tsx
// Local state only — do NOT persist to store
const [countdown, setCountdown] = useState(0);
// Start at 60 on Resend tap, decrement every second, stop at 0
// Show red "Link expires in {countdown}s" only when countdown > 0
```

---

## SECTION 3 — iOS-QUALITY DESIGN PRINCIPLES (apply to every screen)

### 3.1 — Safe Area & Status Bar
```tsx
// RULE: Every screen must respect safe areas — no content behind status bar or home indicator
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// AppHeader.tsx
const insets = useSafeAreaInsets();
// Header container paddingTop = insets.top (this handles iPhone notch + Dynamic Island)
// Minimum paddingTop = insets.top, never hardcode 44 or 20

// Bottom nav bar
// paddingBottom = insets.bottom (handles home indicator on iPhone)
// Tab icons/labels sit ABOVE the safe area, not inside it

// Status bar style
import { StatusBar } from 'expo-status-bar';
// On green screens (splash, header): <StatusBar style="light" />
// On white screens: <StatusBar style="dark" />
```

### 3.2 — Bottom Navigation Bar (Solid iOS-feel, works on Android too)
```tsx
// src/components/layout/GlassTabBar.tsx
// Design: solid white card elevated above content — NOT transparent glass
// This gives the clean iOS tab bar feel without expo-blur dependency issues

import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Visual spec:
const TAB_BAR_STYLE = {
  backgroundColor: '#FFFFFF',
  borderTopWidth: 0,                    // no default border
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.06,
  shadowRadius: 16,
  elevation: 20,                        // Android shadow
  borderTopLeftRadius: 20,              // iOS-style rounded top corners
  borderTopRightRadius: 20,
};

// Tab item spec:
// - Icon: 24pt, filled variant when active, outlined when inactive
// - Label: 10pt, below icon, 4pt gap
// - Active color: colors.brand.primary (#3D7A52)
// - Inactive color: #AAAAAA
// - Active indicator: 3pt green dot or underline above icon (optional iOS pill)
// - paddingTop: 12, paddingBottom: insets.bottom + 8
// - No background highlight on press — use opacity feedback (activeOpacity: 0.7)

// Tabs (4 items):
// Home    → house icon     → /(tabs)/home
// Tools   → grid icon      → /(tabs)/tools  [optional — or use sidebar only]
// History → clock icon     → /(tabs)/history
// Profile → person icon    → /(tabs)/profile
```

### 3.3 — AppHeader Spacing
```tsx
// src/components/layout/AppHeader.tsx
// Height: insets.top + 56 (56pt is the tappable header zone)
// Content aligns to bottom of that zone, not top
// Left: 16pt from edge → [hamburger 20pt] → 12pt gap → [logo icon 28pt] → 8pt → [wordmark]
// Right: [settings 22pt] → 20pt gap → [moon 22pt] → 16pt from edge
// Icons: minimum 44x44pt touch target (iOS HIG requirement)
// Wrap each icon in a 44x44 TouchableOpacity even if the icon is smaller
```

### 3.4 — Typography Scale (iOS HIG aligned)
```
Page titles (h1):     26-28pt, weight 700-800  → bold, prominent
Section headings (h2): 18-22pt, weight 700
Body text:             14-15pt, weight 400      → comfortable reading
Labels/captions:       12-13pt, weight 500-600
Button text:           15-16pt, weight 600
Tab labels:            10pt, weight 500
Minimum tappable text: 16pt (prevents iOS auto-zoom on inputs)
```

### 3.5 — Spacing System (use only these values)
```
4pt  — micro gaps (icon-to-label)
8pt  — tight gaps (related elements)
12pt — small gaps
16pt — standard horizontal padding (screen edges)
20pt — comfortable padding
24pt — section spacing (preferred horizontal padding)
32pt — large section gap
48pt — extra large (between major content blocks)

Screen horizontal padding: 24pt left + 24pt right (consistent across all screens)
Card internal padding: 16pt
Input height: 52pt minimum (iOS touch target)
Button height: 52pt minimum
FAB size: 56pt diameter
```

### 3.6 — Interactive Feedback (iOS feel)
```tsx
// All tappable elements:
<TouchableOpacity activeOpacity={0.75}>  // subtle press feedback

// Form inputs — CRITICAL for iOS:
// minFontSize: 16 on all TextInput to prevent iOS auto-zoom on focus
<TextInput style={{ fontSize: 16 }} />

// List items and cards:
// Use Pressable with style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}

// Haptics on key actions (optional but adds to iOS feel):
import * as Haptics from 'expo-haptics';
// On button press: Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
// On error: Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
// On success: Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
// Add expo-haptics to package.json if using this
```

### 3.7 — Cards & Elevation
```
Tool hero cards:    borderRadius: 16, no shadow (colored bg provides depth)
Content cards:      borderRadius: 16, shadow: { color: #000, offset: 0 4, opacity: 0.06, radius: 12 }
Input fields:       borderRadius: 50 (pill), borderWidth: 1.5, borderColor: #E5E5E5
Popovers/modals:    borderRadius: 16, shadow: { color: #000, offset: 0 8, opacity: 0.12, radius: 24 }
Bottom sheets:      borderTopLeftRadius: 24, borderTopRightRadius: 24
Flashcard:          borderRadius: 20, no border
```

### 3.8 — Scroll Behavior
```tsx
// All scrollable screens:
<ScrollView
  showsVerticalScrollIndicator={false}  // clean iOS look
  contentContainerStyle={{ paddingBottom: 100 }}  // space above tab bar
  bounces={true}  // iOS rubber-band scroll
/>

// Lists with many items: use FlatList with keyExtractor, never map() inside ScrollView
```

### 3.9 — Keyboard Handling (critical for auth + chat screens)
```tsx
// Auth screens (login, register):
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

// Chat screen (pinned input):
// Input bar must rise WITH keyboard on iOS
// Use KeyboardAvoidingView + keyboardVerticalOffset = insets.top + 56 (header height)
```

### 3.10 — Animation (Reanimated — no Animated API)
```tsx
// Use react-native-reanimated for ALL animations:
// - Sidebar slide-in: translateX with spring config
// - Flashcard flip: rotateY with timing 400ms
// - Copied button state: layout animation
// - Score screen entry: FadeIn + SlideInDown
// Spring config for iOS feel:
{
  damping: 20,
  stiffness: 200,
  mass: 0.8,
}
```

---

## SECTION 4 — SHARED COMPONENT CONTRACTS

```tsx
// UploadZone.tsx
interface UploadZoneProps {
  onFilePicked: (file: { uri: string; name: string; mimeType: string }) => void;
}

// DocRow.tsx
interface DocRowProps {
  filename: string;
  fileType: string;
  onDismiss: () => void;
}

// ToolHeroCard.tsx
interface ToolHeroCardProps {
  title: string;
  description: string;
  backgroundColor: string;
  illustration: React.ReactNode; // pass Image or SVG
}

// PrimaryButton.tsx
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// FAB.tsx
interface FABProps {
  onPress: () => void;
  icon?: string; // defaults to '+'
}
// FAB position: absolute, bottom: 24 + insets.bottom, right: 24
```

---

## SECTION 5 — API ENDPOINT MAP (Go backend)

```
POST /api/v1/auth/register               → Register
POST /api/v1/auth/login                  → Login → returns { data: { access_token, refresh_token, user } }
POST /api/v1/auth/resend-verification    → Resend email
POST /api/v1/audio/process               → TTS: upload file → returns { text, audioUrl, wordTimestamps }
POST /api/v1/reading/process             → Reading: upload + level → returns { simplifiedText }
POST /api/v1/writing/clean               → Writing: transcript text → returns { cleaned, tokens: [{word, confidence}] }
POST /api/v1/quiz/generate               → Quiz: upload file → returns { sessionId, questions[] }
POST /api/v1/quiz/submit                 → Quiz: submit answers → returns { score, total, results[] }
POST /api/v1/flashcards/generate         → Flashcards: upload → returns { cards: [{question, answer}] }
POST /api/v1/chat/message                → Chat: message + optional file → returns { response }
```

---

## SECTION 6 — FILES ALREADY SCAFFOLDED (do not recreate)

```
src/constants/colors.ts       ✅
src/services/api.ts           ✅
src/services/auth.service.ts  ✅
src/services/tools.service.ts ✅
src/store/authStore.ts        ✅
src/store/themeStore.ts       ✅
src/hooks/useTheme.ts         ✅
src/app/_layout.tsx           ✅
src/app/index.tsx             ✅
src/app/(auth)/_layout.tsx    ✅
src/app/(auth)/login.tsx      ✅
src/app/(auth)/register.tsx   ✅
package.json                  ✅
app.json                      ✅
tsconfig.json                 ✅
babel.config.js               ✅
```

---

## SECTION 7 — REPO SETUP COMMANDS (run once after cloning)

```bash
# 1. Install dependencies
npm install

# 2. Install Expo CLI globally if not present
npm install -g expo-cli

# 3. Start dev server
npx expo start

# 4. Run on iOS simulator
npx expo start --ios

# 5. Run on Android emulator
npx expo start --android
```

## Git Init & First Push
```bash
git init
git add .
git commit -m "feat: initial scaffold — LexiAssist mobile"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/lexiassist-mobile.git
git push -u origin main
```

---

## SECTION 8 — AGENT RULES (non-negotiable)

1. Build in phase order — never jump ahead.
2. Every screen consumes `useTheme()` for bg/text/card colors.
3. Every screen wraps content in `SafeAreaView` or applies `useSafeAreaInsets()`.
4. Every input has `fontSize: 16` minimum.
5. Every tappable element has a minimum 44x44pt touch target.
6. No hardcoded hex values in component files — always import from `constants/colors.ts`.
7. No `Animated` API — always use `react-native-reanimated`.
8. No `StyleSheet.flatten` or inline style objects on hot paths.
9. Shared patterns (UploadZone, DocRow, ToolHeroCard, FAB) must be built once and reused — never duplicated per tool screen.
10. All API calls go through `src/services/` — never call `fetch` or `axios` directly in a screen.
