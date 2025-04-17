import { AuthStoreState, AuthStoreActions, User } from '@/types/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState: AuthStoreState = {
  isLoggedIn: false,
  isLoading: false,
  token: null,
  isOnboarded: false,
  user: null,
  searchedUsers: [],
};

export const useAuthStore = create(
  persist<AuthStoreState & AuthStoreActions>(
    (set, get) => ({
      ...initialState,
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),

      setUser: (user: User | null) => set({ user }),
      setToken: (token: string) => set({ token }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setOnboarded: (isOnboarded: boolean) => set({ isOnboarded }),
      setSearchedUsers: (searchedUsers: any[]) => set({ searchedUsers }),
      clear: () => {
        set({
          isLoggedIn: false,
          token: null,
          user: null,
          isLoading: false,
          searchedUsers: [],
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
