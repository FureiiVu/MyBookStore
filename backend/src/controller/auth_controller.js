import User from "../models/user_model.js";

export const authController = async (req, res, next) => {
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
      return res.status(200).json({ success: true, user: newUser });
    }
  } catch (error) {
    console.error("Error in /auth/callback:", error);
    next(error);
  }
};
