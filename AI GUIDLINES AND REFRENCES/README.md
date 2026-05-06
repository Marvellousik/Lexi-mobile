# LexiAssist Mobile

Enterprise-grade AI-powered learning platform. React Native + Expo Router. iOS-quality feel on both platforms.

## Stack
- **Framework**: Expo SDK 52 + Expo Router v4
- **Language**: TypeScript (strict)
- **State**: Zustand
- **Forms**: react-hook-form + zod
- **Auth**: JWT (Go backend)
- **Animation**: react-native-reanimated
- **Storage**: expo-secure-store (tokens)

## Setup

```bash
npm install
npx expo start
```

## Agent Build Instructions
See `AGENT_INSTRUCTIONS.md` — feed this to your coding agent as the primary prompt.

## Screen Spec
See `AGENT_INSTRUCTIONS.md` Section 1 for build order.
Full screen-by-screen design spec is in the shared `splash-screen.md` doc.

## Backend
Go microservices. Base URL configured in `src/services/api.ts`.
Update `BASE_URL` production value when deployed to Render/AWS.

## Environment
No `.env` file needed — all config lives in `app.json` and `src/services/api.ts`.
