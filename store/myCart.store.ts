import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  image: any;
  title: string;
  price: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const initialState = {
  cartItems: [],
};

export const useMyCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addToCart: (item) => {
        const currentItems = get().cartItems;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            cartItems: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            cartItems: [...currentItems, { ...item, quantity: 1 }],
          });
        }
      },
      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== id),
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(id);
          return;
        }
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => {
        set(initialState);
      },
      getTotalPrice: () => {
        return get().cartItems.reduce(
          (total, item) => total + parseFloat(item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "myCart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
