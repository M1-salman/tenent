import { z } from "zod";

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, {
        message: "First Name is required",
      })
      .max(30, {
        message: "First Name must be 30 characters or less",
      })
      .regex(/^[A-Za-z]+$/, {
        message: "First Name must contain only alphabets",
      }),
    lastName: z
      .string()
      .min(1, {
        message: "Last Name is required",
      })
      .max(20, {
        message: "Last Name must be 20 characters or less",
      })
      .regex(/^[A-Za-z]+$/, {
        message: "Last Name must contain only alphabets",
      }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, {
        message: "Minimum 6 characters",
      })
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, {
        message: "Passwords must contain letters and numbers",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const TenantSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name is required" })
    .max(50, { message: "First Name must be 50 characters or less" })
    .regex(/^[A-Za-z]+$/, { message: "First Name must contain only alphabets" }),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required" })
    .max(50, { message: "Last Name must be 50 characters or less" })
    .regex(/^[A-Za-z]+$/, { message: "Last Name must contain only alphabets" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(7, { message: "Phone number must be at least 7 digits" })
    .max(15, { message: "Phone number must be 15 digits or less" })
    .regex(/^\+?[0-9 ]+$/, { message: "Phone number must contain only numbers, +, and spaces" }),
  monthlyRent: z.number().min(0, { message: "Monthly rent must be a positive number" }),
  totalRooms: z.number().min(1, { message: "Total rooms must be at least 1" }),
  fix: z.number().optional(),
  perUnit: z.number().optional(),
  advance: z.number().min(0, { message: "Advance payment must be a positive number" }),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date().optional(),
});

export const BillSchema = z.object({
  tenantId: z.string(),
  totalUnits: z.number().min(0, { message: "Total units must be a positive number" }).optional(),
  electricityBill: z.number().min(0, { message: "Electricity bill must be a positive number" }),
  advance: z.number().min(0, { message: "Advance payment must be a positive number" }),
  arrears: z.number().min(0, { message: "Arrears must be a positive number" }),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  billType: z.string(),
  total: z.number().min(0, { message: "Total must be a positive number" }),
});

