import { decodeToken } from "@/app/utils/token";
import { cookies, headers } from "next/headers";

/**
 * Get current user from next auth or headers
 * @returns user
 */
export const getCurrentUser = async () => {
  // Get token from cookies
  const cookieStore = await cookies();
  const cookieAccessToken = cookieStore.get("accessToken")?.value;

  // Get token from headers
  const headersList = await headers();
  const headerAccessToken = headersList
    .get("Authorization")
    ?.split("Bearer ")[1];

  const accessToken = cookieAccessToken || headerAccessToken;

  if (!accessToken) return null;

  // Decode the token
  const decodedToken = await decodeToken(accessToken);

  if (!decodedToken) return null;

  return { ...decodedToken, accessToken };
};
