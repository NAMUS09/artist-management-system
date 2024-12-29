import { query } from "@/lib/db";
import { Music } from "@/lib/interface";

export const getMusicById = async (id: string) => {
  const rows = await query("SELECT * FROM musics WHERE id = $1", [id]);
  return rows[0];
};

export const getMusicsByArtistId = async (artistId: string) => {
  const rows = await query("SELECT * FROM musics WHERE artist_id = $1", [
    artistId,
  ]);
  return rows;
};

export const getMusics = async () => {
  const rows = await query("SELECT * FROM musics", []);
  return rows;
};

export const createMusic = async (music: Music) => {
  const { artist_id, title, album_name, genre } = music;

  // Insert new music
  const rows = await query(
    `INSERT INTO musics (artist_id, title, album_name, genre, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *`,
    [artist_id, title, album_name, genre]
  );

  return rows;
};

export const updateMusic = async (id: number, music: Music) => {
  const { artist_id, title, album_name, genre } = music;
  // Update existing album
  const rows = await query(
    `UPDATE albums
         SET artist_id = $1, title = $2, album_name = $3, genre = $4
         WHERE id = $5
         RETURNING *`,
    [artist_id, title, album_name, genre, id]
  );

  return rows;
};