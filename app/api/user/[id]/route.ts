import { deleteUser, getUserById } from "@/app/data-access/user";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { NextResponse } from "next/server";

export const GET = roleAsyncHandler(
  ["super_admin"],
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const user = await getUserById(+id);
    return NextResponse.json({ success: true, user, message: "User found" });
  }
);

export const DELETE = roleAsyncHandler(
  ["super_admin"],
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    await deleteUser(+id);
    return NextResponse.json({
      success: true,
      message: "User deleted",
    });
  }
);
