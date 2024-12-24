import { asyncHandler } from "@/app/utils/asyncHandler";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req: Request) => {
  return NextResponse.json({ status: 200, body: "POST /api/auth/registe" });
});
