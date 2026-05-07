# LexiAssist Architecture Recovery Log

**Date:** 2026-05-07  
**Incident Severity:** Production-blocking infinite loop  
**Root Cause:** Zustand store anti-patterns causing `useSyncExternalStore` infinite re-renders  
**Status:** RESOLVED

---

## Executive Summary

The application experienced a catastrophic render loop that manifested as two simultaneous infinite loops:

1. **The `useSyncExternalStore` Snapshot Loop** - `useTheme.ts` returned a new object literal on every selector invocation, triggering React's external store subscription to believe state had changed continuously.

2. **The Derived State Function Loop** - `authStore.ts` exposed `isAuthenticated` as an unstable arrow function inside Zustand state. Components selecting this function received a new reference on every store update, causing `useEffect` dependency arrays to fire navigation actions that triggered parent re-renders, which triggered new function references...

The fix required architectural corrections across three files and established three foundational rules for all future Zustand usage in this codebase.

---

## Problem 1: Unstable Zustand Selector in `useTheme.ts`

### Original Code (Anti-Pattern)

```typescript
export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { isDark: manualOverride, hasManualOverride } = useThemeStore((s) => ({
    isDark: s.isDark,
    hasManualOverride: s.hasManualOverride,
  }));
  // ... returns new object every call
};
```

### Why This Breaks

Zustand uses React's `useSyncExternalStore` hook internally. This API requires the `getSnapshot` function to return **referentially stable** values when the underlying data has not changed.

When you return `{ isDark: false, hasManualOverride: false }` as a fresh object literal, React compares the previous snapshot to the new snapshot using `Object.is`. Because `{} !== {}` in JavaScript, React concludes the external store has updated. It schedules a re-render. The component re-renders. The selector runs again. Another new object. Another false positive. Infinite loop.

The error message `The result of getSnapshot should be cached to avoid an infinite loop` is React literally telling you that your snapshot function is returning new references.

### Corrected Code

```typescript
export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const manualOverride = useThemeStore((s) => s.isDark);
  const hasManualOverride = useThemeStore((s) => s.hasManualOverride);

  const isDark = hasManualOverride ? manualOverride : systemColorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return useMemo(() => ({ ...colors, isDark }), [colors, isDark]);
};
```

### Key Changes

- **Primitive Selection:** Select `s.isDark` and `s.hasManualOverride` as individual primitives. Primitives (boolean, string, number) are compared by value, not reference.
- **Memoized Return:** The final returned object is wrapped in `useMemo` to prevent downstream components from re-rendering when the theme hasn't actually changed.

---

## Problem 2: Derived State Stored as Unstable Function in `authStore.ts`

### Original Code (Anti-Pattern)

```typescript
interface AuthState {
  user: User | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;  // DERIVED STATE - ANTI-PATTERN
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      // ... other actions
      isAuthenticated: () => !!get().user,  // NEW FUNCTION ON EVERY SET()
    }),
    // ...
  )
);
```

### Why This Breaks

Every time `set()` is called inside the store (e.g., during auth state changes), Zustand creates a new state object. Because `isAuthenticated` is defined as an arrow function inside the state creator, it is **recreated as a new function reference** on every state update.

When a component selects this function:

```typescript
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
```

The `isAuthenticated` variable holds a new function reference on every render. This causes two problems:

1. **Zustand Subscription Thrashing:** The selector returns a new reference, so Zustand thinks the subscribed value changed. It forces a re-render. The component re-renders. The selector runs again. Another new function reference. Loop.

2. **useEffect Explosion:** When this unstable function is placed in a `useEffect` dependency array:
   ```typescript
   useEffect(() => {
     if (!isAuthenticated()) {
       router.replace('/(auth)/login');
     }
   }, [isAuthenticated]);
   ```
   The effect fires on every render because `isAuthenticated` is a new function each time. Inside the effect, navigation mutations trigger parent layout re-renders, which trigger more auth store selectors, which get more new function references...

This is the `Maximum update depth exceeded` error. React caps nested updates at 50 to prevent the JavaScript thread from freezing entirely.

### Corrected Code

```typescript
interface AuthState {
  user: User | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  // NO isAuthenticated here - it is derived, not stored
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: async (user, accessToken, refreshToken) => {
        await SecureStore.setItemAsync('access_token', accessToken);
        await SecureStore.setItemAsync('refresh_token', refreshToken);
        set({ user });
      },
      logout: async () => {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

### Key Changes

- **Removed Derived State:** `isAuthenticated` is no longer in the store. It is computed from `user`.
- **Stable Actions:** Actions (`setAuth`, `logout`) are stable because Zustand internally preserves action references across state updates.

---

## Problem 3: Components Selecting Unstable Functions

### Files Affected

- `src/app/(tabs)/_layout.tsx`
- `src/app/(auth)/_layout.tsx`
- `src/app/index.tsx`

### Original Pattern (Anti-Pattern)

```typescript
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

useEffect(() => {
  if (!isAuthenticated()) {
    router.replace('/(auth)/login');
  }
}, [isAuthenticated]);
```

### Corrected Pattern

```typescript
const user = useAuthStore((s) => s.user);
const isAuthenticated = user !== null;

useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/(auth)/login');
  }
}, [isAuthenticated, router]);
```

### Key Changes

- **Select Primitives:** Select `user` (a stable reference when null, or a stable object when populated) instead of a derived function.
- **Local Derivation:** Compute `isAuthenticated` as a local boolean derived from the primitive.
- **Memoized Dependencies:** The `useEffect` dependency array now contains stable values that only change when auth state actually changes.

---

## Architectural Rules Established

### Rule 1: Zustand Selectors Must Return Stable References

**VIOLATION:**
```typescript
const values = useStore((s) => ({ a: s.a, b: s.b }));  // NEW OBJECT EVERY TIME
```

**CORRECT:**
```typescript
const a = useStore((s) => s.a);
const b = useStore((s) => s.b);
// OR
const values = useStore((s) => ({ a: s.a, b: s.b }), shallow);
```

If you need multiple values, either:
- Use multiple `useStore` calls (React will batch the updates)
- Use Zustand's `shallow` comparator: `useStore(selector, shallow)`
- Memoize the derived object with `useMemo` outside the selector

### Rule 2: Never Store Derived State in Zustand

**VIOLATION:**
```typescript
interface Store {
  items: Item[];
  itemCount: () => number;  // DERIVED
  isEmpty: () => boolean;   // DERIVED
}
```

**CORRECT:**
```typescript
interface Store {
  items: Item[];
}

// Derived selectors live outside the store
const selectItemCount = (s: Store) => s.items.length;
const selectIsEmpty = (s: Store) => s.items.length === 0;
```

Store state should be **plain, serializable data**. Computed values belong in:
- Selectors defined outside the store
- Local component derivations from primitives
- Memoized hooks (`useMemo`, `useCallback`)

### Rule 3: Never Select Functions from Zustand State

**VIOLATION:**
```typescript
const myAction = useStore((s) => s.myAction);  // POTENTIALLY UNSTABLE
```

**CORRECT:**
```typescript
// Zustand actions ARE stable, but derived functions ARE NOT
// Select primitives only, derive locally
const user = useStore((s) => s.user);
const isAdmin = user?.role === 'admin';
```

If you must select an action (which Zustand does stabilize), be absolutely certain it's defined as a stable method in the store creator, not as a derived arrow function.

---

## File Change Log

| File | Change | Reason |
|------|--------|--------|
| `src/hooks/useTheme.ts` | Split object selector into primitive selectors; added `useMemo` | Prevent `useSyncExternalStore` infinite loop from unstable snapshot |
| `src/stores/authStore.ts` | Removed `isAuthenticated` derived function from state | Prevent unstable function references causing re-render thrashing |
| `src/app/(tabs)/_layout.tsx` | Select `user` primitive; derive `isAuthenticated` locally | Stable dependency array; prevent navigation loop |
| `src/app/(auth)/_layout.tsx` | Select `user` primitive; derive `isAuthenticated` locally | Stable dependency array; prevent navigation loop |
| `src/app/index.tsx` | Select `user` primitive; derive `isAuthenticated` locally | Stable dependency array; prevent navigation loop |

---

## Testing Verification

After applying fixes:

1. **Metro bundler** completes without infinite loop errors
2. **Splash screen** animates once, then routes correctly based on auth state
3. **Tab layout** mounts without `Maximum update depth exceeded`
4. **Theme switching** works without re-render storms
5. **Navigation guards** execute exactly once per auth state change

---

## Prevention Checklist

Before committing any Zustand-related code, verify:

- [ ] Selectors return primitives or use `shallow`
- [ ] No derived functions stored in state
- [ ] No object literals returned from selectors without memoization
- [ ] `useEffect` dependency arrays contain only stable references
- [ ] Store state is serializable (no functions in persisted state)

---

## References

- React `useSyncExternalStore` RFC: https://github.com/reactjs/rfcs/blob/main/text/0214-use-sync-external-store.md
- Zustand Best Practices: https://docs.pmnd.rs/zustand/guides/prevent-rerenders-with-equality-fn
- Zustand `shallow` comparator: `import { shallow } from 'zustand/shallow'`

---

**Document Author:** Senior Staff Engineer Review  
**Review Date:** 2026-05-07  
**Next Review:** On next Zustand store addition or modification
