import { deleteMusic, getMusicById } from "@/app/data-access/music";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { NextResponse } from "next/server";

export const GET = roleAsyncHandler(
  ["super_admin", "artist_manager", "artist"],
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const music = await getMusicById(+id);
    return NextResponse.json({
      success: true,
      music,
      message: "Music found",
    });
  }
);

export const DELETE = roleAsyncHandler(
  ["super_admin", "artist_manager", "artist"],
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    await deleteMusic(+id);
    return NextResponse.json({ success: true, message: "Music deleted" });
  }
);
