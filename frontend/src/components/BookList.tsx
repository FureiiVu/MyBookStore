import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { useBookStore } from "@/stores/useBookStore";
import { formatNumber } from "@/middlewares/dataFormatter";
import { usePagination } from "@/hooks/usePagination";

import type { Book } from "@/types";
import Pagination from "./Paginator";

const BookList = () => {
  const { isLoading, error, fetchBooks, filterBooks, setSortOption } =
    useBookStore();

  const options = [
    { label: "Tất cả", value: "all" },
    { label: "A - Z", value: "a-z" },
    { label: "Z - A", value: "z-a" },
    { label: "Giá thấp nhất", value: "low-to-high" },
    { label: "Giá cao nhất", value: "high-to-low" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    setSortOption(selected.value);
  }, [selected, setSortOption]);

  const bookList = filterBooks();
  const {
    currentPage: bookPage,
    setCurrentPage: setBookPage,
    paginatedItems: paginatedBooks,
    totalItems: totalBooks,
  } = usePagination<Book>({
    items: bookList,
    itemsPerPage: 10,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 text-red-700 bg-red-100 rounded border border-red-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Danh sách sản phẩm</h3>
        <div className="flex items-center space-x-2">
          <h3 className="text-md font-semibold">Sắp xếp:</h3>
          <div className="relative inline-block w-50 text-left">
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150"
              >
                {selected.label}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>

            {isOpen && (
              <div className="z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none absolute">
                <div className="py-1">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelected(option);
                        setIsOpen(false);
                      }}
                      className={`block w-full rounded-sm text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                        selected.value === option.value
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {paginatedBooks.map((book) => (
          <Link to={`/book-detail/${book._id}`} key={book._id}>
            <Card className="relative overflow-hidden rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] bg-white group w-55 h-[320px]">
              {/* Ảnh full card */}
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay thông tin ở đáy ảnh */}
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white px-3 py-2">
                <div className="font-semibold text-sm truncate group-hover:text-blue-300 transition-colors duration-200">
                  {book.title}
                </div>
                <div className="text-base font-bold group-hover:text-blue-300">
                  {formatNumber(String(book.price))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={bookPage}
        totalItems={totalBooks}
        itemsPerPage={10}
        onPageChange={setBookPage}
      />
    </div>
  );
};

export default BookList;
