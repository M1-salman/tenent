import { Router } from "express";
import jwtAuthMiddleware from "../middleware/jwt.js";
import { getProfile, uploadProfile } from "../controllers/user.js";
import upload from "../middleware/multerConfig.js";

const router = Router();

router.get("/profile", jwtAuthMiddleware, getProfile);
router.post(
  "/upload-profile",
  jwtAuthMiddleware,
  upload.single("profileImage"),
  uploadProfile
);

export default router;
