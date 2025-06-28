import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LocationStore {
  location: any;
  address: any;
  locationGranted: boolean;
  locationServicesEnabled: boolean;
  loading: boolean;
  updateLocationState: (key: keyof typeof initialState, value: any) => void;
  clear: () => void;
}

const initialState = {
  location: null,
  address: null,
  locationGranted: false,
  locationServicesEnabled: false,
  loading: false,
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateLocationState: (
        key: keyof typeof initialState,
        value: (typeof initialState)[keyof typeof initialState]
      ) => {
        set({ [key]: value });
      },
      clear: () => {
        set({
          location: null,
          address: null,
          locationGranted: false,
          locationServicesEnabled: false,
          loading: false,
        });
      },
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
