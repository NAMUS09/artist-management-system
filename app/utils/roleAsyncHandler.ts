import { getCurrentUser } from "@/lib/auth";
import { Role } from "@/lib/interface";

import { NextRequest, NextResponse } from "next/server";

/**
 * A higher-order function that wraps an async handler in Next.js API routes to handle
 * role-based access control and error management.
 *
 * It checks if the user has the required role and catches any errors during execution.
 *
 * @param roles - The roles required to access the API route.
 * @param  fn - The asynchronous handler function that should be wrapped.
 * @returns  A new function that checks the user's role, handles errors,
 * and returns an appropriate response.
 */
const roleAsyncHandler = <Args extends unknown[]>(
  roles: Role[],
  fn: (request: NextRequest, ...args: Args) => Promise<NextResponse>
) => {
  return async (request: NextRequest, ...args: Args) => {
    try {
      const user = await getCurrentUser();
      const authRole = user?.role;

      if (!authRole) {
        return new NextResponse(
          "User roles are not defined or invalid. Unauthorized access.",
          { status: 401 }
        );
      }

      if (!roles.includes(authRole)) {
        return new NextResponse(
          `Access denied. The user does not have the required permissions.`,
          { status: 403 }
        );
      }

      return await fn(request, ...args);
    } catch (error) {
      console.error(
        "RBAC API Error:",
        error instanceof Error ? error.message : String(error)
      );
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
};

export default roleAsyncHandler;
