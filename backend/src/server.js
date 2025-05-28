import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";

import { connectDB } from "./lib/db.js";
import userRoute from "./routes/user_route.js";
import authRoute from "./routes/auth_route.js";
import adminRoute from "./routes/admin_route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve(); // Get the current directory path

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

// Importing routes
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/admin", adminRoute);

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
