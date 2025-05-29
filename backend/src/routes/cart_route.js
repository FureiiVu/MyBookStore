import { Router } from "express";
import { requireLoggedIn } from "../middleware/auth_middleware.js";
import {
  getCartItems,
  addToCart,
  removeCartItem,
  removeAllCartItem,
} from "../controller/cart_controller.js";

const router = Router();

router.get("/", requireLoggedIn, getCartItems);
router.post("/update", requireLoggedIn, addToCart);
router.delete("/remove/:id", requireLoggedIn, removeCartItem);
router.delete("/remove", requireLoggedIn, removeAllCartItem);

export default router;
