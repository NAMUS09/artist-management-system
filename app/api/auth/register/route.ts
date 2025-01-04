import { createUser, getUserByEmail } from "@/app/data-access/user";
import {
  UserRegisterApiSchema,
  userRegisterApiSchema,
} from "@/app/schemas/auth";
import { asyncHandler } from "@/app/utils/asyncHandler";
import { hash } from "@/app/utils/common";
import CustomError from "@/app/utils/customError";
import { validateRequestBody } from "@/app/utils/validateBody";
import { User } from "@/lib/interface";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (request: Request) => {
  const body = (await request.json()) as UserRegisterApiSchema;

  const [validationError, validatedFields] = validateRequestBody(
    userRegisterApiSchema,
    body
  );
  if (validationError) {
    return NextResponse.json(validationError, { status: 400 }); // If there's an error, return it directly
  }

  const {
    email,
    first_name,
    last_name,
    password,
    role,
    dob,
    gender,
    address,
    phone,
  } = validatedFields;

  // Check if a user already exists with the provided email
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new CustomError("User already exists!!", 400);
  }

  // Hash the password
  const hashedPassword = await hash(password);

  // Create the user
  const user = await createUser({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    role,
    dob: new Date(dob),
    gender,
    address,
    phone,
  } as User);

  const response = {
    success: true,
    message: "User created successfully",
    user,
  };

  return NextResponse.json(response, { status: 200 });
});
