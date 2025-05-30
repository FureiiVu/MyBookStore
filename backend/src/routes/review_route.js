import { Router } from "express";

import {
  getAllReviews,
  getReviewByBookId,
  createReview,
  updateReview,
  deleteReviewById,
  deleteReviewByBookId,
} from "../controller/review_controller.js";
import {
  requireLoggedIn,
  requireAdmin,
} from "../middleware/auth_middleware.js";

const router = Router();

router.get("/", requireLoggedIn, requireAdmin, getAllReviews);
router.get("/book/:bookId", requireLoggedIn, getReviewByBookId);
router.post("/:reviewId", requireLoggedIn, createReview);
router.put("/:reviewId", requireLoggedIn, updateReview);
router.delete("/:reviewId", requireLoggedIn, deleteReviewById);
router.delete(
  "/book/:bookId",
  requireLoggedIn,
  requireAdmin,
  deleteReviewByBookId
);

export default router;
