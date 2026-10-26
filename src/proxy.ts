import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Handle crm.mamy-liel.com subdomain → redirect to /admin/clients
  const hostname = request.headers.get("host") || "";
  if (hostname.startsWith("crm.")) {
    const path = request.nextUrl.pathname;
    if (path === "/" || path === "" || (!path.startsWith("/admin") && !path.startsWith("/api/"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/clients";
      return NextResponse.rewrite(url);
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

// Runs only where it is needed: the Supabase session refresh for the academy
// and its login pages, and the crm.* host rewrite. Every public page, bot hit
// and font request used to boot this Node function and call Supabase auth,
// spending the Vercel CPU allowance this account shares with six other sites.
export const config = {
  matcher: [
    "/academy/:path*",
    "/auth/:path*",
    "/api/academy/:path*",
    "/api/auth/:path*",
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ico|json|txt|xml)$).*)",
      has: [{ type: "host", value: "crm\\..*" }],
    },
  ],
};
