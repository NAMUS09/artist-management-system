import { z } from "zod";
import { dobApiSchema, genderSchema } from "./common";

export const createArtistSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  dob: dobApiSchema,
  gender: genderSchema,
  address: z.string(),
  first_release_year: z
    .string()
    .nonempty({ message: "First release year is required" }),
  no_of_albums_released: z
    .string()
    .nonempty({ message: "No. of albums released is required" }),
});

export const createMultipleArtistSchema = z.array(createArtistSchema);

export type CreateArtist = z.infer<typeof createArtistSchema>;
export type CreateMultipleArtist = z.infer<typeof createMultipleArtistSchema>;
