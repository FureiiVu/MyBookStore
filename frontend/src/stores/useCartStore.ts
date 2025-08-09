import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

import type { Cart } from "@/types";

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addCartItem: (itemId: string, quantity: number) => Promise<void>;
  getCartItemCount: () => number;
  deleteCartItem: (itemId: string) => Promise<void>;
  deleteAllCartItems: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/cart");
      set({ cart: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message || "Failed to fetch cart" });
    } finally {
      set({ isLoading: false });
    }
  },

  addCartItem: async (bookId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/cart", { bookId, quantity });
      await get().fetchCart();
    } catch (error: any) {
      set({
        error: error.response.data.message || "Failed to add item to cart",
      });
      toast.error("Thêm sách vào giỏ hàng thất bại");
    } finally {
      set({ isLoading: false });
    }
  },

  getCartItemCount: () => {
    const cart = get().cart;
    return cart?.items.length || 0;
  },

  deleteCartItem: async (itemId: string) => {
    try {
      await axiosInstance.delete(`/cart/${itemId}`);
      toast.success("Xóa sách khỏi giỏ hàng thành công");
      await get().fetchCart();
    } catch (error: any) {
      set({
        error: error.response.data.message || "Failed to remove item from cart",
      });
      toast.error("Xóa sách khỏi giỏ hàng thất bại");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAllCartItems: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete("/cart");
      await get().fetchCart();
    } catch (error: any) {
      set({
        error:
          error.response.data.message || "Failed to remove all items from cart",
      });
      toast.error("Xóa tất cả sách khỏi giỏ hàng thất bại");
    } finally {
      set({ isLoading: false });
    }
  },
}));
