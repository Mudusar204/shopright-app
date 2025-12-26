import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  image: any;
  title: string;
  price: string;
}

interface WishlistState {
  wishlistItems: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const initialState: Pick<WishlistState, "wishlistItems"> = {
  wishlistItems: [],
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleWishlist: (item) => {
        const exists = get().wishlistItems.find((w) => w.id == item.id);
        if (exists) {
          set({
            wishlistItems: get().wishlistItems.filter((w) => w.id != item.id),
          });
        } else {
          set({
            wishlistItems: [...get().wishlistItems, item],
          });
        }
      },
      isInWishlist: (id) =>
        !!get().wishlistItems.find((w) => String(w.id) == String(id)),
      clearWishlist: () => set(initialState),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
