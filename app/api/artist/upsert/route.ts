import { createArtist, updateArtist } from "@/app/data-access/artist";
import { CreateArtist, createArtistSchema } from "@/app/schemas/artistSchema";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { validateRequestBody } from "@/app/utils/validateBody";
import { Artist } from "@/lib/interface";

import { NextResponse } from "next/server";

export const POST = roleAsyncHandler(
  ["super_admin", "artist_manager"],
  async (req: Request) => {
    const body = (await req.json()) as CreateArtist;

    const [validationError, validatedFields] = validateRequestBody(
      createArtistSchema,
      body
    );

    if (validationError) {
      return NextResponse.json(validationError, { status: 400 }); // If there's an error, return it directly
    }

    const {
      id,
      name,
      dob,
      gender,
      address,
      first_release_year,
      no_of_albums_released,
    } = validatedFields;

    const artist = {
      name,
      dob: new Date(dob),
      gender,
      address,
      first_release_year: +first_release_year,
      no_of_albums_released: +no_of_albums_released,
    } as Artist;

    if (id) {
      // Update existing artist
      const rows = await updateArtist(id, artist);
      if (rows.length === 0) {
        return NextResponse.json({ status: 404, message: "Artist not found" });
      }

      return NextResponse.json({
        status: 200,
        message: "Artist updated",
        data: rows[0],
      });
    } else {
      // Insert new artist
      const rows = await createArtist(artist);

      return NextResponse.json({
        status: 201,
        message: "Artist created",
        data: rows[0],
      });
    }
  }
);
