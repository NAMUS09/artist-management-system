import { createArtist, updateArtist } from "@/app/data-access/artist";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { Artist } from "@/lib/interface";
import { NextResponse } from "next/server";

export const POST = roleAsyncHandler(
  ["super_admin", "artist_manager"],
  async (req: Request) => {
    const body = (await req.json()) as Artist;
    const { id } = body;

    if (id) {
      // Update existing artist
      const rows = await updateArtist(id, body);
      if (rows.length === 0) {
        return NextResponse.json({ status: 404, body: "Artist not found" });
      }

      return NextResponse.json({ status: 200, body: rows[0] });
    } else {
      // Insert new artist
      const rows = await createArtist(body);

      return NextResponse.json({ status: 201, body: rows[0] });
    }
  }
);
