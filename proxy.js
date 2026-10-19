import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Memanggil getUser() untuk me-refresh sesi dan memastikan user valid
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Jika membuka /admin/login
  if (pathname === "/admin/login") {
    // Kalau sudah login dan membuka /admin/login, redirect ke /admin
    if (user) {
      const adminUrl = new URL("/admin", request.url);
      const redirectResponse = NextResponse.redirect(adminUrl);
      response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c));
      return redirectResponse;
    }
    return response;
  }

  // 2. Rute admin lainnya: tanpa user, redirect ke /admin/login
  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c));
    return redirectResponse;
  }

  return response;
}

export { proxy as middleware };
export default proxy;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
