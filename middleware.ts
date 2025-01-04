import { NextRequest, NextResponse } from "next/server";
import { routes } from "./components/sidebar/AppSidebar";
import { getCurrentUser } from "./lib/auth";

const PUBLIC_ROUTES = ["/login", "/register"];

const PRIVATE_API_ROUTES = ["/api/user", "/api/artist", "/api/music"];

export async function middleware(req: NextRequest) {
  const currentUser = await getCurrentUser();
  const { pathname } = req.nextUrl;

  // Handle API routes
  if (pathname.startsWith("/api")) {
    if (
      PRIVATE_API_ROUTES.some((route) => pathname.startsWith(route)) &&
      !currentUser
    ) {
      // If not authenticated, return a 401 Unauthorized response
      return new NextResponse("Unauthorized from middleware", {
        status: 401,
      });
    }

    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // If the user is not signed in and the route is not public, redirect to login
  if (!currentUser && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the user is signed in and the route is public, redirect to home
  if (
    currentUser &&
    (isPublicRoute ||
      routes.some(
        (route) =>
          route.url === pathname && !route.roles.includes(currentUser.role)
      ))
  ) {
    const validRoutesForUser = routes.filter((route) =>
      route.roles.includes(currentUser.role)
    );
    // Redirect to the first valid route for the user
    return NextResponse.redirect(new URL(validRoutesForUser[0].url, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - file extension
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images
     */
    "/((?!.+\\.[\\w]+$|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)",
  ],
};
