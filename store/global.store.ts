import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GlobalStore {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  clear: () => void;
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      isModalVisible: false,
      setIsModalVisible: (value) => set({ isModalVisible: value }),
      clear: () => set({ isModalVisible: false }),
    }),
    {
      name: 'global-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
