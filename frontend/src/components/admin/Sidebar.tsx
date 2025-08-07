type Tab = "books" | "orders";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className="w-1/6 min-h-[calc(100vh-4rem)] bg-white border-r">
      <nav className="flex flex-col">
        <div
          onClick={() => onTabChange("books")}
          className={`px-6 py-4 cursor-pointer transition-colors ${
            activeTab === "books"
              ? "bg-[#3333CC] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Quản lý Sách
        </div>
        <div
          onClick={() => onTabChange("orders")}
          className={`px-6 py-4 cursor-pointer transition-colors ${
            activeTab === "orders"
              ? "bg-[#3333CC] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Quản lý Đơn hàng
        </div>
      </nav>
    </div>
  );
};
