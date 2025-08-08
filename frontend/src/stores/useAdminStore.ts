import axiosInstance from "@/lib/axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

import type { Book, Order } from "@/types";

interface AdminStore {
  orders: Order[];
  filteredOrders: Order[];
  isLoading: boolean;
  error: string | null;
  createBook: (formData: FormData) => Promise<Book>;
  updateBook: (bookId: string, formData: FormData) => Promise<Book>;
  deleteBook: (bookId: string) => Promise<void>;
  deleteBooks: (bookIds: string[]) => Promise<void>;
  getOrders: () => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  deleteOrders: (orderIds: string[]) => Promise<void>;
  getOrdersByDateRange: (startDate: Date, endDate: Date) => Order[];
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isLoading: false,
  error: null,
  orders: [],
  filteredOrders: [],

  createBook: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/admin/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
      toast.success("Thêm sách thành công");
      return response.data.book;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create book",
        isLoading: false,
      });
      throw error;
    }
  },

  updateBook: async (bookId: string, formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        `/admin/books/${bookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ isLoading: false });
      toast.success("Cập nhật sách thành công");
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update book",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBook: async (bookId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/books/${bookId}`);
      const books = get().orders.filter((book) => book._id !== bookId);
      set({ orders: books, isLoading: false });
      toast.success("Xóa sách thành công");
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete book",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBooks: async (bookIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/admin/books/delete", { bookIds });
      const books = get().orders.filter((book) => !bookIds.includes(book._id));
      set({ orders: books, isLoading: false });
      toast.success("Xóa sách được chọn thành công");
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete books",
        isLoading: false,
      });
      throw error;
    }
  },

  getOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/orders");
      set({ orders: response.data.orders, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch orders",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/orders/${orderId}`);
      const orders = get().orders.filter((order) => order._id !== orderId);
      set({ orders, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete order",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteOrders: async (orderIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/admin/orders/delete", { orderIds });
      const orders = get().orders.filter(
        (order) => !orderIds.includes(order._id)
      );
      set({ orders, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete orders",
        isLoading: false,
      });
      throw error;
    }
  },

  getOrdersByDateRange: (startDate: Date, endDate: Date) => {
    const { orders } = get();

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    set({ filteredOrders: filtered });
    return filtered;
  },
}));
