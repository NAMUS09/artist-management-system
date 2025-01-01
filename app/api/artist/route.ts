import { getArtists } from "@/app/data-access/artist";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { NextResponse } from "next/server";

export const GET = roleAsyncHandler(
  ["super_admin", "artist_manager"],
  async () => {
    const rows = await getArtists();
    return NextResponse.json({ success: true, artists: rows });
  }
);
