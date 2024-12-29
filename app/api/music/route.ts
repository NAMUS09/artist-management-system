import { asyncHandler } from "@/app/utils/asyncHandler";
import { query } from "@/lib/db";
import { Music } from "@/lib/interface";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async (req: Request) => {
  const body = (await req.json()) as Music;
  const { id, artist_id, title, album_name, genre } = body;

  if (id) {
    // Update existing album
    const rows = await query(
      `UPDATE musics
         SET artist_id = $1, title = $2, album_name = $3, genre = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
      [artist_id, title, album_name, genre, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ status: 404, body: "Album not found" });
    }

    return NextResponse.json({ status: 200, body: rows[0] });
  } else {
    // Insert new album
    const rows = await query(
      `INSERT INTO albums (artist_id, title, album_name, genre, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
      [artist_id, title, album_name, genre]
    );

    return NextResponse.json({ status: 201, body: rows[0] });
  }
});
