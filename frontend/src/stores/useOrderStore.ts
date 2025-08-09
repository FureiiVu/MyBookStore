import { create } from "zustand";
import axiosInstance from "@/lib/axios";

import type { Order } from "@/types";
import toast from "react-hot-toast";

interface OrderStore {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  addOrder: (orderItems: Object) => Promise<void>;
  getOrder: () => Promise<void>;
  reset: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: null,
  isLoading: false,
  error: null,

  addOrder: async (orderItems) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/orders", orderItems);
      set({ order: response.data.order });
    } catch (error: any) {
      set({
        error: error.response.data.message || "Failed to create order",
      });
      toast.error("Thêm đơn hàng thất bại");
    } finally {
      set({ isLoading: false });
    }
  },

  getOrder: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/orders");
      const orders = response.data.orders;
      if (orders && orders.length > 0) {
        set({ order: orders[orders.length - 1] });
      } else {
        set({ order: null });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch order",
        order: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({ order: null, isLoading: false, error: null }),
}));
