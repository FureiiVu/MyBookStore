import cloudinary from "../lib/cloudinary.js";

export const handleUploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading an image to cloudinary:", error);
    throw new Error("Error uploading an image to cloudinary");
  }
};
