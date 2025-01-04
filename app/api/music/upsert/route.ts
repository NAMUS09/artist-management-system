import { getArtistById } from "@/app/data-access/artist";
import {
  createMusic,
  getMusicById,
  updateMusic,
} from "@/app/data-access/music";
import {
  CreateMusicFromId,
  createMusicSchemaFromId,
} from "@/app/schemas/musicSchema";
import { asyncHandler } from "@/app/utils/asyncHandler";
import CustomError from "@/app/utils/customError";
import { validateRequestBody } from "@/app/utils/validateBody";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req: Request) => {
  const body = (await req.json()) as CreateMusicFromId;

  const [validationError, validatedFields] = validateRequestBody(
    createMusicSchemaFromId,
    body
  );

  if (validationError) {
    return NextResponse.json(validationError, { status: 400 }); // If there's an error, return it directly
  }

  const { id, artist_id, title, album_name, genre } = validatedFields;

  const music = {
    artist_id: parseInt(artist_id),
    title,
    album_name,
    genre,
  };

  // check artist_id exists
  const dbArtist = await getArtistById(+artist_id);

  if (!dbArtist) throw new CustomError("Artist not found", 404);

  if (id) {
    const dbMusic = await getMusicById(id);

    if (!dbMusic) {
      return NextResponse.json({ success: false, message: "Music not found" });
    }

    // Update existing music
    const rows = await updateMusic(id, music);

    return NextResponse.json({
      success: true,
      message: "Music updated",
      data: rows[0],
    });
  } else {
    // Insert new music
    const rows = await createMusic(music);

    return NextResponse.json({
      success: true,
      message: "Music created",
      data: rows[0],
    });
  }
});
