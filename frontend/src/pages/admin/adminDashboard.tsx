import { useState, useEffect } from "react";

import { useUserStore } from "@/stores/useUserStore";
import { useBookStore } from "@/stores/useBookStore";
import { useAdminStore } from "@/stores/useAdminStore";

import { Sidebar } from "@/components/admin/Sidebar";
import { ActionBar } from "@/components/admin/ActionBar";
import { BookTable } from "@/components/admin/BookTable";
import { OrderTable } from "@/components/admin/OrderTable";
import { DateRangeBar } from "@/components/admin/DateRangeBar";
import SlideForm from "@/components/admin/SlideForm";
import SlideView from "@/components/admin/SlideView";

import Pagination from "@/components/Paginator";
import { usePagination } from "@/hooks/usePagination";

import type { Book, Order } from "@/types";

type Tab = "books" | "orders";

const initialDateRange = {
  startDate: new Date(0),
  endDate: new Date(),
};

const AdminDashboard = () => {
  const { isAdmin } = useUserStore();
  const {
    isLoading: isLoadingBooks,
    error: errorBooks,
    fetchBooks,
    setSearchTerm,
    getSearchedBooks,
  } = useBookStore();
  const {
    orders,
    isLoading: isLoadingOrders,
    error: errorOrders,
    getOrders,
    getOrdersByDateRange,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<Tab>("books");

  // State for Book form handling
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // State for Order view handling
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchBooks(), getOrders()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const result = getOrdersByDateRange(
        dateRange.startDate,
        dateRange.endDate
      );
      setFilteredOrders(result);
    }
  }, [orders, dateRange, getOrdersByDateRange]);

  // Filter books based on search term and pagination
  const filteredBooks = getSearchedBooks();
  const {
    currentPage: bookPage,
    setCurrentPage: setBookPage,
    paginatedItems: paginatedBooks,
    totalItems: totalBooks,
  } = usePagination<Book>({
    items: filteredBooks,
    itemsPerPage: 10,
  });

  // Order pagination
  const {
    currentPage: orderPage,
    setCurrentPage: setOrderPage,
    paginatedItems: paginatedOrders,
    totalItems: totalOrders,
  } = usePagination<Order>({
    items: filteredOrders,
    itemsPerPage: 10,
  });

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-none border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-[#3333CC]">
            Book Store Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 p-6">
          {activeTab === "books" && (
            <>
              <ActionBar
                onSearch={(e) => setSearchTerm(e.target.value)}
                onAdd={() => {
                  setFormMode("create");
                  setSelectedBook(null);
                  setIsFormOpen(true);
                }}
              />
              <BookTable
                books={paginatedBooks}
                isLoading={isLoadingBooks}
                error={errorBooks ?? undefined}
                onEdit={(book) => {
                  setFormMode("edit");
                  setSelectedBook(book);
                  setIsFormOpen(true);
                }}
              />
            </>
          )}

          {activeTab === "orders" && (
            <>
              <DateRangeBar dateRange={dateRange} onDateChange={setDateRange} />
              <OrderTable
                orders={paginatedOrders}
                isLoading={isLoadingOrders}
                error={errorOrders ?? undefined}
                onView={(order) => {
                  setSelectedOrder(order);
                  setIsViewOpen(true);
                }}
              />
            </>
          )}

          <Pagination
            currentPage={activeTab === "books" ? bookPage : orderPage}
            totalItems={activeTab === "books" ? totalBooks : totalOrders}
            itemsPerPage={10}
            onPageChange={activeTab === "books" ? setBookPage : setOrderPage}
          />
        </div>
      </div>

      <SlideForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        book={selectedBook || undefined}
        onSubmit={async () => {
          setIsFormOpen(false);
          await fetchBooks();
        }}
      />

      <SlideView
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminDashboard;
