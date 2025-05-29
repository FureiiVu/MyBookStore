import { Router } from "express";

import { getAllBooks, getBookById } from "../controller/book_controller.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);

export default router;
