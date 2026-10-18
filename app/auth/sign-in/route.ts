import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function safeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/account";
  }

  try {
    const parsed = new URL(value, "https://vixen.invalid");
    return parsed.origin === "https://vixen.invalid"
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : "/account";
  } catch {
    return "/account";
  }
}

function signInErrorResponse(request: NextRequest, nextPath: string, accountType: string) {
  const url = new URL("/sign-up", request.url);
  url.searchParams.set("type", accountType === "creator" ? "creator" : "member");
  url.searchParams.set("mode", "signin");
  url.searchParams.set("error", "signin");
  url.searchParams.set("next", nextPath);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const nextPath = safeNextPath(formData.get("next"));
  const accountType = formData.get("type") === "creator" ? "creator" : "member";

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return signInErrorResponse(request, nextPath, accountType);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return signInErrorResponse(request, nextPath, accountType);

  let response: NextResponse | undefined;
  const getRedirectResponse = () => {
    response ??= NextResponse.redirect(new URL(nextPath, request.url), { status: 303 });
    return response;
  };

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        const outgoing = getRedirectResponse();
        cookiesToSet.forEach(({ name, value, options }) => outgoing.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([name, value]) => outgoing.headers.set(name, value));
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.session) return signInErrorResponse(request, nextPath, accountType);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return signInErrorResponse(request, nextPath, accountType);

  // A successful sign-in must have produced SSR cookies before the account page runs.
  if (!response) return signInErrorResponse(request, nextPath, accountType);

  return response;
}
