import { Router } from "express";

import {
  requireLoggedIn,
  requireAdmin,
} from "../middleware/auth_middleware.js";
import {
  createBook,
  updateBook,
  deleteBook,
  deleteBooks,
  checkAdmin,
  getOrders,
  deleteOrder,
  deleteOrders,
} from "../controller/admin_controller.js";

const router = Router();

router.use(requireLoggedIn, requireAdmin); // Apply logged-in middleware to all admin routes

// Admin check
router.get("/check", checkAdmin);

// Books management
router.post("/books", createBook);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);
router.post("/books/delete", deleteBooks);

// Orders management
router.get("/orders", getOrders);
router.delete("/orders/:id", deleteOrder);
router.post("/orders/delete", deleteOrders);

export default router;
