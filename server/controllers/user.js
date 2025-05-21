import { getUserById } from "../data/user.js";
import cloudinary from "../middleware/cloudinaryConfig.js";
import prisma from "../lib/db.js";

export async function getProfile(req, res) {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(400).json({ error: "userId not found in token." });
    }
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Optionally, remove sensitive fields like password
    const { createdAt, updatedAt, emailVerified, password, id, ...userData } =
      user;
    return res
      .status(200)
      .json({ success: "User profile fetched successfully!", user: userData });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function uploadProfile(req, res) {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(400).json({ error: "userId not found in token." });
    }

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    // Convert buffer to base64 string for cloudinary
    const fileStr = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    // Upload to cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileStr, {
      folder: "tenent_profile_images",
      public_id: `user_${userId}_${Date.now()}`,
      overwrite: true,
      resource_type: "image",
    });

    // Update user in database with new image URL
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: uploadResult.secure_url },
    });


    return res.status(200).json({
      success: "Profile image updated successfully",
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Profile upload error:", error);

    // Handle specific errors
    if (error.message === "Only JPEG/JPG images are allowed") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message?.includes("File too large")) {
      return res
        .status(400)
        .json({ error: "Image size should be less than 5MB" });
    }

    return res.status(500).json({ error: "Failed to upload profile image" });
  }
}
