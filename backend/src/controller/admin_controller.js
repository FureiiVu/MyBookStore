import Book from "../models/book_model.js";
import Order from "../models/order_model.js";
import Review from "../models/review_model.js";
import Cart from "../models/cart_model.js";
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
    console.error("Error in creating book:", error);
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

    const coverImage = req.files?.imageFile || null;
    const coverImageUrl = coverImage
      ? await handleUploadImage(coverImage)
      : book.coverImageUrl;

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
    console.error("Error in updating book:", error);
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

    await Promise.all([
      Book.findByIdAndDelete(id),
      Review.deleteMany({ book: book._id }), // Delete all reviews associated with the book
      Cart.updateMany({}, { $pull: { items: { book: id } } }), // Remove book from all carts
    ]);

    res.status(200).json({
      message: `Book id ${id} deleted successfully`,
      book: book,
    });
  } catch (error) {
    console.error("Error in deleting book:", error);
    next(error);
  }
};

export const deleteBooks = async (req, res, next) => {
  try {
    const { bookIds } = req.body;

    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: "Invalid book ids provided" });
    }

    // Delete books and related data
    await Promise.all([
      Book.deleteMany({ _id: { $in: bookIds } }),
      Review.deleteMany({ book: { $in: bookIds } }),
      Cart.updateMany({}, { $pull: { items: { book: { $in: bookIds } } } }),
    ]);

    res.status(200).json({
      message: "Books deleted successfully",
      deletedCount: bookIds.length,
    });
  } catch (error) {
    console.error("Error in batch deleting books:", error);
    next(error);
  }
};

export const checkAdmin = (req, res) => {
  res.status(200).json({ admin: true });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user items.book");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getting orders:", error);
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

    res.status(200).json({
      message: `Order ${id} deleted successfully`,
      order: order,
    });
  } catch (error) {
    console.error("Error in deleting order:", error);
    next(error);
  }
};

export const deleteOrders = async (req, res, next) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: "Invalid order ids provided" });
    }

    await Order.deleteMany({ _id: { $in: orderIds } });

    res.status(200).json({
      message: "Orders deleted successfully",
      deletedCount: orderIds.length,
    });
  } catch (error) {
    console.error("Error in batch deleting orders:", error);
    next(error);
  }
};
