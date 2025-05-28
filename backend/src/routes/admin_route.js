import { Router } from "express";
import {
  requireLoggedIn,
  requireAdmin,
} from "../middleware/auth_middleware.js";
import { createBook } from "../controller/admin_controller.js";

const router = Router();

router.post("/newbook", requireLoggedIn, requireAdmin, createBook);

export default router;
