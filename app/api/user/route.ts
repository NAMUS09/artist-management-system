import { getUsers } from "@/app/data-access/user";
import { asyncHandler } from "@/app/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const rows = await getUsers();
  return NextResponse.json({ success: true, users: rows });
});
