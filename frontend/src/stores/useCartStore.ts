import { create } from "zustand";
import axiosInstance from "@/lib/axios";

import type { Cart } from "@/types";

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
}

const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/cart");
      set({ cart: response.data });
      console.log("Cart fetched successfully:", response.data);
    } catch (error: any) {
      set({ error: error.response.data.message || "Failed to fetch cart" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useCartStore;
