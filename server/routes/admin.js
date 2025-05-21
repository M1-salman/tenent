import { Router } from "express";
import jwtAuthMiddleware from "../middleware/jwt.js";
import { checkAdmin, getTotalUsers } from "../controllers/admin.js";

const router = Router();

router.get("/check-admin", jwtAuthMiddleware, checkAdmin);
router.get("/total-users", getTotalUsers);

export default router;
