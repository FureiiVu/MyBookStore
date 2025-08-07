import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
} from "../controller/user_controller.js";
import {
  requireLoggedIn,
  requireAdmin,
} from "../middleware/auth_middleware.js";

const router = Router();

router.get("/all", requireLoggedIn, requireAdmin, getAllUsers); // Đổi route getAllUsers
router.get("/profile", requireLoggedIn, getUserById); // Đổi route getUserById
router.put("/:id", requireLoggedIn, updateUser);

export default router;
