import Book from "../models/book_model.js";
import User from "../models/user_model.js";
import Order from "../models/order_model.js";
import { handleUploadImage } from "../middleware/uploadFile_middleware.js";

export const createBook = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile || !req.files.images) {
      return res
        .status(400)
        .json({ message: "No file uploaded, please upload all files" });
    }

    const {
      title,
      author,
      description,
      category,
      price,
      publisher,
      publishDate,
      language,
      pages,
      stock,
    } = req.body;
    const coverImage = req.files.imageFile;
    const images = req.files.images;
    const imageArray = Array.isArray(images) ? images : [images]; //Make sure images is an array

    const coverImageUrl = await handleUploadImage(coverImage);
    const imageUrls = await Promise.all(
      imageArray.map((image) => handleUploadImage(image))
    );

    const book = new Book({
      title,
      author,
      description,
      category,
      price,
      publisher,
      publishDate,
      language,
      pages,
      stock,
      coverImageUrl,
      imageUrls,
    });

    await book.save();
    res.status(200).json({
      message: "Book created successfully",
      book: book,
    });
  } catch (error) {
    console.error("Error in /admin/book:", error);
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    //Handle if no cover image uploaded
    const coverImage = req.files?.imageFile || null;
    const coverImageUrl = coverImage
      ? await handleUploadImage(coverImage)
      : book.coverImageUrl;

    //Handle if no images uploaded
    let imageUrls = book.imageUrls;
    const images = req.files?.images || null;
    if (images) {
      const imageArray = Array.isArray(images) ? images : [images];
      imageUrls = await Promise.all(
        imageArray.map((image) => handleUploadImage(image))
      );
    }

    const updateData = {
      ...req.body,
      coverImageUrl,
      imageUrls,
    };

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error in /admin/book/:id:", error);
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: `Book id ${id} deleted successfully` });
  } catch (error) {
    console.error("Error in /admin/book/:id:", error);
    next(error);
  }
};

export const checkAdmin = (req, res) => {
  res.status(200).json({ admin: true });
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in /admin/users:", error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: `User id ${id} deleted successfully`, user: user });
  } catch (error) {
    console.error("Error in /admin/users/:id:", error);
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate(
      "orderItems.book",
      "title price"
    );
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in /admin/orders:", error);
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: `Order id ${id} deleted successfully`, order: order });
  } catch (error) {
    console.error("Error in /admin/orders/delete:", error);
    next(error);
  }
};
