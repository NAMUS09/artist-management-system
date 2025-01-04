import { createArtist, getArtistByName } from "@/app/data-access/artist";
import {
  CreateMultipleArtist,
  createMultipleArtistSchema,
} from "@/app/schemas/artistSchema";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { validateRequestBody } from "@/app/utils/validateBody";
import { Artist } from "@/lib/interface";
import { NextRequest, NextResponse } from "next/server";

export const POST = roleAsyncHandler(
  ["super_admin", "artist_manager"],
  async (request: NextRequest) => {
    const body = (await request.json()) as CreateMultipleArtist;

    const [validationError, validatedFields] = validateRequestBody(
      createMultipleArtistSchema,
      body
    );

    if (validationError) {
      return NextResponse.json(validationError, { status: 400 }); // If there's an error, return it directly
    }

    // Create the artists

    for (const artist of validatedFields) {
      const dbArtist = await getArtistByName(artist.name);

      if (dbArtist) {
        return NextResponse.json(
          { error: `Artist with name ${dbArtist.name} already exists` },
          { status: 400 }
        );
      }

      const { dob, first_release_year, no_of_albums_released, ...rest } =
        artist;

      // Create the user
      await createArtist({
        ...rest,
        dob: new Date(dob),
        first_release_year: Number(first_release_year),
        no_of_albums_released: Number(no_of_albums_released),
      } as Artist);
    }

    return NextResponse.json({ success: true, message: "Bulk artist created" });
  }
);
