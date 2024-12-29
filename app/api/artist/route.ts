import { getArtists } from "@/app/data-access/artist";
import { asyncHandler } from "@/app/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const rows = await getArtists();
  return NextResponse.json({ success: true, artists: rows });
});
