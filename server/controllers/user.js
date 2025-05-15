import { getUserById } from "../data/user.js";

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
