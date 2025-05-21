import prisma from "../lib/db.js";
import vine, { errors, SimpleMessagesProvider } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import { RegisterSchema, LoginSchema } from "../validations/auth.js";
import { getUserByEmail } from "../data/user.js";
import { generateToken } from "../utils/jwt.js";

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

    
      // Create the user
    const user = await prisma.user.create({
      data: payload,
    });

    return res.status(200).json({ 
      success: "User created successfully!",
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ error: "Invalid input" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function loginUser(req, res) {
  try {
    const body = req.body;
    const validator = vine.compile(LoginSchema);
    validator.messagesProvider = new SimpleMessagesProvider({
      "password.minLength": "Password is required",
    });
    const payload = await validator.validate(body);

    const existingUser = await getUserByEmail(payload.email);

    if (!existingUser) {
      return res.status(400).json({ error: "Email does not exisit" });
    }

    // Compare entered password with hashed password in database
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    const token = generateToken(existingUser.id);

    return res
      .status(200)
      .json({ success: "User login successfully!", token: token });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ error: "Invalid input" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
