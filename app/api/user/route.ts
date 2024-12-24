import { asyncHandler } from "@/app/utils/asyncHandler";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async (req: Request) => {
  const rows = await query("SELECT * FROM users", []);
  return NextResponse.json({ status: 200, body: rows });
});
