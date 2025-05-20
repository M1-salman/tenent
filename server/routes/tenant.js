import { Router } from "express";
import {
  createTenant,
  deleteBill,
  deleteTenant,
  generateBill,
  getBillsByTenantId,
  getTenantById,
  getTenantsByUser,
  updateBill,
  updateTenant,
} from "../controllers/tenant.js";
import jwtAuthMiddleware from "../middleware/jwt.js";

const router = Router();

router.post("/create", jwtAuthMiddleware, createTenant);
router.get("/get", jwtAuthMiddleware, getTenantsByUser);
router.get("/:tenantId", getTenantById);
router.put("/update/:tenantId", updateTenant);
router.delete("/delete/:tenantId", jwtAuthMiddleware, deleteTenant);
router.post("/generate-bill", jwtAuthMiddleware, generateBill);
router.get("/get-bill/:tenantId", getBillsByTenantId);
router.put("/update-bill/:billId", updateBill);
router.delete("/delete-bill/:billId", deleteBill);

export default router;
