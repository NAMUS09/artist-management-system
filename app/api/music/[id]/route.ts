import { asyncHandler } from "@/app/utils/asyncHandler";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const row = await query("SELECT * FROM musics WHERE id = $1", [id]);
    return NextResponse.json({ status: 200, body: row });
  }
);
