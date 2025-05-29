import User from "../models/user_model.js";
import { handleUploadImage } from "../middleware/uploadFile_middleware.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const user = await User.find({ clerkId: currentUserId });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const currentUser = await User.findOne({ clerkId: currentUserId });

    const { name } = req.body;
    const userIcon =
      req.files && req.files.imageFile ? req.files.imageFile : null;
    const userIconUrl = userIcon
      ? await handleUploadImage(userIcon)
      : currentUser.imageUrl;

    const newUser = await User.findOneAndUpdate(
      { clerkId: currentUserId },
      {
        name,
        imageUrl: userIconUrl,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};
