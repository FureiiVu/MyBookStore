import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatDateToDDMMYYYY,
  formatNumber,
} from "@/middlewares/dataFormatter";

import type { Order } from "@/types";

interface SlideViewProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const SlideView = ({ isOpen, onClose, order }: SlideViewProps) => {
  if (!order) return null;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen, order]);

  const totalQuantity = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-2/3 max-w-3xl bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#3333CC]">
            Chi tiết đơn hàng
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Thông tin chung */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Mã đơn hàng</p>
              <p className="font-semibold">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Người đặt</p>
              <p className="font-semibold">{order.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày đặt</p>
              <p className="font-semibold">
                {formatDateToDDMMYYYY(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p
                className={`font-semibold capitalize ${
                  order.status === "completed"
                    ? "text-green-600"
                    : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số lượng sách</p>
              <p className="font-semibold">{totalQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng tiền</p>
              <p className="font-semibold text-[#3333CC]">
                {formatNumber(String(order.totalPrice))} VNĐ
              </p>
            </div>
          </div>

          {/* Danh sách sách trong đơn hàng */}
          <div>
            <h3 className="text-lg font-bold text-[#3333CC] mb-2">
              Sản phẩm đã đặt
            </h3>
            <div className="divide-y border rounded-lg">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50"
                >
                  <img
                    src={item.book.coverImageUrl}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      SL: {item.quantity} × {formatNumber(String(item.price))}
                    </p>
                  </div>
                  <p className="font-semibold text-right whitespace-nowrap">
                    {formatNumber(String(item.quantity * item.price))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </>
  );
};

export default SlideView;
