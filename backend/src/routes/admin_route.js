import { Router } from "express";

import {
  requireLoggedIn,
  requireAdmin,
} from "../middleware/auth_middleware.js";
import {
  createBook,
  updateBook,
  deleteBook,
  checkAdmin,
  getUsers,
  deleteUser,
  getOrders,
  deleteOrder,
} from "../controller/admin_controller.js";

const router = Router();

router.use(requireLoggedIn, requireAdmin); // Apply logged-in middleware to all admin routes

// Admin routes for managing books
router.post("/books", createBook);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

router.get("/check", checkAdmin);

// Admin routes for managing users
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Admin routes for managing orders
router.get("/orders", getOrders);
router.delete("/orders/:id", deleteOrder);

export default router;
