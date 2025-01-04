import { deleteArtist, getArtistById } from "@/app/data-access/artist";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { NextResponse } from "next/server";

export const GET = roleAsyncHandler(
  ["super_admin", "artist_manager"],
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const artist = await getArtistById(+id);
    return NextResponse.json({
      success: true,
      artist,
      message: "Artist found",
    });
  }
);

export const DELETE = roleAsyncHandler(
  ["super_admin", "artist_manager"],
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    await deleteArtist(+id);
    return NextResponse.json({ success: true, message: "Artist deleted" });
  }
);
