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
