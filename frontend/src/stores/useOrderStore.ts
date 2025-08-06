import { create } from "zustand";
import axiosInstance from "@/lib/axios";

import type { Order } from "@/types";

interface OrderStore {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  addOrder: (orderItems: Object) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: null,
  isLoading: false,
  error: null,

  addOrder: async (orderItems) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/orders", orderItems);
      console.log("Order created successfully:", response.data);
      set({ order: response.data });
    } catch (error: any) {
      set({
        error: error.response.data.message || "Failed to create order",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
