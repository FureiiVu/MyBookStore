import { Eye, Trash2 } from "lucide-react";
import { formatNumber } from "@/middlewares/dataFormatter";
import { useAdminStore } from "@/stores/useAdminStore";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  error?: string;
  onView: (order: Order) => void;
}

export const OrderTable = ({
  orders,
  isLoading,
  error,
  onView,
}: OrderTableProps) => {
  const { deleteOrder, getOrders } = useAdminStore();

  if (isLoading) {
    return <div className="text-center py-4">Đang tải đơn hàng...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg border-2 shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left">Mã đơn</th>
            <th className="px-6 py-4 text-left">Người mua</th>
            <th className="px-6 py-4 text-center">Số sách</th>
            <th className="px-6 py-4 text-right">Tổng tiền</th>
            <th className="px-6 py-4 text-center">Ngày đặt</th>
            <th className="px-6 py-4 text-center">Trạng thái</th>
            <th className="px-6 py-4 text-center">Quản lý</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{order._id}</td>
              <td className="px-6 py-4">{order.user.name}</td>
              <td className="px-6 py-4 text-center">
                {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
              </td>
              <td className="px-6 py-4 text-right">
                {formatNumber(String(order.totalPrice))}
              </td>
              <td className="px-6 py-4 text-center">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td
                className={`px-6 py-4 text-center capitalize ${
                  order.status === "completed"
                    ? "text-green-600"
                    : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(order)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      await deleteOrder(order._id);
                      await getOrders();
                    }}
                  >
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
