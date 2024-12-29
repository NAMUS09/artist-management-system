import {
  createUser,
  getUserById,
  updateUserById,
} from "@/app/data-access/user";
import { asyncHandler } from "@/app/utils/asyncHandler";
import { hash } from "@/app/utils/common";
import CustomError from "@/app/utils/customError";
import { User } from "@/lib/interface";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req: Request) => {
  const body = (await req.json()) as User;
  const { id, password } = body;

  if (id) {
    // Update existing user
    const user = await getUserById(id);

    if (!user) {
      throw new CustomError("User not found");
    }
    if (password) {
      body.password = await hash(password);
    } else {
      body.password = user.password;
    }

    const rows = await updateUserById(id, { ...user, ...body });

    return NextResponse.json({
      status: 200,
      message: "User updated successfully",
      body: rows[0],
    });
  } else {
    // Insert new user
    const rows = await createUser(body);

    return NextResponse.json({
      status: 201,
      message: "User created successfully",
      body: rows[0],
    });
  }
});
