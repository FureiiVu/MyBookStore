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

router.get("/", requireLoggedIn, requireAdmin, getAllUsers);
router.get("/me", requireLoggedIn, getUserById);
router.put("/me", requireLoggedIn, updateUser);

export default router;
