import { Router } from "express";

import { getAllReviews } from "../controller/review_controller.js";

const router = Router();

router.get("/", getAllReviews);

export default router;
