import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SelectField } from "./SelectField";
import { ImageUpload } from "./ImageUpload";
import { useAdminStore } from "@/stores/useAdminStore";

import type { Book } from "@/types";

interface SlideFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  book?: Book;
  onSubmit: () => Promise<void>;
}

const initialFormState = {
  title: "",
  author: [""],
  description: "",
  category: "",
  price: "",
  publisher: "",
  publishDate: "",
  language: "",
  pages: "",
  stock: "",
};

const categoryOptions = [
  { value: "", label: "Chọn thể loại" },
  { value: "Tiểu thuyết", label: "Tiểu thuyết" },
  { value: "Truyện tranh", label: "Truyện tranh" },
  { value: "Truyện kinh dị", label: "Truyện kinh dị" },
  { value: "Sách truyền cảm hứng", label: "Sách truyền cảm hứng" },
  { value: "Sách bổ sung kiến thức", label: "Sách bổ sung kiến thức" },
];

const SlideForm = ({
  isOpen,
  onClose,
  mode,
  book,
  onSubmit,
}: SlideFormProps) => {
  const [formData, setFormData] = useState(initialFormState);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { createBook, updateBook } = useAdminStore();

  useEffect(() => {
    if (mode === "edit" && book) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        price: book.price.toString(),
        publisher: book.publisher,
        publishDate: new Date(book.publishDate).toISOString().split("T")[0],
        language: book.language,
        pages: book.pages.toString(),
        stock: book.stock.toString(),
      });
      setCoverPreview(book.coverImageUrl);
    } else {
      setFormData(initialFormState);
      setCoverPreview(null);
    }
  }, [mode, book, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...formData.author];
    newAuthors[index] = value;
    setFormData((prev) => ({ ...prev, author: newAuthors }));
  };

  const addAuthorField = () => {
    setFormData((prev) => ({ ...prev, author: [...prev.author, ""] }));
  };

  const removeAuthorField = (index: number) => {
    if (formData.author.length > 1) {
      const newAuthors = formData.author.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, author: newAuthors }));
    }
  };

  const handleCoverFileChange = (file: File | null) => {
    setCoverFile(file);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      formData.author.forEach((author) => {
        payload.append("author", author);
      });
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("price", formData.price);
      payload.append("publisher", formData.publisher);
      payload.append("publishDate", formData.publishDate);
      payload.append("language", formData.language);
      payload.append("pages", formData.pages);
      payload.append("stock", formData.stock);

      if (coverFile) {
        payload.append("imageFile", coverFile);
        payload.append("images", coverFile);
      }

      if (mode === "edit" && book) {
        await updateBook(book._id, payload);
        onSubmit();
      } else {
        await createBook(payload);
        onSubmit();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-2/3 max-w-3xl bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header - Fixed at top */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#3333CC]">
            {mode === "create" ? "Thêm sách mới" : "Cập nhật sách"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium">Tên sách</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Thể loại</label>
                <SelectField
                  name="category"
                  value={formData.category}
                  options={categoryOptions}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Authors Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tác giả</label>
              {formData.author.map((author, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => handleAuthorChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder={`Tác giả ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAuthorField(index)}
                    disabled={formData.author.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={addAuthorField}
              >
                Thêm tác giả
              </Button>
            </div>

            {/* Publishing Info - Update to include language */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Nhà xuất bản
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Ngày xuất bản
                </label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Ngôn ngữ</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium">Giá (đ)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Số trang</label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Số lượng</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Ảnh bìa</label>
              <ImageUpload
                preview={coverPreview}
                onPreviewChange={setCoverPreview}
                onFileChange={handleCoverFileChange}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div
          className={`sticky bottom-0 bg-white border-t px-6 py-4 flex ${
            isLoading ? "justify-between items-center" : "justify-end"
          }`}
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span>
                Đang {mode === "create" ? "thêm sách..." : "cập nhật sách..."}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" form="bookForm" onClick={handleSubmit}>
              {mode === "create" ? "Thêm sách" : "Cập nhật"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideForm;
