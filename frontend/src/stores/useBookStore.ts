import axiosInstance from "@/lib/axios";
import { create } from "zustand";

import type { Book } from "@/types";

interface BookStore {
  books: Book[];
  categories: string[];
  maxPrice: string;
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  setCategories: (categories: string[]) => void;
  setMaxPrice: (price: string) => void;
  filterBooks: (categories?: string[], maxPrice?: string) => Book[];
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  categories: [],
  maxPrice: "",
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

  setCategories: (categories: string[]) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      set({ categories: [] });
      return;
    }
    set({ categories });
  },

  setMaxPrice: (price: string) => {
    if (!price) {
      set({ maxPrice: "" });
      return;
    }
    set({ maxPrice: price });
  },

  filterBooks: () => {
    const { books, categories, maxPrice } = get();

    if (!categories?.length && !maxPrice) {
      return [...books];
    }

    const filteredBooks = books.filter((book) => {
      const numericPrice = parseFloat(String(book.price));
      const matchesCategory =
        !categories?.length || categories.includes(book.category);
      const matchesPrice =
        !maxPrice || numericPrice <= parseFloat(maxPrice.replace(/\D/g, ""));

      return matchesCategory && matchesPrice;
    });

    return filteredBooks;
  },
}));
