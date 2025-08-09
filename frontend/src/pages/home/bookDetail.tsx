import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useBookStore } from "../../stores/useBookStore";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import {
  formatNumber,
  formatDateToDDMMYYYY,
} from "@/middlewares/dataFormatter";

import type { Book } from "@/types";

const BookDetail = () => {
  const { isLoading, error, getBookById } = useBookStore();
  const { addCartItem } = useCartStore();

  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      const book = await getBookById(String(id));
      setBook(book as Book);
    };
    fetchBook();
  }, [id, getBookById]);

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
    <div className="p-4 space-y-4">
      {book === undefined ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <img
            src="/img/no_item_found_icon.png"
            alt="Không tìm thấy sản phẩm"
            className="w-40 h-40 object-contain"
          />
          <p className="text-lg font-semibold text-gray-600">
            Không tìm thấy sản phẩm
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Hình ảnh */}
            <div className="w-full md:w-2/5 border rounded-sm px-4 flex items-center justify-center bg-white h-[600px]">
              <img
                src={book?.coverImageUrl}
                alt={book?.title}
                className="max-h-full object-contain"
              />
              {/* Thêm navigation bar để xem các ảnh trong imageUrls ở đây, hiện tại chưa có mock data */}
            </div>

            <div className="w-full md:w-3/5 border rounded-sm py-4 px-6 bg-white">
              {/* Tiêu đề, giá và nút */}
              <div className="space-y-4 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {book?.title}
                </h1>
                <p className="text-2xl font-semibold text-[#3333CC]">
                  {formatNumber(String(book?.price))}
                </p>
                <Button
                  className="w-full md:w-auto p-6 text-base rounded-md bg-[#5555DD] text-white hover:bg-[#3333CC] transition-colors duration-200"
                  onClick={() => {
                    addCartItem(String(id), 1);
                    toast.success("Thêm sách vào giỏ hàng thành công");
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>

              {/* Thông tin chi tiết sản phẩm */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-700 pt-4">
                  Thông tin chi tiết
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md text-gray-700">
                  <div>
                    <span className="font-medium">Tác giả:</span>{" "}
                    {book?.author.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Thể loại:</span>{" "}
                    {book?.category}
                  </div>
                  <div>
                    <span className="font-medium">Nhà xuất bản:</span>{" "}
                    {book?.publisher}
                  </div>
                  <div>
                    <span className="font-medium">Ngày xuất bản:</span>{" "}
                    {formatDateToDDMMYYYY(String(book?.publishDate))}
                  </div>
                  <div>
                    <span className="font-medium">Ngôn ngữ:</span>{" "}
                    {book?.language}
                  </div>
                  <div>
                    <span className="font-medium">Số trang:</span> {book?.pages}{" "}
                    trang
                  </div>
                </div>

                {/* Mô tả */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Mô tả sản phẩm
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {book?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookDetail;
