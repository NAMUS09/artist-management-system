import { createUser, getUserByEmail } from "@/app/data-access/user";
import {
  CreateMultipleUser,
  createMultipleUserSchema,
} from "@/app/schemas/userSchema";
import { hash } from "@/app/utils/common";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { validateRequestBody } from "@/app/utils/validateBody";
import { NextRequest, NextResponse } from "next/server";

export const POST = roleAsyncHandler(
  ["super_admin"],
  async (request: NextRequest) => {
    const body = (await request.json()) as CreateMultipleUser;

    const [validationError, validatedFields] = validateRequestBody(
      createMultipleUserSchema,
      body
    );

    if (validationError) {
      return NextResponse.json(validationError, { status: 400 }); // If there's an error, return it directly
    }

    // Create the users

    for (const user of validatedFields) {
      const dbUser = await getUserByEmail(user.email);

      if (dbUser) {
        return NextResponse.json(
          { error: `User with email ${user.email} already exists` },
          { status: 400 }
        );
      }

      const { dob, ...rest } = user;

      // Create the user
      await createUser({
        ...rest,
        dob: new Date(dob),
        password: await hash(user.password),
      });
    }

    return NextResponse.json({ success: true, message: "Bulk user created" });
  }
);
