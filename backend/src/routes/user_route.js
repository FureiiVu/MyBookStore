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
router.get("/:id", requireLoggedIn, getUserById);
router.put("/:id", requireLoggedIn, updateUser);

export default router;
