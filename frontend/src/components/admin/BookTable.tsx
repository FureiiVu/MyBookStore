import { Edit2, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/middlewares/dataFormatter";
import type { Book } from "@/types";

interface BookTableProps {
  books: Book[];
  isLoading: boolean;
  error?: string;
  onEdit: (book: Book) => void;
}

export const BookTable = ({
  books,
  isLoading,
  error,
  onEdit,
}: BookTableProps) => {
  if (isLoading) {
    return <div className="text-center py-4">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left">Ảnh</th>
            <th className="px-6 py-4 text-left">Tên sách</th>
            <th className="px-6 py-4 text-left">Tác giả</th>
            <th className="px-6 py-4 text-left">Thể loại</th>
            <th className="px-6 py-4 text-left">Giá</th>
            <th className="px-6 py-4 text-left">Số lượng</th>
            <th className="px-6 py-4 text-center">Quản lý</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {books.map((book) => (
            <tr key={book._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{book.title}</td>
              <td className="px-6 py-4">{book.author.join(", ")}</td>
              <td className="px-6 py-4">{book.category}</td>
              <td className="px-6 py-4">{formatNumber(String(book.price))}</td>
              <td className="px-6 py-4">{book.stock}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(book)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
