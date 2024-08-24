import prisma from "../lib/db.js";
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "../validations/auth.js";
import { getUserByEmail } from "../data/user.js";

export async function registerUser(req, res) {
  try {
    const body = req.body;
    const validator = vine.compile(RegisterSchema);
    const payload = await validator.validate(body);

    const existingUser = await getUserByEmail(payload.email);

    // display text if email is taken
    if (existingUser) {
      return res.status(400).json({ error: "Email already taken 😞" });
    }

    payload.password = await bcrypt.hash(payload.password, 10);

    const user = await prisma.user.create({
      data: payload,
    });

    return res
      .status(200)
      .json({ success: "User created successfully!", payload });
  } catch (error) {
    console.log(error);
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ errors: error.messages });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
