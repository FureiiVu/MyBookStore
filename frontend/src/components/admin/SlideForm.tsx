import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types";

interface SlideFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  book?: Book;
  onSubmit: (formData: FormData) => Promise<void>;
}

const SlideForm = ({ isOpen, onClose, mode, book }: SlideFormProps) => {
  const [formData, setFormData] = useState({
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
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
    } else {
      setFormData({
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
      });
    }
  }, [mode, book, isOpen]);

  const formFields = [
    // Basic info - first row
    [
      { name: "title", label: "Tên sách", type: "text" },
      { name: "author", label: "Tác giả", type: "text" },
    ],
    // Publishing info - second row
    [
      { name: "publisher", label: "Nhà xuất bản", type: "text" },
      { name: "publishDate", label: "Ngày xuất bản", type: "date" },
    ],
    // Category and price - third row
    [
      {
        name: "category",
        label: "Thể loại",
        type: "select",
        options: [
          { value: "", label: "Chọn thể loại" },
          { value: "Văn học", label: "Văn học" },
          { value: "Kinh tế", label: "Kinh tế" },
          { value: "Kỹ năng sống", label: "Kỹ năng sống" },
        ],
      },
      { name: "price", label: "Giá", type: "number", min: "0" },
    ],
    // Details - fourth row
    [
      { name: "language", label: "Ngôn ngữ", type: "text" },
      { name: "pages", label: "Số trang", type: "number", min: "1" },
      { name: "stock", label: "Số lượng", type: "number", min: "0" },
    ],
  ];

  const renderField = (field: any) => {
    const commonProps = {
      name: field.name,
      value: formData[field.name as keyof typeof formData],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value })),
      className: "w-full p-2 border rounded-lg",
      required: true,
      ...field,
    };

    switch (field.type) {
      case "textarea":
        return <textarea {...commonProps} rows={4} />;
      case "select":
        return (
          <div className="relative">
            <select
              {...commonProps}
              className={`${commonProps.className} pr-8 appearance-none`}
            >
              {field.options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        );
      default:
        return <input {...commonProps} type={field.type} />;
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
        className={`fixed right-0 top-0 h-full w-2/3 max-w-3xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#3333CC]">
              {mode === "create" ? "Thêm sách mới" : "Cập nhật sách"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <form className="p-6 space-y-6">
            {/* Basic Info Fields in Grid */}
            {formFields.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-2 gap-6">
                {row.map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium">
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            ))}

            {/* Cover Image Upload */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Ảnh bìa</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Kéo thả hoặc click để tải ảnh lên
                    </span>
                  </div>
                </div>
                {coverPreview && (
                  <div className="w-32 h-40 relative">
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={() => setCoverPreview("")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={6}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">
                {mode === "create" ? "Thêm sách" : "Cập nhật"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SlideForm;
