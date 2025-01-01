import { getUsers } from "@/app/data-access/user";
import { getPaginationParams } from "@/app/utils/paginationHelper";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { NextRequest, NextResponse } from "next/server";

export const GET = roleAsyncHandler(
  ["super_admin"],
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = getPaginationParams(searchParams);

    const rows = await getUsers(page, limit);

    return NextResponse.json({
      success: true,
      ...rows,
    });
  }
);
