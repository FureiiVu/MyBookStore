import { Funnel } from "lucide-react";

const BookFilter = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Funnel className="w-4 h-4 text-[#3333CC]" />
        <h3 className="text-md font-semibold">Bộ lọc tìm kiếm</h3>
      </div>

      <hr className="my-4 border-t border-gray-300" />

      <div className="text-md font-normal">Thể loại:</div>

      <div className="flex flex-col gap-2 mt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="form-checkbox" />
          <span>Tiểu thuyết</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="form-checkbox" />
          <span>Khoa học</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="form-checkbox" />
          <span>Lịch sử</span>
        </label>
      </div>
    </div>
  );
};

export default BookFilter;
