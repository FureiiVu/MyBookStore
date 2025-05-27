import { Router } from "express";
import {
  requireLoggedIn,
  requireAdmin,
} from "../middleware/auth_middleware.js";

const router = Router();

router.get("/", requireLoggedIn, requireAdmin, (req, res) => {
  res.send("Hello this is message from API localhost:5000/admin!");
});

export default router;
