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
  syncCartPrices: (products: Array<{ id: number | string; list_price: number }>) => void;
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
        const existingItem = currentItems.find((i) => i.id == item.id);

        if (existingItem) {
          set({
            cartItems: currentItems.map((i) =>
              i.id == item.id ? { ...i, quantity: i.quantity + 1 } : i
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
          cartItems: get().cartItems.filter((item) => item.id != id),
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
      syncCartPrices: (products) => {
        const currentItems = get().cartItems;
        const updatedItems = currentItems
          .map((cartItem) => {
            // Find matching product by ID
            const product = products.find(
              (p) => String(p.id) === String(cartItem.id)
            );

            if (product) {
              // Update price with current product price
              const newPrice = String(product.list_price);
              // Only update if price has changed
              if (cartItem.price !== newPrice) {
                return { ...cartItem, price: newPrice };
              }
              return cartItem;
            }
            // If product not found, keep the item (or remove it if you prefer)
            // For now, we'll keep it with old price
            return cartItem;
          })
          .filter((item) => {
            // Optional: Remove items if product no longer exists
            // Uncomment the line below if you want to remove unavailable products
            // return products.some((p) => String(p.id) === String(item.id));
            return true; // Keep all items for now
          });

        set({ cartItems: updatedItems });
      },
    }),
    {
      name: "myCart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
