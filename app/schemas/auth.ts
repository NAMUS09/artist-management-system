import { z } from "zod";
import { emailSchema, passwordSchema } from "./common";

const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type UserLoginSchema = z.infer<typeof userLoginSchema>;

export { userLoginSchema };
