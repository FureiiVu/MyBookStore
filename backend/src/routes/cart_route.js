import { Router } from "express";
import { requireLoggedIn } from "../middleware/auth_middleware.js";
import {
  getCartItems,
  addToCart,
  removeCartItem,
  removeAllCartItem,
} from "../controller/cart_controller.js";

const router = Router();

router.get("/cart", requireLoggedIn, getCartItems);
router.post("/cart/update", requireLoggedIn, addToCart);
router.delete("/cart/:id", requireLoggedIn, removeCartItem);
router.delete("/cart", requireLoggedIn, removeAllCartItem);

export default router;
