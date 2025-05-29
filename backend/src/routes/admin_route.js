import { Router } from "express";

import {
  requireLoggedIn,
  requireAdmin,
} from "../middleware/auth_middleware.js";
import {
  createBook,
  deleteBook,
  checkAdmin,
} from "../controller/admin_controller.js";

const router = Router();

router.use(requireLoggedIn, requireAdmin); // Apply logged-in middleware to all admin routes

router.post("/books", createBook);
router.delete("/books/:id", deleteBook);

router.get("/check", checkAdmin);

export default router;
