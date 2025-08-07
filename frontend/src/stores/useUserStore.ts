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
      const response = await axiosInstance.get("/user/profile"); // Sửa lại URL
      console.log("User data fetched:", response.data.user);
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
      console.log("Admin check response:", response.data);
      const isAdmin = response.data.admin === true;
      set({ isAdmin });
    } catch (error: any) {
      console.error("Error checking admin status:", error.response?.data);
      set({
        isAdmin: false,
        error: error.response?.data?.message || "Failed to check admin status",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
