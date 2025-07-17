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

router.get("/reviews", requireLoggedIn, requireAdmin, getAllReviews);
router.get("/reviews/:bookId", requireLoggedIn, getReviewByBookId);
router.post("/reviews", requireLoggedIn, createReview);
router.put("/reviews/:reviewId", requireLoggedIn, updateReview);
router.delete("/reviews/:reviewId", requireLoggedIn, deleteReviewById);
router.delete(
  "/reviews/:bookId",
  requireLoggedIn,
  requireAdmin,
  deleteReviewByBookId
);

export default router;
