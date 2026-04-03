import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    console.error("[middleware] Brak AUTH_SECRET");
  }

  const token = await getToken({
    req,
    secret,
  });

  const { pathname } = req.nextUrl;
  const role = token?.role as string | undefined;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const u = new URL("/login", req.url);
      u.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(u);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/client", req.url));
    }
  }

  if (pathname.startsWith("/client")) {
    if (!token) {
      const u = new URL("/login", req.url);
      u.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(u);
    }
    if (role !== "client") {
      return NextResponse.redirect(new URL("/admin/inquiries", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
