import { query } from "@/lib/db";
import { Music } from "@/lib/interface";

interface MusicWithId extends Music {
  id: number;
}

export const getMusicById = async (id: number) => {
  const rows = await query("SELECT * FROM musics WHERE id = $1", [id]);
  return rows[0];
};

export const getMusicsByArtistId = async (artistId: string) => {
  const rows = await query("SELECT * FROM musics WHERE artist_id = $1", [
    artistId,
  ]);
  return rows;
};

export const getMusics = async (page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;
  const rows = await query(
    `SELECT m.*, a.name as artist_name FROM musics as m
   INNER JOIN artists as a ON m.artist_id = a.id
   ORDER BY m.id DESC OFFSET $1 LIMIT $2`,
    [offset, pageSize]
  );

  const totalCountResult = await query(
    `SELECT COUNT(*) as totalcount FROM musics`,
    []
  );

  const totalCount = +totalCountResult[0]?.totalcount || 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    musics: rows as MusicWithId[],
    pagination: {
      currentPage: page,
      pageSize,
      totalPages,
      totalCount,
    },
  };
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
    `UPDATE musics
         SET artist_id = $1, title = $2, album_name = $3, genre = $4
         WHERE id = $5
         RETURNING *`,
    [artist_id, title, album_name, genre, id]
  );

  return rows;
};

export const deleteMusic = async (id: number) => {
  return query("DELETE FROM musics WHERE id = $1", [id]);
};
