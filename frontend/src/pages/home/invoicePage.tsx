import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useOrderStore } from "@/stores/useOrderStore";
import { useUserStore } from "@/stores/useUserStore";
import {
  formatDateToDDMMYYYY,
  formatNumber,
} from "@/middlewares/dataFormatter";
import { Button } from "@/components/ui/button";

const InvoicePage = () => {
  const { order, isLoading, error, getOrder, reset } = useOrderStore();
  const { user: userInfo, getUserById } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    getOrder();
    getUserById();
  }, []);

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Không tìm thấy hóa đơn.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 text-red-700 bg-red-100 rounded border border-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 md:p-12 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between md:items-center border-b pb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-[#3333CC]">HÓA ĐƠN</h1>
            <p className="text-base text-gray-600 mt-2">
              Mã đơn hàng: <span className="font-semibold">{order._id}</span>
            </p>
          </div>
          <div className="text-base text-gray-700 text-right space-y-2">
            <p>
              Ngày đặt:{" "}
              <span className="font-semibold">
                {formatDateToDDMMYYYY(String(order.createdAt))}
              </span>
            </p>
            <p>
              Trạng thái:{" "}
              <span
                className={`font-semibold ${
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
        </header>

        {/* Thông tin người dùng + Tổng tiền */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border">
          <div className="flex items-center gap-3">
            {userInfo?.imageUrl && (
              <img
                src={userInfo.imageUrl}
                alt={userInfo.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
            )}
            <div>
              <h2 className="font-semibold text-gray-700 mb-1">
                Người đặt hàng:
              </h2>
              <p className="text-base text-gray-800">
                {userInfo?.name || "Ẩn danh"}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h2 className="font-semibold text-gray-700 mb-1">Tổng đơn hàng:</h2>
            <p className="text-xl font-bold text-[#3333CC] mt-1">
              {formatNumber(String(order.totalPrice))}
            </p>
          </div>
        </section>

        {/* Danh sách sản phẩm */}
        <section className="overflow-x-auto border rounded-lg">
          <table className="w-full text-base text-gray-700">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Ảnh</th>
                <th className="px-4 py-3 text-left">Tên sản phẩm</th>
                <th className="px-4 py-3 text-center">Đơn giá</th>
                <th className="px-4 py-3 text-center">Số lượng</th>
                <th className="px-4 py-3 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems && Array.isArray(order.orderItems) ? (
                order.orderItems.map((item, idex) => (
                  <tr
                    key={idex}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4">
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="w-20 h-24 object-cover rounded border"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">{item.title}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {formatNumber(String(item.price))}
                    </td>
                    <td className="px-4 py-4 text-center">{item.quantity}</td>
                    <td className="px-4 py-4 text-right font-semibold">
                      {formatNumber(String(item.price * item.quantity))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Không có sản phẩm nào trong đơn hàng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Tổng kết */}
        <footer className="flex justify-end">
          <div className="w-full max-w-xs text-left md:text-right space-y-1">
            <p className="text-md font-medium text-gray-600">
              Tổng giá trị đơn hàng:
            </p>
            <p className="text-2xl font-bold text-[#3333CC]">
              {formatNumber(String(order.totalPrice))}
            </p>
            <Button
              onClick={() => {
                reset();
                navigate("/");
              }}
              className="p-4 mt-2 bg-[#3333CC] text-white font-medium rounded-lg hover:bg-[#2828a3] transition-colors"
            >
              Xác nhận
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InvoicePage;
