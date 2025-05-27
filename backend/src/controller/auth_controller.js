import User from "../models/user_model.js";

export const authController = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    const user = await User.findOne({ clerkId: id }); // Check if user exists

    if (!user) {
      // If user does not exist, create a new user
      const newUser = await User.create({
        name: `${firstName} ${lastName}`,
        imageUrl,
        clerkId: id,
      });
      return res.status(201).json({ success: true, user: newUser });
    }
  } catch (error) {
    console.error("Error in /auth/callback:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
