import Book from "../models/book_model.js";
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
