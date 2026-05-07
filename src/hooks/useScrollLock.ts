import { useSidebarStore } from '@/stores/sidebarStore';

/**
 * useScrollLock
 *
 * Returns a boolean indicating whether background scrolling should be disabled.
 * All ScrollViews, FlatLists, and SectionLists MUST consume this hook
 * when rendered inside the Tabs layout to ensure the sidebar can lock
 * content interaction when open.
 *
 * Usage:
 *   const scrollEnabled = useScrollLock();
 *   <ScrollView scrollEnabled={scrollEnabled}>...</ScrollView>
 */
export function useScrollLock(): boolean {
  return useSidebarStore((s) => !s.isOpen);
}
