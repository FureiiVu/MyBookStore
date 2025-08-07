import { Search, Plus, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionBarProps {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}

export const ActionBar = ({ onSearch, onAdd }: ActionBarProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              onChange={onSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Lọc
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          className="bg-[#3333CC] text-white flex items-center gap-2"
          onClick={onAdd}
        >
          <Plus className="w-4 h-4" />
          Thêm mới
        </Button>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
};
