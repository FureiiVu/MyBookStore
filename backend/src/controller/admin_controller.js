import cloudinary from "../lib/cloudinary";
import Book from "../models/book.js";
import cloudinary from "../lib/cloudinary.js";

const handleUploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading an image to cloudinary:", error);
    throw new Error("Error uploading an image to cloudinary");
  }
};

export const createBook = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
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
      rating,
      numReviews,
    } = req.body;
    const coverImage = req.files.imageFile;
    const images = req.files.images;

    const coverImageUrl = await handleUploadImage(coverImage);
    const imageUrls = await Promise.all(
      images.map((image) => handleUploadImage(image))
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
      rating,
      numReviews,
      coverImageUrl,
      imageUrls,
    });

    await book.save();
  } catch (error) {
    console.error("Error in /admin/newbook:", error);
    next(error);
  }
};
