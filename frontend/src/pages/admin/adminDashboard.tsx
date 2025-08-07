import { useState } from "react";

import { useUserStore } from "@/stores/useUserStore";
import { useBookStore } from "@/stores/useBookStore";

import { Sidebar } from "@/components/admin/Sidebar";
import { ActionBar } from "@/components/admin/ActionBar";
import { BookTable } from "@/components/admin/BookTable";
import SlideForm from "@/components/admin/SlideForm";

import Pagination from "@/components/Paginator";
import { usePagination } from "@/hooks/usePagination";

import type { Book } from "@/types";

type Tab = "books" | "orders";

const AdminDashboard = () => {
  const { isAdmin } = useUserStore();
  const { isLoading, error, setSearchTerm, getSearchedBooks } = useBookStore();
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = getSearchedBooks();
  const { currentPage, setCurrentPage, paginatedItems, totalItems } =
    usePagination({
      items: filteredBooks,
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
          <ActionBar
            onSearch={(e) => setSearchTerm(e.target.value)}
            onAdd={() => {
              setFormMode("create");
              setSelectedBook(null);
              setIsFormOpen(true);
            }}
          />

          {activeTab === "books" && (
            <BookTable
              books={paginatedItems}
              isLoading={isLoading}
              error={error ?? undefined}
              onEdit={(book) => {
                setFormMode("edit");
                setSelectedBook(book);
                setIsFormOpen(true);
              }}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
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
        }}
      />
    </div>
  );
};

export default AdminDashboard;
