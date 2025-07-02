import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = {
  theme: "default",
};

export const useThemStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      toggleTheme: (theme: string) => set({ theme }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
