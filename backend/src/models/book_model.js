import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: [{ type: String, required: true }],
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    publisher: { type: String, required: true },
    publishDate: { type: Date, required: true },
    language: { type: String, required: true },
    pages: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    coverImageUrl: { type: String, required: true },
    imageUrls: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
