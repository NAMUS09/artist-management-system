import { getArtists } from "@/app/data-access/artist";
import { getPaginationParams } from "@/app/utils/paginationHelper";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { NextRequest, NextResponse } from "next/server";

export const GET = roleAsyncHandler(
  ["super_admin", "artist_manager"],
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = getPaginationParams(searchParams);

    const rows = await getArtists(page, limit);

    return NextResponse.json({
      success: true,
      ...rows,
    });
  }
);
