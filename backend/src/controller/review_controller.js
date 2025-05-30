import User from "../models/user_model.js";
import Review from "../models/review_model.js";

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getAllReviews:", error);
    next(error);
  }
};

export const getReviewByBookId = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const reviews = await Review.find({ book: bookId }).populate(
      "user",
      "name imageUrl"
    );

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this book" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getReviewByBookId:", error);
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    if (!bookId || !rating) {
      return res
        .status(400)
        .json({ message: "Book ID and rating are required" });
    }

    const userClerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userClerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newReview = new Review({
      user: user._id,
      book: bookId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error in createReview:", error);
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const userClerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userClerkId });

    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this review" });
    }

    if (typeof rating !== "undefined") review.rating = rating;
    if (typeof comment !== "undefined") review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review updated", review });
  } catch (error) {
    console.error("Error in updateReview:", error);
    next(error);
  }
};

export const deleteReviewById = async (req, res, next) => {
  try {
    const userClerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userClerkId });

    const { reviewId } = req.params;
    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    res
      .status(200)
      .json({ message: `Review ID ${reviewId} deleted successfully`, review });
  } catch (error) {
    console.error("Error in deleteReviewById:", error);
    next(error);
  }
};

export const deleteReviewByBookId = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const result = await Review.deleteMany({ book: bookId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this book" });
    }

    res.status(200).json({
      message: `Deleted ${result.deletedCount} reviews for book ${bookId}`,
    });
  } catch (error) {
    console.error("Error in deleteReviewByBookId:", error);
    next(error);
  }
};
