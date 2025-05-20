import prisma from "../lib/db.js";
import vine, { errors } from "@vinejs/vine";
import { TenantSchema, BillSchema } from "../validations/tenant.js";

export async function createTenant(req, res) {
  try {
    const body = req.body;
    const validator = vine.compile(TenantSchema);
    const payload = await validator.validate(body);

    // Create tenant in the database with userId from JWT token
    const tenant = await prisma.tenant.create({
      data: {
        ...payload,
        userId: req.user.userId,
      },
    });

    return res.status(201).json({
      success: "Tenant created successfully!",
      tenant: tenant,
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ error: "Invalid input" });
    } else {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function getTenantsByUser(req, res) {
  try {
    const userId = req.user.userId;

    // Fetch all tenants associated with the user
    const tenants = await prisma.tenant.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc", // Sort by creation date, newest first
      },
    });

    return res.status(200).json({
      success: "Tenant fetched successfully!",
      data: tenants,
      count: tenants.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch tenants",
    });
  }
}

export async function getTenantById(req, res) {
  try {
    const tenantId = req.params.tenantId;
    const tenant = await prisma.tenant.findUnique({
      where: { tenantId: tenantId },
    });

    return res.status(200).json({
      success: "Tenant fetched successfully!",
      data: tenant,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch tenant",
    });
  }
}

export async function updateTenant(req, res) {
  try {
    const tenantId = req.params.tenantId;
    const body = req.body;

    const validator = vine.compile(TenantSchema);
    const payload = await validator.validate(body);

    const tenant = await prisma.tenant.update({
      where: { tenantId: tenantId },
      data: payload,
    });

    return res.status(200).json({
      success: "Tenant updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update tenant",
    });
  }
}

export async function deleteTenant(req, res) {
  try {
    const tenantId = req.params.tenantId;

    // Use transaction to delete bills and tenant
    const result = await prisma.$transaction(async (tx) => {
      // First delete all bills related to this tenant
      await tx.bill.deleteMany({
        where: { tenantId: tenantId },
      });

      // Then delete the tenant
      const deletedTenant = await tx.tenant.delete({
        where: { tenantId: tenantId },
      });

      return { deletedTenant };
    });

    return res.status(200).json({
      success: "Tenant and associated bills deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to delete tenant",
    });
  }
}

export async function generateBill(req, res) {
  try {
    const body = req.body;
    const validator = vine.compile(BillSchema);
    const payload = await validator.validate(body);

    const bill = await prisma.bill.create({
      data: {
        ...payload,
        userId: req.user.userId,
      },
    });

    return res.status(201).json({
      success: "Bill generated successfully!",
      bill: bill,
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ errors: error.messages });
    } else {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function getBillsByTenantId(req, res) {
  try {
    const tenantId = req.params.tenantId;
    const bills = await prisma.bill.findMany({
      where: { tenantId: tenantId },
    });

    return res.status(200).json({
      success: "Bills fetched successfully!",
      data: bills,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch bills",
    });
  }
}

export async function updateBill(req, res) {
  try {
    const billId = req.params.billId;
    const body = req.body;
    const validator = vine.compile(BillSchema);
    const payload = await validator.validate(body);

    const bill = await prisma.bill.update({
      where: { billId: billId },
      data: payload,
    });

    return res.status(200).json({
      success: "Bill updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update bill",
    });
  }
}

export async function deleteBill(req, res) {
  try {
    const billId = req.params.billId;
    await prisma.bill.delete({
      where: { billId: billId },
    });

    return res.status(200).json({
      success: "Bill deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete bill",
    });
  }
}
