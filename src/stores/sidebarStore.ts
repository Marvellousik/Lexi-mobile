import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  isScrollLocked: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setScrollLocked: (locked: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  isScrollLocked: false,
  openSidebar: () => set({ isOpen: true, isScrollLocked: true }),
  closeSidebar: () => set({ isOpen: false, isScrollLocked: false }),
  toggleSidebar: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      isScrollLocked: !state.isOpen,
    })),
  setScrollLocked: (locked) => set({ isScrollLocked: locked }),
}));
