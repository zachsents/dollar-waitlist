import { create } from "zustand"

export const useStore = create((set) => ({
    mobileCardOpen: false,
    openMobileCard: () => set({ mobileCardOpen: true }),
    closeMobileCard: () => set({ mobileCardOpen: false }),
}))
