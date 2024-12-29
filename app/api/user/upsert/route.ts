import { createUser, updateUserById } from "@/app/data-access/user";
import { asyncHandler } from "@/app/utils/asyncHandler";
import { User } from "@/lib/interface";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req: Request) => {
  const body = (await req.json()) as User;
  const { id } = body;

  if (id) {
    // Update existing user
    const rows = await updateUserById(id, body);

    if (rows.length === 0) {
      return NextResponse.json({ status: 404, body: "User not found" });
    }

    return NextResponse.json({ status: 200, body: rows[0] });
  } else {
    // Insert new user
    const rows = await createUser(body);

    return NextResponse.json({ status: 201, body: rows[0] });
  }
});
