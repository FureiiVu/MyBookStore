import { clerkClient } from "@clerk/express";

export const requireLoggedIn = (req, res, next) => {
  const auth = req.auth();
  if (!auth || !auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - You must be logged in" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth().userId);

    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.emailAddresses[0].emailAddress;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden - You do not have admin access" });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({
      message: "Error checking admin status",
      error: error.message,
    });
  }
};
