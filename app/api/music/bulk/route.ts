import { getArtistByName } from "@/app/data-access/artist";
import { createMusic } from "@/app/data-access/music";
import {
  CreateMultipleMusic,
  createMultipleMusicSchema,
} from "@/app/schemas/musicSchema";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { validateRequestBody } from "@/app/utils/validateBody";
import { Music } from "@/lib/interface";
import { NextRequest, NextResponse } from "next/server";

export const POST = roleAsyncHandler(
  ["super_admin", "artist_manager", "artist"],
  async (request: NextRequest) => {
    const body = (await request.json()) as CreateMultipleMusic;

    const [validationError, validatedFields] = validateRequestBody(
      createMultipleMusicSchema,
      body
    );

    if (validationError) {
      return NextResponse.json(validationError, { status: 400 }); // If there's an error, return it directly
    }

    // Create the musics

    for (const music of validatedFields) {
      const { artist_name, ...rest } = music;

      const dbArtist = await getArtistByName(artist_name);

      if (!dbArtist) {
        return NextResponse.json(
          { error: `Artist with name ${dbArtist.name} dosn't exist` },
          { status: 400 }
        );
      }

      // Create the music
      await createMusic({
        ...rest,
        artist_id: dbArtist.id,
      } as Music);
    }

    return NextResponse.json({ success: true, message: "Bulk musics created" });
  }
);
