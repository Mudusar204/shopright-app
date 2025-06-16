import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GlobalStore {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (value: boolean) => void;
  clear: () => void;
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      isBottomSheetOpen: false,
      setIsBottomSheetOpen: (value) => set({ isBottomSheetOpen: value }),
      clear: () => set({ isBottomSheetOpen: false }),
    }),
    {
      name: "global-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
