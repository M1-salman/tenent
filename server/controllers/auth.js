import prisma from "../lib/db.js";
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "../validations/auth.js";

export async function registerUser(req, res) {
  try {
    const body = req.body;
    const validator = vine.compile(RegisterSchema);
    const payload = await validator.validate(body);

    const salt = bcrypt.genSaltSync(10);
    payload.password = bcrypt.hashSync(payload.password, salt);

    const user = await prisma.user.create({
      data: payload,
    });

    return res
      .status(200)
      .json({ success: "User created successfully!", payload });
  } catch (error) {
    console.log(error);
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(500).json(error.messages);
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
