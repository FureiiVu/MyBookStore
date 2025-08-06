import { useState, useEffect, useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { formatNumber } from "@/middlewares/dataFormatter";
import Invoice from "@/components/Invoice";

const CartPage = () => {
  const { cart, isLoading, error, fetchCart, addCartItem, deleteCartItem } =
    useCartStore();

  const { addOrder } = useOrderStore();

  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalAmount = useMemo(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((acc, item) => {
      return acc + item.book.price * item.quantity;
    }, 0);
  }, [cart]);

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

        {!cart?.items?.length ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
            <img
              src="/img/no_item_found_icon.png"
              alt="Không tìm thấy sản phẩm"
              className="w-40 h-40 object-contain"
            />
            <p className="text-lg font-semibold text-gray-600">
              Không có sản phẩm nào trong giỏ hàng
            </p>
          </div>
        ) : (
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
                {cart.items.map((item) => (
                  <tr key={item._id} className="align-top">
                    <td>
                      <div className="flex gap-4">
                        <img
                          src={item.book.coverImageUrl}
                          alt={item.book.title}
                          className="w-24 h-24 object-cover rounded border"
                        />
                        <div className="flex flex-col justify-between">
                          <p className="font-semibold text-lg">
                            {item.book.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.book.author}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.book.category}
                          </p>
                          <p className="text-sm text-red-500 font-medium">
                            Chỉ còn {item.book.stock} sản phẩm
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-sm text-gray-700 font-semibold text-center">
                      {formatNumber(String(item.book.price))}
                    </td>

                    <td className="text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button
                            className="px-2 py-1 text-sm"
                            onClick={() => addCartItem(item.book._id, -1)}
                          >
                            -
                          </button>
                          <div className="px-3 text-sm">{item.quantity}</div>
                          <button
                            className="px-2 py-1 text-sm"
                            onClick={() => addCartItem(item.book._id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs text-blue-500 mt-2 hover:underline"
                          onClick={() => deleteCartItem(item._id)}
                        >
                          Xoá
                        </button>
                      </div>
                    </td>

                    <td className="text-sm font-bold text-center">
                      {formatNumber(String(item.book.price * item.quantity))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="w-full md:w-80">
        <Card>
          <CardContent className="space-y-2">
            <h3 className="text-2xl font-bold">Tổng cộng</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tạm tính:</span>
              <span>{formatNumber(String(totalAmount))}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between mt-4 font-bold text-lg">
              <span>Thành tiền:</span>
              <span className="text-[#3333CC]">
                {formatNumber(String(totalAmount))}
              </span>
            </div>
            <Button
              className="w-full mt-2 text-white bg-[#5555DD] hover:bg-[#3333CC] transition-colors duration-200"
              onClick={async () => {
                const payload = {
                  orderItems: cart?.items.map((item) => ({
                    bookId: item.book._id,
                    quantity: item.quantity,
                  })),
                };

                await addOrder(payload);

                setShowInvoice(true);
              }}
            >
              Thanh toán
            </Button>
          </CardContent>
        </Card>
      </div>

      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative animate-fadeIn">
            <Invoice />
            <button
              className="text-center text-gray-500 hover:text-gray-800"
              onClick={() => setShowInvoice(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
