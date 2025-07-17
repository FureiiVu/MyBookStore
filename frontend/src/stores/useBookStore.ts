import axiosInstance from "@/lib/axios";
import { create } from "zustand";

export const useBookStore = create((set) => ({
  books: [],
  isLoading: false,
  error: null,

  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/books");
      set({ books: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message || "Failed to fetch books" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
