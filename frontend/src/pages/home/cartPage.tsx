import { useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCartStore from "@/stores/useCartStore";

const CartPage = () => {
  const { cart, isLoading, error, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6">
      <div className="flex-1 bg-white rounded-xl border shadow-sm p-4">
        <h2 className="text-2xl font-bold">Giỏ hàng của bạn</h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-y-4 px-2">
            <thead>
              <tr className="text-md text-gray-500">
                <th className="text-center">Thông tin sản phẩm</th>
                <th className="w-32 text-center">Đơn giá</th>
                <th className="w-32 text-center">Số lượng</th>
                <th className="w-32 text-center">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-top">
                {/* Thông tin sản phẩm */}
                <td>
                  <div className="flex gap-4">
                    <img
                      src="https://via.placeholder.com/100x100"
                      alt="Sản phẩm"
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <div className="flex flex-col justify-between">
                      <h3 className="font-semibold text-base">
                        Bàn phím cơ không dây Newmen GM610 Global Blue Axis
                        (Trắng)
                      </h3>
                      <p className="text-sm text-gray-500">SKU: 210700025</p>
                      <p className="text-sm text-gray-500">Axis Blue, Trắng</p>
                      <p className="text-sm text-red-500 font-medium">
                        Chỉ còn 1 sản phẩm
                      </p>
                    </div>
                  </div>
                </td>

                {/* Đơn giá */}
                <td className="text-sm text-gray-700 font-semibold text-center">
                  1.290.000₫
                </td>

                {/* Số lượng */}
                <td className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center border rounded overflow-hidden">
                      <button className="px-2 py-1 text-sm">-</button>
                      <div className="px-3 text-sm">1</div>
                      <button className="px-2 py-1 text-sm">+</button>
                    </div>
                    <button className="text-xs text-blue-500 mt-2 hover:underline">
                      Xoá
                    </button>
                  </div>
                </td>

                {/* Thành tiền */}
                <td className="text-sm font-bold text-center">1.290.000₫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full md:w-80">
        <Card>
          <CardContent className="space-y-2">
            <h3 className="text-2xl font-bold">Tổng cộng</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tạm tính:</span>
              <span>1.290.000₫</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between mt-4 font-bold text-lg">
              <span>Thành tiền:</span>
              <span className="text-[#3333CC]">1.290.000₫</span>
            </div>
            <Button className="w-full mt-2 text-white bg-[#5555DD] hover:bg-[#3333CC] transition-colors duration-200">
              Thanh toán
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;
