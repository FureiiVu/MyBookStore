import axiosInstance from "@/lib/axios";
import { create } from "zustand";

import type { Book } from "@/types";

interface BookStore {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
}

export const useBookStore = create<BookStore>((set) => ({
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
