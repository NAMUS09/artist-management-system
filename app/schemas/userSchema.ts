import { z } from "zod";
import {
  dobApiSchema,
  dobSchema,
  emailSchema,
  genderSchema,
  phoneNumberSchema,
  roleSchema,
} from "./common";

export const createUserSchema = z
  .object({
    id: z.number().optional(),
    first_name: z.string().nonempty({ message: "First name is required" }),
    last_name: z.string().nonempty({ message: "Last name is required" }),
    email: emailSchema,
    dob: z.union([dobApiSchema, dobSchema]),
    password: z.string().optional(),
    phone: phoneNumberSchema,
    role: z.union([
      z.string().nonempty({ message: "Role is required" }),
      roleSchema,
    ]),
    gender: z.union([
      z.string().nonempty({ message: "Gender is required" }),
      genderSchema,
    ]),
    address: z.string(),
  })
  .superRefine((data, ctx) => {
    // If id is not present, password is required
    if (!data.id) {
      if (!data.password) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password is required",
        });
      } else if (data.password.length < 8) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters long",
        });
      }
    }
  });

export const createMultipleUserSchema = z.array(createUserSchema);

export type CreateUser = z.infer<typeof createUserSchema>;
export type CreateMultipleUser = z.infer<typeof createMultipleUserSchema>;
