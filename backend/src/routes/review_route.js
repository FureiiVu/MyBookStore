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
router.get("/:bookId", requireLoggedIn, getReviewByBookId);
router.post("/", requireLoggedIn, createReview);
router.put("/:reviewId", requireLoggedIn, updateReview);
router.delete("/:reviewId", requireLoggedIn, deleteReviewById);
router.delete("/:bookId", requireLoggedIn, requireAdmin, deleteReviewByBookId);

export default router;
