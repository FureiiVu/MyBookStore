import { User } from "@clerk/express";
import Order from "../models/order_model.js";
import User from "../models/user_model.js";
import Book from "../models/book_model.js";

export const getOrderByUserId = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const orders = await Order.find({ user: userId }).populate(
      "orderItems.book",
      "title coverImageUrl price"
    );
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in /order:", error);
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const userClerkId = req.auth.userId;
    const user = await User.findOne({ clerkId: userClerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { orderItems } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    let totalPrice = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res
          .status(404)
          .json({ message: `Book not found: ${item.bookId}` });
      }

      const itemTotal = book.price * item.quantity;
      totalPrice += itemTotal;

      processedItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price, // Đơn giá gốc từ DB
      });
    }

    const newOrder = new Order({
      user: user._id,
      orderItems: processedItems,
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error in /order/create:", error);
    next(error);
  }
};
