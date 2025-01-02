import { query } from "@/lib/db";
import { Artist } from "@/lib/interface";

interface ArtistWithId extends Artist {
  id: number;
}

export const getArtistById = async (id: string) => {
  const rows = await query("SELECT * FROM artists WHERE id = $1", [id]);
  return rows[0];
};

export const getArtistByName = async (name: string) => {
  const rows = await query("SELECT * FROM artists WHERE name = $1", [name]);
  return rows[0];
};

export const getArtists = async (page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;
  const rows = await query(
    `SELECT * FROM artists ORDER BY id DESC OFFSET $1 LIMIT $2`,
    [offset, pageSize]
  );

  const totalCountResult = await query(
    `SELECT COUNT(*) as totalcount FROM artists`,
    []
  );

  const totalCount = +totalCountResult[0]?.totalcount || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    artists: rows as ArtistWithId[],
    pagination: {
      currentPage: page,
      pageSize,
      totalPages,
      totalCount,
    },
  };
};

export const createArtist = async (artist: Artist) => {
  const {
    name,
    dob,
    gender,
    address,
    first_release_year,
    no_of_albums_released,
  } = artist;
  // Insert new artist
  const rows = await query(
    `INSERT INTO artists (name, dob, gender, address, first_release_year, no_of_albums_released, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING *`,
    [name, dob, gender, address, first_release_year, no_of_albums_released]
  );
  return rows;
};

export const updateArtist = async (id: number, artist: Artist) => {
  const {
    name,
    dob,
    gender,
    address,
    first_release_year,
    no_of_albums_released,
  } = artist;

  // Update existing artist
  const rows = await query(
    `UPDATE artists
         SET name = $1, dob = $2, gender = $3, address = $4, first_release_year = $5, no_of_albums_released = $6
         WHERE id = $7
         RETURNING *`,
    [name, dob, gender, address, first_release_year, no_of_albums_released, id]
  );

  return rows;
};
