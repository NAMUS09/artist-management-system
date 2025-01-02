import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = roleAsyncHandler(
  ["super_admin"],
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const row = await query("SELECT * FROM users WHERE id = $1", [id]);
    return NextResponse.json({ status: 200, body: row });
  }
);
