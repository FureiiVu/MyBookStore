import Order from "../models/order_model.js";
import User from "../models/user_model.js";
import Book from "../models/book_model.js";

import mongoose from "mongoose";

export const getOrderByUserId = async (req, res, next) => {
  try {
    const userClerkId = req.auth().userId;
    const user = await User.findOne({ clerkId: userClerkId });

    if (!user) {
      return res.status(404).json({
        message: "Error in getting order by user ID: User not found",
      });
    }

    const orders = await Order.find({ user: user._id }).populate(
      "orderItems.book"
    );
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getting order by user ID:", error);
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const userClerkId = req.auth().userId;
    const user = await User.findOne({ clerkId: userClerkId });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Error in creating order: User not found" });
    }

    const { orderItems } = req.body;
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Error in creating order: No items in the order" });
    }

    let totalPrice = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const { bookId, quantity } = item;

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({
          message: `Error in creating order: Invalid book ID - ${bookId}`,
        });
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: `Error in creating order: Invalid quantity for book ${bookId}`,
        });
      }

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({
          message: `Error in creating order: Book not found - ${bookId}`,
        });
      }

      if (book.stock < quantity) {
        return res.status(400).json({
          message: `Error in creating order: Not enough stock for "${book.title}"`,
        });
      }

      // Trừ stock
      book.stock -= quantity;
      await book.save();

      const itemTotal = book.price * quantity;
      totalPrice += itemTotal;

      processedItems.push({
        book: book._id,
        quantity,
        price: book.price,
        title: book.title,
        coverImageUrl: book.coverImageUrl,
      });
    }

    const newOrder = new Order({
      user: user._id,
      orderItems: processedItems,
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error("Error in creating order:", error);
    next(error);
  }
};
