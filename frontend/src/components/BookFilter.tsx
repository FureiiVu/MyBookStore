import { Funnel } from "lucide-react";
import { useState } from "react";

const BookFilter = () => {
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  console.log("Check selectedCategory:", selectedCategory);

  const categories = [
    "Tiểu thuyết",
    "Truyện tranh",
    "Truyện kinh dị",
    "Sách truyền cảm hứng",
    "Sách bổ sung kiến thức",
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? `${Number(numericValue).toLocaleString("vi-VN")}đ`
      : "";
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(formatNumber(e.target.value));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Funnel className="w-5 h-5 text-[#3333CC]" />
        <h3 className="text-md font-bold">Bộ lọc tìm kiếm</h3>
      </div>

      <hr className="my-4 border-t border-gray-300" />

      {/* Filter by category */}
      <div className="text-md font-semibold">Thể loại:</div>
      <div className="flex flex-col gap-2 mt-2">
        {categories.map((category) => (
          <label key={category} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={category}
              className="form-checkbox"
              checked={selectedCategory.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            <span>{category}</span>
          </label>
        ))}
      </div>

      <hr className="my-4 border-t border-gray-300" />

      {/* Filter by Price */}
      <div className="text-md font-semibold">Khoảng giá:</div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2">
          <span className="w-24 text-center border border-gray-300 rounded-md px-3 py-1 bg-gray-100">
            0đ
          </span>
          <span>-</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="100.000đ"
            className="border border-gray-300 rounded-md px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BookFilter;
