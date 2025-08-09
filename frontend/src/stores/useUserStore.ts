import { create } from "zustand";
import axiosInstance from "@/lib/axios";

import type { User } from "@/types";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  getUserById: () => Promise<void>;
  checkAdmin: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAdmin: false,

  getUserById: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/user/profile");
      set({ user: response.data.user });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to get user info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  checkAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check");
      const isAdmin = response.data.admin === true;
      set({ isAdmin });
    } catch (error: any) {
      set({
        isAdmin: false,
        error: error.response?.data?.message || "Failed to check admin status",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
