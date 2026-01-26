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
  expoPushToken: null,
  userLocations: [],
  odooUserAuth: null,
  notificationsEnabled: null, // null means not set yet
  odooAdmin: {
    api_key: "c7a9d323-7149-4ebd-997f-4923787e3609",
    login: "app@gmail.com",
    password: "Shopright1@FSD",
    db: "Production_3_April",
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
            api_key: "c7a9d323-7149-4ebd-997f-4923787e3609",
            login: "app@gmail.com",
            password: "Shopright1@FSD",
            db: "Production_3_April",
          },
        }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
      setExpoPushToken: (expoPushToken: string | null) =>
        set({ expoPushToken }),
      setNotificationsEnabled: (notificationsEnabled: boolean | null) =>
        set({ notificationsEnabled }),

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
