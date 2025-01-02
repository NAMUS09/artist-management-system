import { z } from "zod";

export const createMusicSchema = z.object({
  artist_name: z.string().nonempty({ message: "Artist name is required" }),
  title: z.string().nonempty({ message: "Title is required" }),
  album_name: z.string().nonempty({ message: "Album name is required" }),
  genre: z.enum(["rnb", "country", "classic", "rock", "jazz"], {
    message: "Please select a genre",
  }),
});

export const createMultipleMusicSchema = z.array(createMusicSchema);

export type CreateMusic = z.infer<typeof createMusicSchema>;
export type CreateMultipleMusic = z.infer<typeof createMultipleMusicSchema>;
