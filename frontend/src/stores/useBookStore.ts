import axiosInstance from "@/lib/axios";
import { create } from "zustand";

import type { Book } from "@/types";

interface BookStore {
  books: Book[];
  filterState: {
    categories: string[];
    maxPrice: string;
    searchTerm: string;
    sortOption: string;
  };
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  setCategories: (categories: string[]) => void;
  setMaxPrice: (price: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSortOption: (sortOption: string) => void;
  filterBooks: (categories?: string[], maxPrice?: string) => Book[];
  getBookById: (id: string) => Promise<Book | undefined>;
  getSearchedBooks: () => Book[];
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  filterState: {
    categories: [],
    maxPrice: "",
    searchTerm: "",
    sortOption: "all",
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

  setSortOption: (sortOption: string) => {
    if (!sortOption) {
      set({ filterState: { ...get().filterState, sortOption: "all" } });
      return;
    }
    set({ filterState: { ...get().filterState, sortOption } });
  },

  filterBooks: () => {
    const { books, filterState } = get();
    const { categories, maxPrice, searchTerm, sortOption } = filterState;

    if (
      !categories?.length &&
      !maxPrice &&
      !searchTerm &&
      sortOption === "all"
    ) {
      return [...books];
    }

    let filteredBooks = books.filter((book) => {
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

    // Sort the filtered books based on the selected sort option
    if (sortOption !== "all") {
      filteredBooks = [...filteredBooks].sort((a, b) => {
        switch (sortOption) {
          case "a-z":
            return a.title[0].localeCompare(b.title[0]);
          case "z-a":
            return b.title[0].localeCompare(a.title[0]);
          case "low-to-high":
            return a.price - b.price;
          case "high-to-low":
            return b.price - a.price;
          default:
            return 0;
        }
      });
    }

    return filteredBooks;
  },

  getBookById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/books/${id}`);
      return response.data as Book;
    } catch (error: any) {
      set({ error: error.response.data.message || "Failed to get book by ID" });
    } finally {
      set({ isLoading: false });
    }
    return undefined; // Return undefined if book not found or error occurs
  },

  getSearchedBooks: () => {
    const { books, filterState } = get();
    const { searchTerm } = filterState;

    if (!searchTerm) {
      return books;
    }

    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.some((author) =>
          author.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  },
}));
