import mongoose from "mongoose";
import User from "../models/user_model.js";
import Review from "../models/review_model.js";

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate("user", "name imageUrl");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in get all reviews:", error);
    next(error);
  }
};

export const getReviewByBookId = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }

    const reviews = await Review.find({ book: bookId }).populate(
      "user",
      "name imageUrl"
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        message: `Error in getting reviews by book ID: No reviews found for this book ID - ${bookId}`,
      });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getting reviews by book ID:", error);
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res
        .status(400)
        .json({ message: "Error in creating review: Invalid Book ID" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Error in creating review: Rating must be between 1 and 5",
      });
    }

    const userClerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userClerkId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Error in creating review: User not found" });
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
    console.error("Error in creating review:", error);
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const userClerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userClerkId });

    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ message: "Error in updating review: Invalid Review ID" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ message: "Error in updating review: Review not found" });
    }

    if (review.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        message:
          "Error in updating review: You are not authorized to update this review",
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Error in updating review: Rating must be between 1 and 5",
        });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();
    res.status(200).json({ message: "Review updated", review });
  } catch (error) {
    console.error("Error in updating review:", error);
    next(error);
  }
};

export const deleteReviewById = async (req, res, next) => {
  try {
    const userClerkId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userClerkId });

    const { reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ message: "Error in deleting review: Invalid Review ID" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ message: "Error in deleting review: Review not found" });
    }

    if (review.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        message:
          "Error in deleting review: You are not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(reviewId);
    res
      .status(200)
      .json({ message: `Review ID ${reviewId} deleted successfully`, review });
  } catch (error) {
    console.error("Error in deleting review:", error);
    next(error);
  }
};

export const deleteReviewByBookId = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: "Error in deleting review by book ID: Invalid Book ID",
      });
    }

    const result = await Review.deleteMany({ book: bookId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message:
          "Error in deleting review by book ID: No reviews found for this book",
      });
    }

    res.status(200).json({
      message: `Deleted ${result.deletedCount} reviews for book ID - ${bookId}`,
    });
  } catch (error) {
    console.error("Error in deleting review by book ID:", error);
    next(error);
  }
};
