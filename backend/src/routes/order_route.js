import { Router } from "express";
import { requireLoggedIn } from "../middleware/auth_middleware.js";
import {
  getOrderByUserId,
  createOrder,
} from "../controller/order_controller.js";

const router = Router();

router.get("/orders", requireLoggedIn, getOrderByUserId);
router.post("/orders", requireLoggedIn, createOrder);

export default router;
