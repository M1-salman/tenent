import { Router } from "express";
import jwtAuthMiddleware from "../middleware/jwt.js";
import { getProfile } from "../controllers/user.js";

const router = Router();

router.get("/profile", jwtAuthMiddleware, getProfile);

export default router;
