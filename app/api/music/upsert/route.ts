import { createMusic, updateMusic } from "@/app/data-access/music";
import { asyncHandler } from "@/app/utils/asyncHandler";
import { Music } from "@/lib/interface";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req: Request) => {
  const body = (await req.json()) as Music;
  const { id } = body;

  if (id) {
    // Update existing music
    const rows = await updateMusic(id, body);

    if (rows.length === 0) {
      return NextResponse.json({ status: 404, body: "Music not found" });
    }

    return NextResponse.json({ status: 200, body: rows[0] });
  } else {
    // Insert new music
    const rows = await createMusic(body);

    return NextResponse.json({ status: 201, body: rows[0] });
  }
});
