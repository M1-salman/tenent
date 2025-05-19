import { Router } from "express";
import { createTenant, generateBill, getTenantsByUser } from "../controllers/tenant.js";
import jwtAuthMiddleware from "../middleware/jwt.js";

const router = Router();

router.post("/create", jwtAuthMiddleware, createTenant);
router.get("/get", jwtAuthMiddleware, getTenantsByUser);
router.post("/generate-bill", jwtAuthMiddleware, generateBill);

export default router;
