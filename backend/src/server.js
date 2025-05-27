import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";

import exampleRoute from "./routes/example_route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use("/example", exampleRoute);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  connectDB();
});
