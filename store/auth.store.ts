import {
  AuthStoreState,
  AuthStoreActions,
  OdooAdmin,
  OdooUser,
  OdooUserAuth,
} from "@/types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState: AuthStoreState = {
  isLoggedIn: false,
  isLoading: false,
  isOnboarded: false,
  odooUser: null,
  userLocations: [],
  odooUserAuth: null,
  odooAdmin: {
    api_key: "b24aed76-7b58-42d1-b615-17fa1a87f8bb",
    login: "admin",
    password: "admin",
    db: "Testing",
  },
};

export const useAuthStore = create(
  persist<AuthStoreState & AuthStoreActions>(
    (set, get) => ({
      ...initialState,
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),

      setOdooUser: (user: OdooUser | null) => set({ odooUser: user }),
      setOdooUserAuth: (userAuth: OdooUserAuth | null) =>
        set({ odooUserAuth: userAuth }),
      setOdooAdmin: () =>
        set({
          odooAdmin: {
            api_key: "b24aed76-7b58-42d1-b615-17fa1a87f8bb",
            login: "admin",
            password: "admin",
            db: "Testing",
          },
        }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
      clear: () => {
        set({
          isLoggedIn: false,
          odooUser: null,
          odooUserAuth: null,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
