import { getUserByEmail, updateUserById } from "@/app/data-access/user";
import { userLoginSchema, UserLoginSchema } from "@/app/schemas/auth";
import { asyncHandler } from "@/app/utils/asyncHandler";
import CustomError from "@/app/utils/customError";
import { generateToken } from "@/app/utils/token";
import { validateRequestBody } from "@/app/utils/validateBody";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/lib/interface";

export const POST = asyncHandler(async (request: Request) => {
  const body = (await request.json()) as UserLoginSchema;

  const [validationError, validatedFields] = validateRequestBody(
    userLoginSchema,
    body
  );
  if (validationError) {
    return NextResponse.json(validationError, { status: 400 }); // If there's an error, return it directly
  }

  const { email, password } = validatedFields;

  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    throw new CustomError("Invalid credentials.");
  }

  if (!user.emailVerified) {
    throw new CustomError("Email not verified.");
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) throw new CustomError("Invalid credentials.");

  // safe to generate token
  const { token, expires } = generateToken({
    id: user.id,
    name: user.name!,
    email: user.email!,
    role: user.role,
  });

  // update user token
  const { id, ...rest } = user;
  await updateUserById(id, {
    rest,
    accessToken: token,
    expires,
  } as unknown as User);

  return NextResponse.json(
    {
      success: true,
      message: "login successful",
      accessToken: token,
      expires: expires.toISOString(),
      user: {
        id: user.id,
        name: user.name!,
        email: user.email,
      },
    },
    { status: 200 }
  );
});
