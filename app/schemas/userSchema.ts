import { z } from "zod";
import {
  dobApiSchema,
  emailSchema,
  genderSchema,
  passwordSchema,
  phoneNumberSchema,
  roleSchema,
} from "./common";

export const createUserSchema = z.object({
  id: z.number().optional(),
  first_name: z.string(),
  last_name: z.string(),
  email: emailSchema,
  dob: dobApiSchema,
  password: passwordSchema,
  phone: phoneNumberSchema,
  role: roleSchema,
  gender: genderSchema,
  address: z.string(),
});

export const createMultipleUserSchema = z.array(createUserSchema);

export type CreateUser = z.infer<typeof createUserSchema>;
export type CreateMultipleUser = z.infer<typeof createMultipleUserSchema>;
