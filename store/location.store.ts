import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LocationStore {
  postCoordinates: {
    latitude: number;
    longitude: number;
  } | null;
  postLocation: any;
  useCurrectLocation: boolean;
  mapLocationsWeather: any[];
  pastSearchLocations: any[];
  loading: boolean;
  setCurrentLocation: (useCurrectLocation: boolean) => void;
  setPostLocation: (postLocation: any) => void;
  setPastSearchLocations: (pastSearchLocations: any) => void;
  setPostCoordinates: (postCoordinates: any) => void;
  setMapLocationsWeather: (mapLocationsWeather: any) => void;
  updateLocationState: (key: keyof typeof initialState, value: any) => void;
  clear: () => void;
}

const initialState = {
  location: null,
  address: null,
  locationGranted: false,
  locationServicesEnabled: false,
  loading: false,
  postLocation: null,
  postCoordinates: null,
  useCurrectLocation: false,
  mapLocationsWeather: [],
  pastSearchLocations: [
    { areaName: 'London', latitude: 51.507351, longitude: -0.127758 },
    { areaName: 'Washington', latitude: 38.9071923, longitude: -77.0368707 },
    { areaName: 'New York', latitude: 40.7127753, longitude: -74.0059728 },
    { areaName: 'Tokyo', latitude: 35.6894875, longitude: 139.6917064 },
  ],
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentLocation: (useCurrectLocation: boolean) => {
        set({ useCurrectLocation });
      },
      setPostLocation: (postLocation: any) => set({ postLocation }),
      setPastSearchLocations: (pastSearchLocations: any) =>
        set({ pastSearchLocations }),
      setPostCoordinates: (postCoordinates: any) => set({ postCoordinates }),
      setMapLocationsWeather: (mapLocationsWeather: any) =>
        set({ mapLocationsWeather }),
      updateLocationState: (
        key: keyof typeof initialState,
        value: typeof initialState[keyof typeof initialState]
      ) => {
        set({ [key]: value });
      },
      clear: () => {
        set({
          // location: null,
          // address: null,
          loading: false,
          postLocation: null,
          postCoordinates: null,
          useCurrectLocation: false,
          mapLocationsWeather: [],
          pastSearchLocations: [],
        });
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
