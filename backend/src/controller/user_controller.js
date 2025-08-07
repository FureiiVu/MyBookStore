import User from "../models/user_model.js";
import { handleUploadImage } from "../middleware/uploadFile_middleware.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getting all users:", error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const currentUserId = req.auth().userId;
    const user = await User.findOne({ clerkId: currentUserId });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Error in getting user by ID: User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getting user by ID:", error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const currentUserId = req.auth().userId;
    const currentUser = await User.findOne({ clerkId: currentUserId });

    if (!currentUser) {
      return res
        .status(404)
        .json({ message: "Error in updating user: User not found" });
    }

    const { name } = req.body;

    let userIconUrl = currentUser.imageUrl;
    if (req.files && req.files.imageFile) {
      const imageFile = Array.isArray(req.files.imageFile)
        ? req.files.imageFile[0]
        : req.files.imageFile;

      if (imageFile) {
        userIconUrl = await handleUploadImage(imageFile);
      }
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (userIconUrl) updatedFields.imageUrl = userIconUrl;

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: currentUserId },
      updatedFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updating user:", error);
    next(error);
  }
};
