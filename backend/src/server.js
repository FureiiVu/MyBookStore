import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import { connectDB } from "./lib/db.js";
import userRoute from "./routes/user_route.js";
import authRoute from "./routes/auth_route.js";
import adminRoute from "./routes/admin_route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(clerkMiddleware()); // Middleware to handle Clerk authentication

// Importing routes
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  connectDB();
});
