import { getMusics } from "@/app/data-access/music";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { NextResponse } from "next/server";

export const GET = roleAsyncHandler(
  ["super_admin", "artist_manager", "artist"],
  async () => {
    const rows = await getMusics();
    return NextResponse.json({ success: true, musics: rows });
  }
);
