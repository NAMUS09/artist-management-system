import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "@/app/data-access/user";
import { CreateUser, createUserSchema } from "@/app/schemas/userSchema";
import { hash } from "@/app/utils/common";
import CustomError from "@/app/utils/customError";
import roleAsyncHandler from "@/app/utils/roleAsyncHandler";
import { generateToken } from "@/app/utils/token";
import { validateRequestBody } from "@/app/utils/validateBody";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/lib/interface";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = roleAsyncHandler(["super_admin"], async (req: Request) => {
  const cookieStore = await cookies();
  const loggedinUser = await getCurrentUser();
  const body = (await req.json()) as CreateUser;

  const [validationError, validatedFields] = validateRequestBody(
    createUserSchema,
    body
  );

  if (validationError) {
    return NextResponse.json(validationError, { status: 400 }); // If there's an error, return it directly
  }

  const { id, dob, password } = validatedFields;

  const prepareUser = {
    ...validatedFields,
    dob: new Date(dob),
  };

  if (id) {
    // Update existing user
    const user = await getUserById(id);

    if (!user) {
      throw new CustomError("User not found");
    }
    if (password) {
      console.log(password);
      body.password = await hash(password);
    } else {
      body.password = user.password;
    }

    const rows = await updateUserById(id, { ...user, ...prepareUser } as User);

    // check role has updated, and if smae user is logged in
    if (user.role !== prepareUser.role && loggedinUser?.email === user.email) {
      console.log("role chngad");
      // role changed
      // create and  update cookies /token
      // safe to generate token
      const { token, expires } = await generateToken({
        id: user.id,
        email: user.email!,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
      });

      // update user token
      const { id, ...rest } = user;
      await updateUserById(id, {
        ...rest,
        accessToken: token,
        expires,
      } as unknown as User);

      cookieStore.set({
        name: "accessToken",
        value: token,
        httpOnly: true,
        path: "/",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "User updated successfully",
      body: rows[0],
    });
  } else {
    // check user before create
    const user = await getUserByEmail(prepareUser.email);

    if (user) {
      throw new CustomError("User already exists", 409);
    }

    // Insert new user
    const rows = await createUser(prepareUser as User);

    return NextResponse.json({
      status: 201,
      message: "User created successfully",
      body: rows[0],
    });
  }
});
