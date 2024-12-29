import { getUserById, updateUserById } from "@/app/data-access/user";
import { asyncHandler } from "@/app/utils/asyncHandler";
import CustomError from "@/app/utils/customError";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const cookieStore = await cookies();
  const user = await getCurrentUser();

  if (!user) {
    throw new CustomError("Unauthorized", 401);
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new CustomError("Unauthorized", 401);
  }

  await updateUserById(user.id, {
    ...dbUser,
    access_token: null,
    expires: null,
  });

  cookieStore.delete("accessToken");

  return NextResponse.json({ status: 200, body: "Logout successful" });
});
