import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("firebaseToken")?.value;

  const protectedRoutes = ["/dashboard", "/musician", "/employer", "/seller", "/listener"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/musician/:path*",
    "/employer/:path*",
    "/seller/:path*",
    "/listener/:path*",
  ],
};
