import prisma from "../lib/db.js";

export async function checkAdmin(req, res) {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin access verified",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to verify admin status",
    });
  }
}

export async function getTotalUsers(req, res) {
  try {
    const totalUsers = await prisma.user.count();
    
    return res.status(200).json({
      success: true,
      totalUsers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to get total users count"
    });
  }
}
