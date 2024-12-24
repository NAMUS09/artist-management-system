import { createAlbum, updateAlbum } from "@/app/data-access/album";
import { asyncHandler } from "@/app/utils/asyncHandler";
import { Album } from "@/lib/interface";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req: Request) => {
  const body = (await req.json()) as Album;
  const { id } = body;

  if (id) {
    // Update existing album
    const rows = await updateAlbum(id, body);

    if (rows.length === 0) {
      return NextResponse.json({ status: 404, body: "Album not found" });
    }

    return NextResponse.json({ status: 200, body: rows[0] });
  } else {
    // Insert new album
    const rows = await createAlbum(body);

    return NextResponse.json({ status: 201, body: rows[0] });
  }
});
