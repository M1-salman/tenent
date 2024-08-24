import prisma from "../lib/db.js";

export const getUserByEmail = async (email) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      return user;
    } catch {
      return null;
    }
  };