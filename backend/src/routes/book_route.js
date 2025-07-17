import { Router } from "express";

import { getAllBooks, getBookById } from "../controller/book_controller.js";

const router = Router();

router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);

export default router;
