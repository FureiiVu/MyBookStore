import axiosInstance from "@/lib/axios";
import { create } from "zustand";

import type { Book } from "@/types";

interface BookStore {
  books: Book[];
  filterState: {
    categories: string[];
    maxPrice: string;
    searchTerm: string;
  };
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  setCategories: (categories: string[]) => void;
  setMaxPrice: (price: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  filterBooks: (categories?: string[], maxPrice?: string) => Book[];
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  filterState: {
    categories: [],
    maxPrice: "",
    searchTerm: "",
  },
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
      set({ filterState: { ...get().filterState, categories: [] } });
      return;
    }
    set({ filterState: { ...get().filterState, categories } });
  },

  setMaxPrice: (price: string) => {
    if (!price) {
      set({ filterState: { ...get().filterState, maxPrice: "" } });
      return;
    }
    set({ filterState: { ...get().filterState, maxPrice: price } });
  },

  setSearchTerm: (searchTerm: string) => {
    if (!searchTerm) {
      set({ filterState: { ...get().filterState, searchTerm: "" } });
      return;
    }
    set({ filterState: { ...get().filterState, searchTerm } });
  },

  filterBooks: () => {
    const { books, filterState } = get();
    const { categories, maxPrice, searchTerm } = filterState;

    if (!categories?.length && !maxPrice && !searchTerm) {
      return [...books];
    }

    const filteredBooks = books.filter((book) => {
      const numericPrice = parseFloat(String(book.price));

      // Check if book matches the filter categories
      const matchesCategory =
        !categories?.length || categories.includes(book.category);

      // Check if book matches the filter max price
      const matchesPrice =
        !maxPrice ||
        numericPrice <= parseFloat(maxPrice.replace(/\D/g, "")) * 1000;

      // Check if book matches the search term (title or author)
      const matchesSearchTerm =
        !searchTerm ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.some((author) =>
          author.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesCategory && matchesPrice && matchesSearchTerm;
    });

    return filteredBooks;
  },
}));
