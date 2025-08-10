import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import fs from "fs";

import { connectDB } from "./lib/db.js";
import userRoute from "./routes/user_route.js";
import authRoute from "./routes/auth_route.js";
import adminRoute from "./routes/admin_route.js";
import bookRoute from "./routes/book_route.js";
import cartRoute from "./routes/cart_route.js";
import orderRoute from "./routes/order_route.js";
import reviewRoute from "./routes/review_route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve(); // Get the current directory path

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); // Middleware to enable CORS

app.use(express.json()); // Middleware to parse JSON bodies
app.use(clerkMiddleware()); // Middleware to handle Clerk authentication => get req.auth object
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit to 50 MB
    abortOnLimit: true, // Abort the request if the file size exceeds the limit
    useTempFiles: true, // Store uploaded files in a temporary directory
    tempFileDir: path.join(__dirname, "/tmp/"), // Specify the temporary directory for file uploads
    createParentPath: true, // Create parent directories if they do not exist
  })
); // Middleware to handle file uploads

// Cron job to clean "tmp" folder every 1 hour
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

// Importing routes
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/books", bookRoute);
app.use("/cart", cartRoute);
app.use("/orders", orderRoute);
app.use("/reviews", reviewRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  return res.status(500).json({
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  connectDB();
});
