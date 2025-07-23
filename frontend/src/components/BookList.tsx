import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useBookStore } from "@/stores/useBookStore";

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

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? `${Number(numericValue).toLocaleString("vi-VN")}đ`
      : "";
  };

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
        <h3 className="text-lg font-bold">Danh sách sản phẩm:</h3>
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
        {filterBooks().map((book) => (
          <Card
            key={book._id}
            className="relative overflow-hidden rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:scale-105 w-55 h-[330px]"
          >
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-contain bg-gray-50"
            />
            <div className="absolute bottom-0 w-full bg-black/60 text-white text-sm p-2">
              <div className="font-semibold truncate">{book.title}</div>
              <div>{formatNumber(String(book.price))}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookList;
