import { z } from "zod";
import {
  dobApiSchema,
  dobSchema,
  emailSchema,
  genderSchema,
  passwordSchema,
  phoneNumberSchema,
  roleSchema,
} from "./common";

export const userRegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  first_name: z.string().nonempty({ message: "First name is required" }),
  last_name: z.string().nonempty({ message: "Last name is required" }),
  phone: phoneNumberSchema,
  dob: dobSchema,
  gender: genderSchema,
  role: roleSchema,
  address: z.string().nonempty({ message: "Address is required" }),
});

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;

export const userRegisterApiSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  first_name: z.string().nonempty({ message: "First name is required" }),
  last_name: z.string().nonempty({ message: "Last name is required" }),
  phone: phoneNumberSchema,
  dob: dobApiSchema,
  gender: genderSchema,
  role: roleSchema,
  address: z.string().nonempty({ message: "Address is required" }),
});

export type UserRegisterApiSchema = z.infer<typeof userRegisterApiSchema>;

export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type UserLoginSchema = z.infer<typeof userLoginSchema>;
