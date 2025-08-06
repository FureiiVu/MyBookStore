import { Card, CardContent } from "@/components/ui/card";
import { useOrderStore } from "@/stores/useOrderStore";
import {
  formatDateToDDMMYYYY,
  formatNumber,
} from "@/middlewares/dataFormatter";

const Invoice = () => {
  const { order } = useOrderStore();

  if (!order) {
    return (
      <p className="text-center py-10 text-gray-500">Đang tải hóa đơn...</p>
    );
  }

  console.log("Rendering Invoice with order:", order);

  return (
    <Card className="max-w-4xl mx-auto p-6 shadow-lg rounded-xl bg-white">
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#3333CC]">🧾 HÓA ĐƠN</h2>
            <p className="text-sm text-gray-600">
              Mã đơn: <span className="font-semibold">{order._id}</span>
            </p>
          </div>
          <div className="text-sm text-right text-gray-600 space-y-1">
            <p>
              Ngày đặt:{" "}
              <span className="font-medium">
                {formatDateToDDMMYYYY(String(order.createdAt))}
              </span>
            </p>
            <p>
              Trạng thái:{" "}
              <span
                className={`font-medium ${
                  order.status === "completed"
                    ? "text-green-600"
                    : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </p>
          </div>
        </div>

        {/* Thông tin người dùng */}
        <div className="border rounded-md p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-1">Người đặt hàng:</h3>
          <p className="text-sm text-gray-800">{order.user}</p>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="w-20">Ảnh</th>
                <th className="min-w-[150px]">Tên sản phẩm</th>
                <th className="text-center">Đơn giá</th>
                <th className="text-center">Số lượng</th>
                <th className="text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order?.orderItems?.length > 0 &&
                order.orderItems.map((item) => (
                  <tr key={item._id} className="bg-white shadow rounded border">
                    <td>
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded border"
                      />
                    </td>
                    <td className="align-top pr-2">
                      <p className="font-medium text-gray-800">{item.title}</p>
                    </td>
                    <td className="text-center text-gray-700">
                      {formatNumber(String(item.price))}
                    </td>
                    <td className="text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="text-right font-semibold text-gray-900">
                      {formatNumber(String(item.price * item.quantity))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Tổng cộng */}
        <div className="flex justify-end mt-4">
          <div className="w-full max-w-sm border-t pt-4 text-right space-y-2">
            <p className="text-sm text-gray-600">Tổng giá trị đơn hàng:</p>
            <p className="text-2xl font-bold text-[#3333CC]">
              {formatNumber(String(order.totalPrice))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Invoice;
