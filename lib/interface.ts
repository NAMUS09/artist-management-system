type Role = "super_admin" | "artist_manager" | "artist";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  dob: Date;
  gender: "male" | "female" | "other";
  address: string;
  created_at?: string;
  updated_at?: string;
  role: Role;
  access_token?: string | null;
  expires?: string | null;
}
interface Artist {
  id: number;
  name: string;
  dob?: string;
  gender: "Male" | "Female" | "Other";
  address?: string;
  first_release_year?: number;
  no_of_albums_released: number;
  created_at: string;
  updated_at: string;
}

interface Music {
  id: number;
  artist_id: number;
  title: string;
  album_name: string;
  genre: "rnb" | "country" | "classic" | "rock" | "jazz";
  created_at: string;
  updated_at: string;
}

interface BaseResponse {
  success: boolean;
  message: string;
}

export interface PaginationResponse {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

interface BaseErrorResponse {
  success: boolean;
  message: string;
}

export {
  type Artist,
  type BaseErrorResponse,
  type BaseResponse,
  type Music,
  type Role,
  type User,
};
