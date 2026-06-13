import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StoreCartItem {
  productId: string;
  handle: string;
  title: string;
  image: string;
  price: number; // in INR rupees
  quantity: number;
  stock: number;
}

interface StoreCartState {
  items: StoreCartItem[];
  addItem: (item: Omit<StoreCartItem, "quantity">, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useStoreCart = create<StoreCartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          const next = Math.min(existing.quantity + qty, item.stock || 99);
          set({ items: get().items.map((i) => i.productId === item.productId ? { ...i, quantity: next } : i) });
        } else {
          set({ items: [...get().items, { ...item, quantity: Math.min(qty, item.stock || 99) }] });
        }
      },
      updateQty: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }
        set({ items: get().items.map((i) => i.productId === productId ? { ...i, quantity: Math.min(qty, i.stock || 99) } : i) });
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "punarvsu-cart", storage: createJSONStorage(() => localStorage) }
  )
);
