import { getUserByEmail, updateUserById } from "@/app/data-access/user";
import { userLoginSchema, UserLoginSchema } from "@/app/schemas/auth";
import { asyncHandler } from "@/app/utils/asyncHandler";
import CustomError from "@/app/utils/customError";
import { generateToken } from "@/app/utils/token";
import { validateRequestBody } from "@/app/utils/validateBody";
import { User } from "@/lib/interface";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (request: Request) => {
  const cookieStore = await cookies();
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

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) throw new CustomError("Invalid credentials.");

  const fullName = `${user.first_name} ${user.last_name}`;

  // safe to generate token
  const { token, expires } = await generateToken({
    id: user.id,
    email: user.email!,
    name: fullName,
    role: user.role,
  });

  // update user token
  const { id, ...rest } = user;
  await updateUserById(id, {
    ...rest,
    accessToken: token,
    expires,
  } as unknown as User);

  const responseData = {
    accessToken: token,
    expires: expires.toISOString(),
    user: {
      id: user.id,
      name: fullName,
      email: user.email,
    },
  };

  cookieStore.set({
    name: "accessToken",
    value: token,
    httpOnly: true,
    path: "/",
  });

  return NextResponse.json(
    {
      success: true,
      message: "login successful",
      ...responseData,
    },
    { status: 200 }
  );
});
