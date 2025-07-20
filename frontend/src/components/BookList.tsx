import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { useBookStore } from "@/stores/useBookStore";

const BookList = () => {
  const { books, isLoading, error, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

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
      <h3 className="text-lg font-bold mb-4">Danh sách sản phẩm:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {books.map((book) => (
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
              <div>{formatNumber(String(book.price))} ₫</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookList;
