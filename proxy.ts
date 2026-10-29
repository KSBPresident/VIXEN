import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isPublicAuthRoute = pathname === "/sign-up" || pathname.startsWith("/auth/") || pathname.startsWith("/api/");

  if (!url || !key) {
    if (isPublicAuthRoute) return NextResponse.next({ request });
    const destination = request.nextUrl.clone();
    destination.pathname = "/sign-up";
    destination.search = new URLSearchParams({ type: "member", next: pathname + request.nextUrl.search }).toString();
    return NextResponse.redirect(destination);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  const { data: { claims } } = await supabase.auth.getClaims();
  if (!claims && !isPublicAuthRoute) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/sign-up";
    destination.search = new URLSearchParams({
      type: "member",
      next: pathname + request.nextUrl.search,
    }).toString();
    return NextResponse.redirect(destination);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
