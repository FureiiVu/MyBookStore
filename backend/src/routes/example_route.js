import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello this is message from API localhost:5000/example!");
});

export default router;
