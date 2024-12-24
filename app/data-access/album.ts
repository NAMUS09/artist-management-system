import { query } from "@/lib/db";
import { Album } from "@/lib/interface";

export const getAlbumById = async (id: string) => {
  const rows = await query("SELECT * FROM albums WHERE id = $1", [id]);
  return rows[0];
};

export const getAlbumsByArtistId = async (artistId: string) => {
  const rows = await query("SELECT * FROM albums WHERE artist_id = $1", [
    artistId,
  ]);
  return rows;
};

export const getAlbums = async () => {
  const rows = await query("SELECT * FROM albums", []);
  return rows;
};

export const createAlbum = async (album: Album) => {
  const { artist_id, title, album_name, genre } = album;

  // Insert new album
  const rows = await query(
    `INSERT INTO albums (artist_id, title, album_name, genre, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *`,
    [artist_id, title, album_name, genre]
  );

  return rows;
};

export const updateAlbum = async (id: number, album: Album) => {
  const { artist_id, title, album_name, genre } = album;
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
