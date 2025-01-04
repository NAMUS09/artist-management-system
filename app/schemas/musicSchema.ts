import { z } from "zod";

const genereSchema = z
  .string()
  .nonempty({ message: "Genre is required" })
  .refine(
    (value) => ["rnb", "country", "classic", "rock", "jazz"].includes(value),
    { message: "Please select a valid genre" }
  );

export const createMusicSchema = z.object({
  artist_name: z.string().nonempty({ message: "Artist name is required" }),
  title: z.string().nonempty({ message: "Title is required" }),
  album_name: z.string().nonempty({ message: "Album name is required" }),
  genre: genereSchema,
});

export const createMusicSchemaFromId = z.object({
  id: z.number().optional(),
  artist_id: z.string().nonempty({ message: "Artist name is required" }),
  title: z.string().nonempty({ message: "Title is required" }),
  album_name: z.string().nonempty({ message: "Album name is required" }),
  genre: genereSchema,
});

export const createMultipleMusicSchema = z.array(createMusicSchema);

export type CreateMusic = z.infer<typeof createMusicSchema>;
export type CreateMusicFromId = z.infer<typeof createMusicSchemaFromId>;
export type CreateMultipleMusic = z.infer<typeof createMultipleMusicSchema>;
