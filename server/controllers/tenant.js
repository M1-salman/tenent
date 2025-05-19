import prisma from "../lib/db.js";
import vine, { errors } from "@vinejs/vine";
import { TenantSchema, BillSchema } from "../validations/tenant.js";

export async function createTenant(req, res) {
  try {
    const body = req.body;
    const validator = vine.compile(TenantSchema);
    const payload = await validator.validate(body);

    // Use transaction to create tenant and update total count
    const result = await prisma.$transaction(async (tx) => {
      // Create tenant in the database with userId from JWT token
      const tenant = await tx.tenant.create({
        data: {
          ...payload,
          userId: req.user.userId,
        },
      });

      // Get or create TotalTenants record for this user
      let totalTenants = await tx.totalTenants.findUnique({
        where: { userId: req.user.userId },
      });

      if (!totalTenants) {
        // Create initial record if it doesn't exist
        totalTenants = await tx.totalTenants.create({
          data: {
            userId: req.user.userId,
            count: 1,
          },
        });
      } else {
        // Increment the count
        totalTenants = await tx.totalTenants.update({
          where: { userId: req.user.userId },
          data: {
            count: {
              increment: 1,
            },
          },
        });
      }

      return { tenant, totalTenants };
    });

    return res.status(201).json({
      success: "Tenant created successfully!",
      tenant: result.tenant,
      totalTenants: result.totalTenants.count,
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
