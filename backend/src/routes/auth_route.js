import { Router } from "express";
import { authController } from "../controller/auth_controller.js";

const router = Router();

router.post("/callback", authController);

export default router;
